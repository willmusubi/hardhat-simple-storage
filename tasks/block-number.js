const { task } = require("hardhat/config");

task("block-number", "Print the current block number").setAction(
  async (taskArgs, hre) => {
    const blockNumbers = await hre.ethers.provider.getBlockNumber();
    console.log(`Current Block number is ${blockNumbers}`);
  }
);

module.exports = {};
