// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WeirTreasury is Ownable {
    mapping(address => uint) carbonCredits;
    mapping(address => uint) collateralAmount;

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
}
