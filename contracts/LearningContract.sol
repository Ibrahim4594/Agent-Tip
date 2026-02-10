// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// This is a learning contract to understand Solidity basics
contract LearningContract {

    // ============================
    // PART 1: DATA TYPES
    // ============================

    // 1. NUMBERS
    uint256 public myAge = 25;              // Unsigned integer (positive only)
    int256 public temperature = -5;          // Signed integer (can be negative)

    // 2. BOOLEAN
    bool public isActive = true;             // true or false

    // 3. ADDRESS (wallet or contract address)
    address public owner;                    // Ethereum address

    // 4. STRING
    string public name = "AgentTip";         // Text

    // 5. BYTES
    bytes32 public data;                     // Raw data

    // ============================
    // PART 2: MAPPINGS (like dictionaries)
    // ============================

    // mapping(key => value)
    mapping(address => uint256) public balances;        // Address to balance
    mapping(address => string) public userNames;        // Address to name

    // ============================
    // PART 3: ARRAYS
    // ============================

    uint256[] public numbers;                // Dynamic array
    address[] public users;                  // Array of addresses

    // ============================
    // PART 4: CONSTRUCTOR (runs once when deployed)
    // ============================

    constructor() {
        owner = msg.sender;                  // Set deployer as owner
        name = "Learning Contract";
    }

    // ============================
    // PART 5: FUNCTIONS
    // ============================

    // PUBLIC function - anyone can call
    function setAge(uint256 _newAge) public {
        myAge = _newAge;
    }

    // VIEW function - reads data, doesn't change anything
    function getAge() public view returns (uint256) {
        return myAge;
    }

    // PURE function - doesn't read or write, just computes
    function addNumbers(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }

    // Function with REQUIRE (validation)
    function setName(string memory _newName) public {
        require(msg.sender == owner, "Only owner can change name");
        name = _newName;
    }

    // ============================
    // PART 6: EVENTS (logs on blockchain)
    // ============================

    event NameChanged(string oldName, string newName);
    event BalanceUpdated(address user, uint256 newBalance);

    function updateBalance(uint256 _amount) public {
        balances[msg.sender] = _amount;
        emit BalanceUpdated(msg.sender, _amount);
    }

    // ============================
    // PART 7: MODIFIERS (reusable checks)
    // ============================

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;  // Continue with function
    }

    function restrictedFunction() public onlyOwner {
        // Only owner can call this
    }

    // ============================
    // PART 8: SPECIAL VARIABLES
    // ============================

    function specialVariables() public view returns (
        address,    // Who called this function
        uint256,    // Current block number
        uint256     // Current timestamp
    ) {
        return (
            msg.sender,         // Caller's address
            block.number,       // Current block
            block.timestamp     // Current time
        );
    }
}
