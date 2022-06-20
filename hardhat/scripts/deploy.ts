// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

const router = "0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121";
const oracle = "0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121";
const DAO_Address = "0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address::", deployer.address);

  const DAOtoken = await ethers.getContractFactory("DAOtoken");
  const daotoken = await DAOtoken.deploy();
  await daotoken.deployed();
  console.log("Deployed Test DAOtoken::", daotoken.address);

  const Stablecoin = await ethers.getContractFactory("Stablecoin");
  const stablecoin = await Stablecoin.deploy();
  await stablecoin.deployed();
  console.log("Deployed Test Stablecoin::", stablecoin.address);

  const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
  const carbonCredit = await CarbonCredit.deploy();
  await carbonCredit.deployed();
  console.log("Deployed Test CarbonCredit::", carbonCredit.address);

  await carbonCredit.setPriceInTUSD(14);
  await carbonCredit.setTUSDAddress(stablecoin.address);

  const WeirTreasury = await ethers.getContractFactory("WeirTreasury");
  const weirTreasury = await WeirTreasury.deploy();
  await weirTreasury.deployed();
  console.log("Deployed WeirTreasury::", weirTreasury.address);

  await daotoken.transfer(DAO_Address, ethers.utils.parseEther("1000000"));
  await stablecoin.transfer(weirTreasury.address, ethers.utils.parseEther("1000000"));
  await weirTreasury.approveTokenSpender(
    stablecoin.address,
    oracle,
    ethers.constants.MaxUint256
  );

  const WeirFactory = await ethers.getContractFactory("WeirFactory");
  const weirFactory = await WeirFactory.deploy(weirTreasury.address, oracle, router);
  await weirFactory.deployed();
  console.log("Deployed WeirFactory::", weirFactory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
