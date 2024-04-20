// // We require the Hardhat Runtime Environment explicitly here. This is optional
// // but useful for running the script in a standalone fashion through `node <script>`.
// //
// // You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// // will compile your contracts, add the Hardhat Runtime Environment's members to the
// // global scope, and execute the script.
// const hre = require("hardhat");


// import hre from "hardhat"

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = hre.ethers.parseEther("0.001");

//   const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   await lock.waitForDeployment();

//   console.log(
//     `Lock with ${ethers.formatEther(
//       lockedAmount
//     )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

const { ethers } = require("hardhat");
const { data } = require("../src/constant/constant");

const main = async () => {
  const contractFactory = await ethers.getContractFactory("Election");

  // Candidate details
  const firstNames = data.firstNames
  const lastNames = data.lastNames
  const emails = data.emails
  const genders = data.genders
  const positions = data.positions
  const manifestos = data.manifestos

  const contract = await contractFactory.deploy(
    firstNames,
    lastNames,
    emails,
    genders,
    positions,
    manifestos
  );

  await contract.deployed();
  console.log("Contract address:", contract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();

// 0x5FbDB2315678afecb367f032d93F642f64180aa3