const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgentMarketplace", function () {
  let token;
  let marketplace;
  let owner;
  let agent1;
  let agent2;
  let buyer1;
  let buyer2;

  const tokens = (n) => ethers.parseEther(n.toString());

  beforeEach(async function () {
    [owner, agent1, agent2, buyer1, buyer2] = await ethers.getSigners();

    // Deploy ATIP token
    const AgentTipToken = await ethers.getContractFactory("AgentTipToken");
    token = await AgentTipToken.deploy(owner.address);

    // Deploy marketplace
    const AgentMarketplace = await ethers.getContractFactory("AgentMarketplace");
    marketplace = await AgentMarketplace.deploy(await token.getAddress(), owner.address);

    // Give buyers some tokens
    await token.transfer(buyer1.address, tokens(10000));
    await token.transfer(buyer2.address, tokens(10000));

    // Buyers approve marketplace to spend tokens
    await token.connect(buyer1).approve(await marketplace.getAddress(), tokens(10000));
    await token.connect(buyer2).approve(await marketplace.getAddress(), tokens(10000));

    console.log("\n🏪 Marketplace deployed!");
    console.log("Token:", await token.getAddress());
    console.log("Marketplace:", await marketplace.getAddress());
  });

  describe("✅ Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await marketplace.atipToken()).to.equal(await token.getAddress());
      console.log("✓ Token address set correctly");
    });

    it("Should set initial platform fee to 2%", async function () {
      expect(await marketplace.platformFeePercent()).to.equal(200);
      console.log("✓ Platform fee: 2%");
    });

    it("Should set treasury to owner", async function () {
      expect(await marketplace.treasury()).to.equal(owner.address);
      console.log("✓ Treasury set to owner");
    });
  });

  describe("📝 Service Creation", function () {
    it("Should create a new service", async function () {
      await marketplace.connect(agent1).createService(
        "Code Review",
        "I will review your smart contract code",
        tokens(50)
      );

      const service = await marketplace.getService(0);
      expect(service.agent).to.equal(agent1.address);
      expect(service.name).to.equal("Code Review");
      expect(service.price).to.equal(tokens(50));
      expect(service.status).to.equal(0); // Active

      console.log("✓ Service created:");
      console.log("  Name:", service.name);
      console.log("  Price:", ethers.formatEther(service.price), "ATIP");
      console.log("  Agent:", service.agent);
    });

    it("Should emit ServiceCreated event", async function () {
      await expect(
        marketplace.connect(agent1).createService(
          "Bug Fix",
          "I will fix your bugs",
          tokens(100)
        )
      )
        .to.emit(marketplace, "ServiceCreated")
        .withArgs(0, agent1.address, "Bug Fix", tokens(100));

      console.log("✓ ServiceCreated event emitted");
    });

    it("Should track agent's services", async function () {
      await marketplace.connect(agent1).createService("Service 1", "Desc 1", tokens(10));
      await marketplace.connect(agent1).createService("Service 2", "Desc 2", tokens(20));

      const agentServices = await marketplace.getAgentServices(agent1.address);
      expect(agentServices.length).to.equal(2);
      console.log("✓ Agent has", agentServices.length, "services");
    });

    it("Should fail with empty name", async function () {
      await expect(
        marketplace.connect(agent1).createService("", "Description", tokens(50))
      ).to.be.revertedWith("Name cannot be empty");
      console.log("✓ Cannot create service with empty name");
    });

    it("Should fail with zero price", async function () {
      await expect(
        marketplace.connect(agent1).createService("Service", "Description", 0)
      ).to.be.revertedWith("Price must be greater than 0");
      console.log("✓ Cannot create service with zero price");
    });
  });

  describe("💰 Service Purchase", function () {
    beforeEach(async function () {
      // Agent creates a service
      await marketplace.connect(agent1).createService(
        "Code Review",
        "Expert code review service",
        tokens(100)
      );
    });

    it("Should purchase a service with ATIP tokens", async function () {
      const initialAgentBalance = await token.balanceOf(agent1.address);
      const initialBuyerBalance = await token.balanceOf(buyer1.address);

      await marketplace.connect(buyer1).purchaseService(0);

      // Check balances (agent gets 98 ATIP, 2% fee to treasury)
      const agentBalance = await token.balanceOf(agent1.address);
      const buyerBalance = await token.balanceOf(buyer1.address);
      const treasuryBalance = await token.balanceOf(owner.address);

      expect(agentBalance - initialAgentBalance).to.equal(tokens(98)); // 100 - 2% fee
      expect(initialBuyerBalance - buyerBalance).to.equal(tokens(100));

      console.log("✓ Service purchased:");
      console.log("  Agent received:", ethers.formatEther(agentBalance - initialAgentBalance), "ATIP");
      console.log("  Buyer paid:", ethers.formatEther(initialBuyerBalance - buyerBalance), "ATIP");
      console.log("  Fee collected: 2 ATIP");
    });

    it("Should update service status to Purchased", async function () {
      await marketplace.connect(buyer1).purchaseService(0);

      const service = await marketplace.getService(0);
      expect(service.status).to.equal(1); // Purchased
      expect(service.buyer).to.equal(buyer1.address);

      console.log("✓ Service status updated to Purchased");
    });

    it("Should emit ServicePurchased event", async function () {
      await expect(marketplace.connect(buyer1).purchaseService(0))
        .to.emit(marketplace, "ServicePurchased")
        .withArgs(0, buyer1.address, agent1.address, tokens(100), tokens(2));

      console.log("✓ ServicePurchased event emitted");
    });

    it("Should track buyer's purchases", async function () {
      await marketplace.connect(buyer1).purchaseService(0);

      const purchases = await marketplace.getBuyerPurchases(buyer1.address);
      expect(purchases.length).to.equal(1);
      expect(purchases[0]).to.equal(0);

      console.log("✓ Buyer's purchases tracked");
    });

    it("Should fail if service already purchased", async function () {
      await marketplace.connect(buyer1).purchaseService(0);

      await expect(
        marketplace.connect(buyer2).purchaseService(0)
      ).to.be.revertedWith("Service not available");

      console.log("✓ Cannot purchase already-purchased service");
    });

    it("Should fail if agent tries to buy own service", async function () {
      await expect(
        marketplace.connect(agent1).purchaseService(0)
      ).to.be.revertedWith("Cannot buy your own service");

      console.log("✓ Agent cannot buy their own service");
    });

    it("Should collect platform fees", async function () {
      await marketplace.connect(buyer1).purchaseService(0);

      const feesCollected = await marketplace.totalFeesCollected();
      expect(feesCollected).to.equal(tokens(2)); // 2% of 100

      console.log("✓ Platform fees collected:", ethers.formatEther(feesCollected), "ATIP");
    });
  });

  describe("✅ Service Completion", function () {
    beforeEach(async function () {
      await marketplace.connect(agent1).createService("Service", "Description", tokens(100));
      await marketplace.connect(buyer1).purchaseService(0);
    });

    it("Should allow agent to complete service", async function () {
      await marketplace.connect(agent1).completeService(0);

      const service = await marketplace.getService(0);
      expect(service.status).to.equal(2); // Completed

      console.log("✓ Service marked as completed");
    });

    it("Should emit ServiceCompleted event", async function () {
      await expect(marketplace.connect(agent1).completeService(0))
        .to.emit(marketplace, "ServiceCompleted")
        .withArgs(0, agent1.address, buyer1.address);

      console.log("✓ ServiceCompleted event emitted");
    });

    it("Should fail if non-agent tries to complete", async function () {
      await expect(
        marketplace.connect(buyer1).completeService(0)
      ).to.be.revertedWith("Only agent can complete");

      console.log("✓ Only agent can complete service");
    });

    it("Should fail if service not purchased yet", async function () {
      await marketplace.connect(agent2).createService("Service 2", "Desc", tokens(50));

      await expect(
        marketplace.connect(agent2).completeService(1)
      ).to.be.revertedWith("Service not purchased");

      console.log("✓ Cannot complete unpurchased service");
    });
  });

  describe("❌ Service Cancellation", function () {
    beforeEach(async function () {
      await marketplace.connect(agent1).createService("Service", "Description", tokens(100));
    });

    it("Should allow agent to cancel active service", async function () {
      await marketplace.connect(agent1).cancelService(0);

      const service = await marketplace.getService(0);
      expect(service.status).to.equal(3); // Cancelled

      console.log("✓ Service cancelled by agent");
    });

    it("Should emit ServiceCancelled event", async function () {
      await expect(marketplace.connect(agent1).cancelService(0))
        .to.emit(marketplace, "ServiceCancelled")
        .withArgs(0, agent1.address);

      console.log("✓ ServiceCancelled event emitted");
    });

    it("Should fail if non-agent tries to cancel", async function () {
      await expect(
        marketplace.connect(buyer1).cancelService(0)
      ).to.be.revertedWith("Only agent can cancel");

      console.log("✓ Only agent can cancel their service");
    });

    it("Should fail if service already purchased", async function () {
      await marketplace.connect(buyer1).purchaseService(0);

      await expect(
        marketplace.connect(agent1).cancelService(0)
      ).to.be.revertedWith("Can only cancel active services");

      console.log("✓ Cannot cancel purchased service");
    });
  });

  describe("📊 View Functions", function () {
    beforeEach(async function () {
      await marketplace.connect(agent1).createService("Service 1", "Desc 1", tokens(50));
      await marketplace.connect(agent1).createService("Service 2", "Desc 2", tokens(100));
      await marketplace.connect(agent2).createService("Service 3", "Desc 3", tokens(75));
    });

    it("Should get all active services", async function () {
      const activeServices = await marketplace.getActiveServices();
      expect(activeServices.length).to.equal(3);

      console.log("✓ Active services:", activeServices.length);
    });

    it("Should get marketplace statistics", async function () {
      await marketplace.connect(buyer1).purchaseService(0);
      await marketplace.connect(agent1).completeService(0);

      const [totalServices, totalPurchases, totalCompleted, feesCollected] =
        await marketplace.getMarketplaceStats();

      console.log("\n📊 Marketplace Stats:");
      console.log("  Total Services:", totalServices.toString());
      console.log("  Total Purchases:", totalPurchases.toString());
      console.log("  Total Completed:", totalCompleted.toString());
      console.log("  Fees Collected:", ethers.formatEther(feesCollected), "ATIP");

      expect(totalServices).to.equal(3);
      expect(totalPurchases).to.equal(1);
      expect(totalCompleted).to.equal(1);
    });
  });

  describe("⚙️ Admin Functions", function () {
    it("Should allow owner to update platform fee", async function () {
      await marketplace.setPlatformFee(300); // 3%

      expect(await marketplace.platformFeePercent()).to.equal(300);
      console.log("✓ Platform fee updated to 3%");
    });

    it("Should fail if non-owner tries to update fee", async function () {
      await expect(
        marketplace.connect(agent1).setPlatformFee(300)
      ).to.be.reverted;

      console.log("✓ Non-owner cannot update fee");
    });

    it("Should allow owner to update treasury", async function () {
      await marketplace.setTreasury(buyer1.address);

      expect(await marketplace.treasury()).to.equal(buyer1.address);
      console.log("✓ Treasury updated");
    });

    it("Should fail with fee above 10%", async function () {
      await expect(
        marketplace.setPlatformFee(1001)
      ).to.be.revertedWith("Fee too high (max 10%)");

      console.log("✓ Cannot set fee above 10%");
    });
  });

  describe("🎬 Real-World Scenario", function () {
    it("Should simulate complete marketplace flow", async function () {
      console.log("\n🎬 Simulating Marketplace Flow:");

      // 1. Agents list services
      console.log("\n1️⃣ Agents list services");
      await marketplace.connect(agent1).createService("Code Review", "Expert review", tokens(50));
      await marketplace.connect(agent1).createService("Bug Fix", "Quick fixes", tokens(100));
      await marketplace.connect(agent2).createService("Consultation", "30 min call", tokens(75));
      console.log("  ✓ 3 services listed");

      // 2. View active services
      let activeServices = await marketplace.getActiveServices();
      console.log("\n2️⃣ Active services:", activeServices.length);

      // 3. Buyer1 purchases service
      console.log("\n3️⃣ Buyer1 purchases Code Review");
      await marketplace.connect(buyer1).purchaseService(0);
      console.log("  ✓ Payment: 50 ATIP (49 to agent, 1 fee)");

      // 4. Buyer2 purchases different service
      console.log("\n4️⃣ Buyer2 purchases Bug Fix");
      await marketplace.connect(buyer2).purchaseService(1);
      console.log("  ✓ Payment: 100 ATIP (98 to agent, 2 fee)");

      // 5. Agent completes services
      console.log("\n5️⃣ Agent1 completes Code Review");
      await marketplace.connect(agent1).completeService(0);
      console.log("  ✓ Service marked completed");

      // 6. Final statistics
      const [totalServices, totalPurchases, totalCompleted, feesCollected] =
        await marketplace.getMarketplaceStats();

      console.log("\n📊 Final Statistics:");
      console.log("  Services Listed:", totalServices.toString());
      console.log("  Services Purchased:", totalPurchases.toString());
      console.log("  Services Completed:", totalCompleted.toString());
      console.log("  Platform Fees:", ethers.formatEther(feesCollected), "ATIP");

      // Verify
      expect(totalServices).to.equal(3);
      expect(totalPurchases).to.equal(2);
      expect(totalCompleted).to.equal(1);
      expect(feesCollected).to.equal(tokens(3)); // 1 + 2
    });
  });
});
