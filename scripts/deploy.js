// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {

  const [deployer] = await ethers.getSigners();
  const ETHDaddy = await ethers.getContractFactory("ETHDaddy");
  const ethDaddy = await ETHDaddy.deploy("ETHDaddy", "ETHD");
  await ethDaddy.deployed();

  console.log("ETHDaddy deployed to:", ethDaddy.address);  
  // List 6 domains
  const names = ["jack.eth", "maria.eth", "henry.eth","santa.eth"]
  const costs = [tokens(.01), tokens(.01), tokens(.025),tokens(.5)]

  for (var i = 0; i < 6; i++) {
    const transaction = await ethDaddy.connect(deployer).list(names[i], costs[i])
    await transaction.wait()

    console.log(`Listed Domain ${i + 1}: ${names[i]}`)


}
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
