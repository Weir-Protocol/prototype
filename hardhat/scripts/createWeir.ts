// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import  { ethers } from "hardhat";
import {
    ERC20,
    WeirFactory
} from "../typechain";
import {
    DAOtokenAddress,
    StablecoinAddress,
    WeirFactoryAddress
} from "../contractAddress";
import * as ILPFactory from "../artifacts/contracts/interfaces/ILPFactory.sol/ILPFactory.json";

const LPFactoryAddress = "0x62d5b84bE28a183aBB507E125B384122D2C25fAE";

async function main() {
    const [deployer] = await ethers.getSigners();

    const DAOtokenAmount = 10000;
    const DAOname = "SampleDAO";
    const DAO_Address = deployer.address;
    const votingDeadline = Math.ceil((new Date).valueOf()/1000);

    const lpFactory = new ethers.Contract(LPFactoryAddress, ILPFactory.abi, deployer);
    await lpFactory.createPair(DAOtokenAddress, StablecoinAddress);
    await delay(3000);
    const lpAddress = await lpFactory.getPair(DAOtokenAddress, StablecoinAddress);

    const weirParams = {
        dao: DAO_Address,
        daotoken: DAOtokenAddress,
        stablecoin: StablecoinAddress,
        liquidityPool: lpAddress,
        amount: ethers.utils.parseEther(DAOtokenAmount.toString()),
        deadline: votingDeadline,
        daoName: DAOname
    };

    const _DAOtoken = await ethers.getContractFactory("DAOtoken");
    const daotoken: ERC20 = _DAOtoken.attach(DAOtokenAddress) as ERC20;

    const _WeirFactory = await ethers.getContractFactory("WeirFactory");
    const weirFactory: WeirFactory = _WeirFactory.attach(WeirFactoryAddress) as WeirFactory;

    await daotoken.approve(
        weirFactory.address, 
        ethers.utils.parseEther((DAOtokenAmount * 1.5).toString())
    );
    await delay(3000);
    await weirFactory.createWeir(weirParams);
    await delay(3000);
    const daoTokenWeir = await weirFactory.getWeirOfToken(DAOtokenAddress);
    console.log("Created new Weir::", daoTokenWeir);
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});