const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Lock", function () {
  // Fixture to deploy the contract
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    const [owner, otherAccount] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

    return { lock, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
      expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should set the right owner", async function () {
      const { lock, owner } = await loadFixture(deployOneYearLockFixture);
      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds", async function () {
      const { lock, lockedAmount } = await loadFixture(deployOneYearLockFixture);
      expect(await ethers.provider.getBalance(lock.target)).to.equal(lockedAmount);
    });
  });

  describe("Withdrawals", function () {
    it("Should revert with the right error if called too soon", async function () {
      const { lock } = await loadFixture(deployOneYearLockFixture);
      await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
    });

    it("Should revert if called from another account", async function () {
      const { lock, unlockTime, otherAccount } = await loadFixture(deployOneYearLockFixture);
      await time.increaseTo(unlockTime);
      await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith("You aren't the owner");
    });

    it("Should transfer the funds to the owner", async function () {
      const { lock, unlockTime, lockedAmount, owner } = await loadFixture(deployOneYearLockFixture);
      await time.increaseTo(unlockTime);

      await expect(lock.withdraw()).to.changeEtherBalances(
        [owner, lock],
        [lockedAmount, -lockedAmount]
      );
    });
  });
});
