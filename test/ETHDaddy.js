const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("ETHDaddy", () => {
  let ethDaddy;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async () => {
    const ETHDaddy = await ethers.getContractFactory("ETHDaddy");
    ethDaddy = await ETHDaddy.deploy("ETHDaddy", "ETHD");
    await ethDaddy.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();

    //list domain

    const transaction = await ethDaddy.connect(owner).list("test.eth", tokens(10));
    await transaction.wait();
  });
    it("Should have a name", async () => {
      expect(await ethDaddy.name()).to.equal("ETHDaddy");
    })
    it("Should have a symbol", async () => {
      expect(await ethDaddy.symbol()).to.equal("ETHD");
    })
    it("should have a max supply of 1", async () => {
      expect(await ethDaddy.totalDomains()).to.equal(1);
    })
    describe("Deployment", () => {
      it("Should set the right owner", async () => {
        expect(await ethDaddy.owner()).to.equal(owner.address);
      });
    });
    describe("Listing", () => {
      it("Should list a domain", async () => {
        let domain = await ethDaddy.domains(1);
        expect(domain.name).to.equal("test.eth");
        expect(domain.cost).to.equal(tokens(10));
        expect(domain.isOwned).to.equal(false);
      });
    });
    describe("Minting", () => {
      beforeEach(async () => {
        const transaction = await ethDaddy.connect(owner).mint(1,{value: ethers.utils.parseEther("10")});
        await transaction.wait();
      });
      it("Updates the Owner", async () => {
        expect(await ethDaddy.ownerOf(1)).to.equal(owner.address);
      });
      it("Updates the domains status", async () => {
        let domain = await ethDaddy.domains(1);
        expect(domain.isOwned).to.equal(true);
      });
    });
    describe("Withdrawing", () => {
      beforeEach(async () => {
        const transaction = await ethDaddy.connect(owner).mint(1,{value: ethers.utils.parseEther("10")});
        await transaction.wait();
      });
      it("Updates the Owner", async () => {
        const transaction = await ethDaddy.connect(owner).withdraw(1);
        await transaction.wait();
        expect(await ethers.utils.getBalance(owner.address)).changeEtherBalance(ethers.utils.parseEther("10"));
  });


