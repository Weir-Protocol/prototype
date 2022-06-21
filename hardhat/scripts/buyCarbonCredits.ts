// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import  { ethers } from "hardhat";
import {
    ERC20,
    WeirTreasury
} from "../typechain";
import {
    WeirTreasuryAddress,
    CarbonCreditAddress
} from "../contractAddress";

async function main() {
    const TUSDamount = 100;

    const _CarbonCredit = await ethers.getContractFactory("CarbonCredit");
    const carbonCredit: ERC20 = _CarbonCredit.attach(CarbonCreditAddress) as ERC20;

    const _WeirTreasury = await ethers.getContractFactory("WeirTreasury");
    const weirTreasury: WeirTreasury = _WeirTreasury.attach(WeirTreasuryAddress) as WeirTreasury;

    const initialCCBalance = await carbonCredit.balanceOf(WeirTreasuryAddress);
    await weirTreasury.purchaseCarbonCredits(ethers.utils.parseEther(TUSDamount.toString()));
    const finalCCBalance = await carbonCredit.balanceOf(WeirTreasuryAddress);

    const offset = await weirTreasury.viewCarbonTonsOffset();

    const tokensPurchased = 
        parseFloat(ethers.utils.formatEther(finalCCBalance)) - 
        parseFloat(ethers.utils.formatEther(initialCCBalance));
    console.log("TUSD amount spent::", TUSDamount);
    console.log("CarbonCredits Purchased::", tokensPurchased);
    console.log("Total Carbon offset in tonnes::", ethers.utils.formatEther(offset));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});