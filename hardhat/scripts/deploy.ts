// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const oracle = "";
  const router = "";
  const [deployer, treasury] = await ethers.getSigners();
  console.log("Deployer address::", deployer.address);

  const WeirFactory = await ethers.getContractFactory("WeirFactory");
  const weirFactory = await WeirFactory.deploy(treasury.address, oracle, router);
  await weirFactory.deployed();
  console.log("Deployed WeirFactory::", weirFactory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
