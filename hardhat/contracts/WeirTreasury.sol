// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract WeirTreasury is Ownable {
    uint public carbonCreditAmount;
    uint public collateral;

    mapping(address => uint) carbonCredits;
    mapping(address => uint) collateralAmount;
}
