// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgentTipToken (ATIP)
 * @dev ERC-20 token for the AgentTip economy
 *
 * Features:
 * - Standard ERC-20 functionality (transfer, approve, etc.)
 * - Mintable: Owner can create new tokens
 * - Burnable: Users can destroy their tokens
 * - Access Control: Only owner can mint
 *
 * Use Case: AI agents earn ATIP tokens by providing services
 */
contract AgentTipToken is ERC20, ERC20Burnable, Ownable {

    // ============================
    // STATE VARIABLES
    // ============================

    /// @notice Maximum supply cap (1 billion tokens)
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;

    /// @notice Total tokens minted (tracked separately from totalSupply for burns)
    uint256 public totalMinted;

    // ============================
    // EVENTS
    // ============================

    /// @notice Emitted when new tokens are minted
    event TokensMinted(address indexed to, uint256 amount);

    /// @notice Emitted when tokens are burned
    event TokensBurned(address indexed from, uint256 amount);

    /// @notice Emitted when an agent earns tokens for service
    event AgentEarned(address indexed agent, uint256 amount, string serviceType);

    // ============================
    // CONSTRUCTOR
    // ============================

    /**
     * @dev Initializes the token with name, symbol, and initial supply
     * @param initialOwner Address that will own the contract and receive initial tokens
     */
    constructor(address initialOwner)
        ERC20("AgentTip", "ATIP")
        Ownable(initialOwner)
    {
        // Mint initial supply to the owner (1 million tokens)
        uint256 initialSupply = 1_000_000 * 10**decimals();
        _mint(initialOwner, initialSupply);
        totalMinted = initialSupply;

        emit TokensMinted(initialOwner, initialSupply);
    }

    // ============================
    // MINTING FUNCTIONS
    // ============================

    /**
     * @dev Mints new tokens to a specified address
     * @param to Address to receive the tokens
     * @param amount Amount of tokens to mint (in wei, with 18 decimals)
     *
     * Requirements:
     * - Only owner can call
     * - Cannot exceed MAX_SUPPLY
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalMinted + amount <= MAX_SUPPLY, "Exceeds maximum supply");

        _mint(to, amount);
        totalMinted += amount;

        emit TokensMinted(to, amount);
    }

    /**
     * @dev Rewards an agent with tokens for completing a service
     * @param agent Address of the agent to reward
     * @param amount Amount of tokens to reward
     * @param serviceType Description of the service provided
     *
     * This function is called by the marketplace contract or owner
     */
    function rewardAgent(address agent, uint256 amount, string memory serviceType)
        public
        onlyOwner
    {
        require(totalMinted + amount <= MAX_SUPPLY, "Exceeds maximum supply");

        _mint(agent, amount);
        totalMinted += amount;

        emit AgentEarned(agent, amount, serviceType);
        emit TokensMinted(agent, amount);
    }

    // ============================
    // BURNING FUNCTIONS
    // ============================

    /**
     * @dev Burns tokens from caller's account
     * @param amount Amount of tokens to burn
     *
     * Inherited from ERC20Burnable
     * Note: totalSupply decreases, but totalMinted stays the same
     */
    function burn(uint256 amount) public virtual override {
        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Burns tokens from specified account (requires allowance)
     * @param account Account to burn from
     * @param amount Amount to burn
     */
    function burnFrom(address account, uint256 amount) public virtual override {
        super.burnFrom(account, amount);
        emit TokensBurned(account, amount);
    }

    // ============================
    // VIEW FUNCTIONS
    // ============================

    /**
     * @dev Returns the remaining tokens that can be minted
     */
    function remainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - totalMinted;
    }

    /**
     * @dev Returns token info in a single call
     */
    function tokenInfo() public view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint256 tokenDecimals,
        uint256 currentSupply,
        uint256 maxSupply,
        uint256 remaining
    ) {
        return (
            name(),
            symbol(),
            decimals(),
            totalSupply(),
            MAX_SUPPLY,
            remainingSupply()
        );
    }

    // ============================
    // HELPER FUNCTIONS
    // ============================

    /**
     * @dev Converts human-readable amount to wei (with 18 decimals)
     * @param amount The amount in whole tokens (e.g., 100 for 100 ATIP)
     */
    function toWei(uint256 amount) public view returns (uint256) {
        return amount * 10**decimals();
    }

    /**
     * @dev Converts wei to human-readable amount
     * @param amount The amount in wei
     */
    function fromWei(uint256 amount) public view returns (uint256) {
        return amount / 10**decimals();
    }
}
