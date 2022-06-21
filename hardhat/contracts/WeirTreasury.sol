// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./token/CarbonCredit.sol";

contract WeirTreasury is Ownable {
    address public tUSD_Address;
    address public CarbonCreditAddress;
    mapping(address => uint) carbonCredits;
    mapping(address => uint) collateralAmount;

    event purchasedCarbonCredits(uint TUSDamount);

    function viewCarbonTonsOffset() external view returns(uint) {
        return ERC20(CarbonCreditAddress).balanceOf(address(this));
    }

    function setTUSDAddress(address _tUSD_Address) external onlyOwner {
        tUSD_Address = _tUSD_Address;
    }

    function setCarbonCreditAddress(address _CarbonCreditAddress) external onlyOwner {
        CarbonCreditAddress = _CarbonCreditAddress;
    }

    function approveTokenSpender(
        address token, 
        address spender, 
        uint amount
    ) 
        external
        onlyOwner
    {
        ERC20(token).approve(
            spender,
            amount
        );
    }

    function withdrawTokens(address token) external onlyOwner {
        ERC20(token).transfer(
            owner(),
            ERC20(token).balanceOf(address(this))
        );
    }

    function purchaseCarbonCredits(uint TUSDamount) external onlyOwner {
        require(
            TUSDamount <= ERC20(tUSD_Address).balanceOf(address(this)),
            "Insufficient TUSD Balance"
        );
        ERC20(tUSD_Address).approve(CarbonCreditAddress, TUSDamount);
        CarbonCredit(CarbonCreditAddress).purchaseWithTUSD(TUSDamount);
        emit purchasedCarbonCredits(TUSDamount);
    }
}
