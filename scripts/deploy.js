// const { ethers } = require("ethers");
// // hardhat had already installed the package that wraps ethers for us.

const { ethers, run, network } = require("hardhat");
require("dotenv").config();

async function main() {
  const contractFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying Contract...");
  const simpleStorage = await contractFactory.deploy();
  await simpleStorage.deployed(); // wait until it gets deployed
  console.log(`Deployed Contract to: ${simpleStorage.address}`);
  console.log(network.config.chainId); // check network info
  if (network.config.chainId == 5) {
    console.log("Waiting for 6 block transactions");
    await simpleStorage.deployTransaction.wait(6); // Etherscan may not get contract info so we need to let it wait for a while
    await verify(simpleStorage.address, []); // There is no constructor so we can pass the empty [], also remember to use await keyword because verify is a async function
  }
  // Interact with the contract
  const currentValue = await simpleStorage.retrieve();
  console.log(`Current value is ${currentValue}`);
  const txResponse = await simpleStorage.store(123);
  await txResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Current value is updated, it's ${updatedValue}`);
}

async function verify(address, constructorArgsParams) {
  console.log("Verifying Contract...");
  // address               Address of the smart contract to verify
  // constructorArgsParams Contract constructor arguments. Ignored if the --constructor-args option is used. (default: [])
  // verify: Verifies contract on Etherscan
  try {
    // There will be an error when contract had been verified before, so we need to deal with the error.
    await run("verify:verify", {
      address: address,
      constructorArgsParams: constructorArgsParams,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
