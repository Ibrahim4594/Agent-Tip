const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgentTipToken (ATIP)", function () {
  let token;
  let owner;
  let agent1;
  let agent2;
  let user1;

  // Helper function to convert to tokens (with 18 decimals)
  const tokens = (n) => ethers.parseEther(n.toString());

  beforeEach(async function () {
    // Get signers
    [owner, agent1, agent2, user1] = await ethers.getSigners();

    // Deploy token
    const AgentTipToken = await ethers.getContractFactory("AgentTipToken");
    token = await AgentTipToken.deploy(owner.address);

    console.log("\n🪙 AgentTipToken deployed!");
    console.log("Owner:", owner.address);
  });

  describe("✅ Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await token.name()).to.equal("AgentTip");
      expect(await token.symbol()).to.equal("ATIP");
      console.log("✓ Name: AgentTip");
      console.log("✓ Symbol: ATIP");
    });

    it("Should have 18 decimals", async function () {
      expect(await token.decimals()).to.equal(18);
      console.log("✓ Decimals: 18");
    });

    it("Should mint initial supply to owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      const expectedSupply = tokens(1_000_000); // 1 million tokens

      expect(ownerBalance).to.equal(expectedSupply);
      console.log("✓ Initial supply:", ethers.formatEther(ownerBalance), "ATIP");
    });

    it("Should set the correct max supply", async function () {
      const maxSupply = await token.MAX_SUPPLY();
      expect(maxSupply).to.equal(tokens(1_000_000_000)); // 1 billion
      console.log("✓ Max supply:", ethers.formatEther(maxSupply), "ATIP");
    });

    it("Should get token info", async function () {
      const info = await token.tokenInfo();
      console.log("\n📊 Token Info:");
      console.log("  Name:", info[0]);
      console.log("  Symbol:", info[1]);
      console.log("  Decimals:", info[2].toString());
      console.log("  Current Supply:", ethers.formatEther(info[3]), "ATIP");
      console.log("  Max Supply:", ethers.formatEther(info[4]), "ATIP");
      console.log("  Remaining:", ethers.formatEther(info[5]), "ATIP");
    });
  });

  describe("💰 Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const amount = tokens(100);

      // Owner sends 100 ATIP to agent1
      await token.transfer(agent1.address, amount);

      const agent1Balance = await token.balanceOf(agent1.address);
      expect(agent1Balance).to.equal(amount);
      console.log("✓ Transferred 100 ATIP to agent1");
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      const tooMuch = initialOwnerBalance + tokens(1);

      await expect(
        token.transfer(agent1.address, tooMuch)
      ).to.be.reverted;
      console.log("✓ Transfer correctly fails with insufficient balance");
    });

    it("Should update balances after transfers", async function () {
      const amount = tokens(50);

      // Transfer from owner to agent1
      await token.transfer(agent1.address, amount);

      // Transfer from agent1 to agent2
      await token.connect(agent1).transfer(agent2.address, tokens(25));

      expect(await token.balanceOf(agent1.address)).to.equal(tokens(25));
      expect(await token.balanceOf(agent2.address)).to.equal(tokens(25));
      console.log("✓ Balances updated correctly");
    });
  });

  describe("🏭 Minting", function () {
    it("Should allow owner to mint new tokens", async function () {
      const amount = tokens(1000);
      const initialSupply = await token.totalSupply();

      await token.mint(agent1.address, amount);

      expect(await token.balanceOf(agent1.address)).to.equal(amount);
      expect(await token.totalSupply()).to.equal(initialSupply + amount);
      console.log("✓ Minted 1000 ATIP to agent1");
    });

    it("Should not allow non-owner to mint", async function () {
      await expect(
        token.connect(user1).mint(user1.address, tokens(100))
      ).to.be.reverted;
      console.log("✓ Non-owner cannot mint");
    });

    it("Should not exceed max supply", async function () {
      const maxSupply = await token.MAX_SUPPLY();
      const currentMinted = await token.totalMinted();
      const tooMuch = maxSupply - currentMinted + tokens(1);

      await expect(
        token.mint(agent1.address, tooMuch)
      ).to.be.revertedWith("Exceeds maximum supply");
      console.log("✓ Cannot exceed max supply");
    });

    it("Should track totalMinted correctly", async function () {
      await token.mint(agent1.address, tokens(500));
      await token.mint(agent2.address, tokens(300));

      const totalMinted = await token.totalMinted();
      expect(totalMinted).to.equal(tokens(1_000_000 + 500 + 300));
      console.log("✓ Total minted:", ethers.formatEther(totalMinted), "ATIP");
    });
  });

  describe("🎁 Agent Rewards", function () {
    it("Should reward agent for service", async function () {
      const amount = tokens(50);
      const serviceType = "Code Review";

      await expect(
        token.rewardAgent(agent1.address, amount, serviceType)
      )
        .to.emit(token, "AgentEarned")
        .withArgs(agent1.address, amount, serviceType);

      expect(await token.balanceOf(agent1.address)).to.equal(amount);
      console.log(`✓ Agent rewarded 50 ATIP for "${serviceType}"`);
    });

    it("Should emit correct events when rewarding", async function () {
      const amount = tokens(100);

      await expect(token.rewardAgent(agent1.address, amount, "Bug Fix"))
        .to.emit(token, "AgentEarned")
        .and.to.emit(token, "TokensMinted");
      console.log("✓ Events emitted correctly");
    });
  });

  describe("🔥 Burning", function () {
    beforeEach(async function () {
      // Give agent1 some tokens
      await token.transfer(agent1.address, tokens(1000));
    });

    it("Should allow users to burn their tokens", async function () {
      const burnAmount = tokens(100);
      const initialBalance = await token.balanceOf(agent1.address);

      await token.connect(agent1).burn(burnAmount);

      expect(await token.balanceOf(agent1.address)).to.equal(
        initialBalance - burnAmount
      );
      console.log("✓ Burned 100 ATIP");
    });

    it("Should decrease total supply when burning", async function () {
      const initialSupply = await token.totalSupply();
      const burnAmount = tokens(100);

      await token.connect(agent1).burn(burnAmount);

      expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
      console.log("✓ Total supply decreased");
    });

    it("Should not affect totalMinted when burning", async function () {
      const initialMinted = await token.totalMinted();

      await token.connect(agent1).burn(tokens(100));

      expect(await token.totalMinted()).to.equal(initialMinted);
      console.log("✓ Total minted unchanged (burns don't affect it)");
    });

    it("Should emit TokensBurned event", async function () {
      const burnAmount = tokens(50);

      await expect(token.connect(agent1).burn(burnAmount))
        .to.emit(token, "TokensBurned")
        .withArgs(agent1.address, burnAmount);
      console.log("✓ Burn event emitted");
    });
  });

  describe("📊 View Functions", function () {
    it("Should return remaining supply", async function () {
      const remaining = await token.remainingSupply();
      const maxSupply = await token.MAX_SUPPLY();
      const minted = await token.totalMinted();

      expect(remaining).to.equal(maxSupply - minted);
      console.log("✓ Remaining supply:", ethers.formatEther(remaining), "ATIP");
    });

    it("Should convert to/from wei correctly", async function () {
      const amount = 100;
      const wei = await token.toWei(amount);
      const back = await token.fromWei(wei);

      expect(back).to.equal(amount);
      console.log(`✓ Conversion: ${amount} ATIP = ${wei.toString()} wei`);
    });
  });

  describe("🎯 Real-World Scenario", function () {
    it("Should simulate full agent economy flow", async function () {
      console.log("\n🎬 Simulating Agent Economy:");

      // 1. Agent1 provides code review service
      console.log("\n1️⃣ Agent1 provides code review service");
      await token.rewardAgent(agent1.address, tokens(50), "Code Review");
      console.log("   Agent1 balance:", ethers.formatEther(await token.balanceOf(agent1.address)), "ATIP");

      // 2. Agent2 provides bug fix service
      console.log("\n2️⃣ Agent2 provides bug fix service");
      await token.rewardAgent(agent2.address, tokens(100), "Bug Fix");
      console.log("   Agent2 balance:", ethers.formatEther(await token.balanceOf(agent2.address)), "ATIP");

      // 3. User1 buys tokens from owner
      console.log("\n3️⃣ User1 buys 500 ATIP from owner");
      await token.transfer(user1.address, tokens(500));
      console.log("   User1 balance:", ethers.formatEther(await token.balanceOf(user1.address)), "ATIP");

      // 4. User1 tips Agent1
      console.log("\n4️⃣ User1 tips Agent1 for help");
      await token.connect(user1).transfer(agent1.address, tokens(20));
      console.log("   Agent1 balance:", ethers.formatEther(await token.balanceOf(agent1.address)), "ATIP");

      // 5. Agent1 burns some tokens
      console.log("\n5️⃣ Agent1 burns 10 ATIP");
      await token.connect(agent1).burn(tokens(10));
      console.log("   Agent1 balance:", ethers.formatEther(await token.balanceOf(agent1.address)), "ATIP");

      // Final stats
      console.log("\n📊 Final Statistics:");
      console.log("   Total Supply:", ethers.formatEther(await token.totalSupply()), "ATIP");
      console.log("   Total Minted:", ethers.formatEther(await token.totalMinted()), "ATIP");
      console.log("   Agent1 Balance:", ethers.formatEther(await token.balanceOf(agent1.address)), "ATIP");
      console.log("   Agent2 Balance:", ethers.formatEther(await token.balanceOf(agent2.address)), "ATIP");
      console.log("   User1 Balance:", ethers.formatEther(await token.balanceOf(user1.address)), "ATIP");

      // Verify everything
      expect(await token.balanceOf(agent1.address)).to.equal(tokens(60)); // 50 + 20 - 10
      expect(await token.balanceOf(agent2.address)).to.equal(tokens(100));
      expect(await token.balanceOf(user1.address)).to.equal(tokens(480)); // 500 - 20
    });
  });
});
