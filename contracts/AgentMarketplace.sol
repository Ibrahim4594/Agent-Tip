// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentMarketplace
 * @dev Marketplace for AI agents to offer and sell services
 *
 * Features:
 * - Agents can list services with prices in ATIP tokens
 * - Users can purchase services using ATIP
 * - Service lifecycle management (created → purchased → completed)
 * - Transaction fees to sustain the economy
 * - Full event logging for transparency
 */
contract AgentMarketplace is ReentrancyGuard, Ownable {

    // ============================
    // STATE VARIABLES
    // ============================

    /// @notice The ATIP token contract
    IERC20 public atipToken;

    /// @notice Platform fee percentage (2% = 200 basis points)
    uint256 public platformFeePercent = 200; // 2%
    uint256 public constant FEE_DENOMINATOR = 10000; // 100% = 10000

    /// @notice Treasury wallet for collected fees
    address public treasury;

    /// @notice Total fees collected
    uint256 public totalFeesCollected;

    /// @notice Service counter for unique IDs
    uint256 public serviceCount;

    /// @notice Service status enum
    enum ServiceStatus {
        Active,      // Listed and available
        Purchased,   // Bought but not completed
        Completed,   // Service fulfilled
        Cancelled    // Cancelled by agent
    }

    /// @notice Service struct
    struct Service {
        uint256 id;
        address agent;
        string name;
        string description;
        uint256 price;           // Price in ATIP tokens (wei)
        ServiceStatus status;
        address buyer;           // Who purchased it
        uint256 createdAt;
        uint256 purchasedAt;
        uint256 completedAt;
    }

    /// @notice Mapping of service ID to Service
    mapping(uint256 => Service) public services;

    /// @notice Mapping of agent address to their service IDs
    mapping(address => uint256[]) public agentServices;

    /// @notice Mapping of buyer address to purchased service IDs
    mapping(address => uint256[]) public buyerPurchases;

    // ============================
    // EVENTS
    // ============================

    event ServiceCreated(
        uint256 indexed serviceId,
        address indexed agent,
        string name,
        uint256 price
    );

    event ServicePurchased(
        uint256 indexed serviceId,
        address indexed buyer,
        address indexed agent,
        uint256 price,
        uint256 fee
    );

    event ServiceCompleted(
        uint256 indexed serviceId,
        address indexed agent,
        address indexed buyer
    );

    event ServiceCancelled(
        uint256 indexed serviceId,
        address indexed agent
    );

    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event TreasuryUpdated(address oldTreasury, address newTreasury);

    // ============================
    // CONSTRUCTOR
    // ============================

    /**
     * @dev Initialize marketplace with ATIP token address
     * @param _atipToken Address of the ATIP token contract
     * @param initialOwner Address that will own the contract
     */
    constructor(address _atipToken, address initialOwner) Ownable(initialOwner) {
        require(_atipToken != address(0), "Invalid token address");
        atipToken = IERC20(_atipToken);
        treasury = initialOwner; // Owner is initial treasury
    }

    // ============================
    // SERVICE CREATION
    // ============================

    /**
     * @dev Create a new service listing
     * @param name Service name
     * @param description Service description
     * @param price Price in ATIP tokens (in wei, 18 decimals)
     */
    function createService(
        string memory name,
        string memory description,
        uint256 price
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(price > 0, "Price must be greater than 0");

        uint256 serviceId = serviceCount++;

        services[serviceId] = Service({
            id: serviceId,
            agent: msg.sender,
            name: name,
            description: description,
            price: price,
            status: ServiceStatus.Active,
            buyer: address(0),
            createdAt: block.timestamp,
            purchasedAt: 0,
            completedAt: 0
        });

        agentServices[msg.sender].push(serviceId);

        emit ServiceCreated(serviceId, msg.sender, name, price);

        return serviceId;
    }

    // ============================
    // SERVICE PURCHASE
    // ============================

    /**
     * @dev Purchase a service with ATIP tokens
     * @param serviceId The ID of the service to purchase
     */
    function purchaseService(uint256 serviceId) external nonReentrant {
        Service storage service = services[serviceId];

        require(service.id == serviceId, "Service does not exist");
        require(service.status == ServiceStatus.Active, "Service not available");
        require(service.agent != msg.sender, "Cannot buy your own service");

        // Calculate fee
        uint256 fee = (service.price * platformFeePercent) / FEE_DENOMINATOR;
        uint256 agentAmount = service.price - fee;

        // Transfer ATIP from buyer to agent
        require(
            atipToken.transferFrom(msg.sender, service.agent, agentAmount),
            "Payment to agent failed"
        );

        // Transfer fee to treasury
        if (fee > 0) {
            require(
                atipToken.transferFrom(msg.sender, treasury, fee),
                "Fee transfer failed"
            );
            totalFeesCollected += fee;
        }

        // Update service
        service.status = ServiceStatus.Purchased;
        service.buyer = msg.sender;
        service.purchasedAt = block.timestamp;

        buyerPurchases[msg.sender].push(serviceId);

        emit ServicePurchased(serviceId, msg.sender, service.agent, service.price, fee);
    }

    // ============================
    // SERVICE COMPLETION
    // ============================

    /**
     * @dev Mark a service as completed (agent only)
     * @param serviceId The ID of the service
     */
    function completeService(uint256 serviceId) external {
        Service storage service = services[serviceId];

        require(service.agent == msg.sender, "Only agent can complete");
        require(service.status == ServiceStatus.Purchased, "Service not purchased");

        service.status = ServiceStatus.Completed;
        service.completedAt = block.timestamp;

        emit ServiceCompleted(serviceId, service.agent, service.buyer);
    }

    /**
     * @dev Cancel an active service (agent only)
     * @param serviceId The ID of the service
     */
    function cancelService(uint256 serviceId) external {
        Service storage service = services[serviceId];

        require(service.agent == msg.sender, "Only agent can cancel");
        require(service.status == ServiceStatus.Active, "Can only cancel active services");

        service.status = ServiceStatus.Cancelled;

        emit ServiceCancelled(serviceId, service.agent);
    }

    // ============================
    // VIEW FUNCTIONS
    // ============================

    /**
     * @dev Get service details
     * @param serviceId The ID of the service
     */
    function getService(uint256 serviceId) external view returns (Service memory) {
        return services[serviceId];
    }

    /**
     * @dev Get all services created by an agent
     * @param agent The agent's address
     */
    function getAgentServices(address agent) external view returns (uint256[] memory) {
        return agentServices[agent];
    }

    /**
     * @dev Get all services purchased by a buyer
     * @param buyer The buyer's address
     */
    function getBuyerPurchases(address buyer) external view returns (uint256[] memory) {
        return buyerPurchases[buyer];
    }

    /**
     * @dev Get all active services
     */
    function getActiveServices() external view returns (uint256[] memory) {
        uint256 activeCount = 0;

        // Count active services
        for (uint256 i = 0; i < serviceCount; i++) {
            if (services[i].status == ServiceStatus.Active) {
                activeCount++;
            }
        }

        // Create array of active service IDs
        uint256[] memory activeServiceIds = new uint256[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < serviceCount; i++) {
            if (services[i].status == ServiceStatus.Active) {
                activeServiceIds[currentIndex] = i;
                currentIndex++;
            }
        }

        return activeServiceIds;
    }

    /**
     * @dev Get marketplace statistics
     */
    function getMarketplaceStats() external view returns (
        uint256 totalServices,
        uint256 totalPurchases,
        uint256 totalCompleted,
        uint256 feesCollected
    ) {
        uint256 purchases = 0;
        uint256 completed = 0;

        for (uint256 i = 0; i < serviceCount; i++) {
            if (services[i].status == ServiceStatus.Purchased) {
                purchases++;
            } else if (services[i].status == ServiceStatus.Completed) {
                completed++;
                purchases++; // Completed services were also purchased
            }
        }

        return (
            serviceCount,
            purchases,
            completed,
            totalFeesCollected
        );
    }

    // ============================
    // ADMIN FUNCTIONS
    // ============================

    /**
     * @dev Update platform fee (owner only)
     * @param newFeePercent New fee in basis points (200 = 2%)
     */
    function setPlatformFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 1000, "Fee too high (max 10%)");
        uint256 oldFee = platformFeePercent;
        platformFeePercent = newFeePercent;
        emit PlatformFeeUpdated(oldFee, newFeePercent);
    }

    /**
     * @dev Update treasury address (owner only)
     * @param newTreasury New treasury address
     */
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }
}
