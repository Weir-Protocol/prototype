// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import  { ethers } from "hardhat";
import {
    DAOtoken,
    Stablecoin
} from "../typechain";
import {
    DAOtokenAddress,
    StablecoinAddress
} from "../contractAddress";

const address = "0x815d3C5253E6D0b5e0D8a0267e1D120ad966EB19";
const amount = "100";

const token: number = 1;    

async function main() {
    const _DAOtoken = await ethers.getContractFactory("DAOtoken");
    const daotoken: DAOtoken = _DAOtoken.attach(DAOtokenAddress) as DAOtoken;

    const _Stablecoin = await ethers.getContractFactory("Stablecoin");
    const stablecoin: Stablecoin = _Stablecoin.attach(StablecoinAddress) as Stablecoin;

    switch (token) {
        case 1: {
            console.log("Minting DAO tokens...");
            await daotoken.mint(address, ethers.utils.parseEther(amount));
            break;
        }
        case 2: {
            console.log("Minting Stablecoins...");
            await stablecoin.mint(address, ethers.utils.parseEther(amount));
            break;
        }
        default: {
            console.log("Invalid token");
        }
    }
    console.log(
        "New DAOtoken balance:", 
        ethers.utils.formatEther(await daotoken.balanceOf(address))
    );
    console.log(
        "New Stablecoin balance:",
        ethers.utils.formatEther(await stablecoin.balanceOf(address))
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});