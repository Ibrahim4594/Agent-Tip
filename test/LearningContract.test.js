const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LearningContract - Understanding Solidity", function () {
  let contract;
  let owner;
  let user1;

  // Deploy contract before each test
  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();
    const LearningContract = await ethers.getContractFactory("LearningContract");
    contract = await LearningContract.deploy();
  });

  describe("Part 1: Data Types", function () {
    it("Should read public variables", async function () {
      // Read the public variables
      const age = await contract.myAge();
      const temp = await contract.temperature();
      const isActive = await contract.isActive();
      const name = await contract.name();

      console.log("Age:", age.toString());
      console.log("Temperature:", temp.toString());
      console.log("Is Active:", isActive);
      console.log("Name:", name);

      expect(age).to.equal(25);
      expect(temp).to.equal(-5);
      expect(isActive).to.equal(true);
      expect(name).to.equal("Learning Contract");
    });

    it("Should identify the owner", async function () {
      const contractOwner = await contract.owner();
      console.log("Owner address:", contractOwner);
      expect(contractOwner).to.equal(owner.address);
    });
  });

  describe("Part 2: Functions", function () {
    it("Should update age with setAge function", async function () {
      // Change age from 25 to 30
      await contract.setAge(30);

      const newAge = await contract.getAge();
      console.log("New age:", newAge.toString());
      expect(newAge).to.equal(30);
    });

    it("Should add two numbers (pure function)", async function () {
      const result = await contract.addNumbers(5, 10);
      console.log("5 + 10 =", result.toString());
      expect(result).to.equal(15);
    });

    it("Should only allow owner to change name", async function () {
      // Owner can change name
      await contract.setName("New Name");
      expect(await contract.name()).to.equal("New Name");

      // Non-owner cannot change name
      await expect(
        contract.connect(user1).setName("Hacker Name")
      ).to.be.revertedWith("Only owner can change name");
    });
  });

  describe("Part 3: Mappings & State", function () {
    it("Should update balance mapping", async function () {
      // Set balance for owner
      await contract.updateBalance(1000);

      const balance = await contract.balances(owner.address);
      console.log("Owner balance:", balance.toString());
      expect(balance).to.equal(1000);
    });
  });

  describe("Part 4: Events", function () {
    it("Should emit BalanceUpdated event", async function () {
      await expect(contract.updateBalance(500))
        .to.emit(contract, "BalanceUpdated")
        .withArgs(owner.address, 500);

      console.log("✅ Event emitted successfully!");
    });
  });

  describe("Part 5: Special Variables", function () {
    it("Should read msg.sender and block data", async function () {
      const [caller, blockNum, timestamp] = await contract.specialVariables();

      console.log("Caller (msg.sender):", caller);
      console.log("Block number:", blockNum.toString());
      console.log("Timestamp:", timestamp.toString());

      expect(caller).to.equal(owner.address);
    });
  });
});
