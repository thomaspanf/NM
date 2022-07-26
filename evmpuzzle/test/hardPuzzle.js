const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshopt in every test.
    async function deployOneYearLockFixture() {

        const HardPuzzle = await hre.ethers.getContractFactory("hardPuzzle");
        const hardPuzzle = await HardPuzzle.deploy();

        await hardPuzzle.deployed();

        console.log("hardPuzzle deployed to", hardPuzzle.address);

    }

    describe("Deployment", function () {
    
        it("Should return false", async function () {
          const { lock, owner } = await loadFixture(deployOneYearLockFixture);
    
          expect(await lock.owner()).to.equal(owner.address);
        });
    
      });

});
