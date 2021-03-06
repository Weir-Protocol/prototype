// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IWeirInit {
    struct WeirParams {
        bool releasedLiquidity;
        address dao;
        address daotoken;
        address stablecoin;
        address liquidityPool;
        uint amount;
        uint deadline;
        string daoName;
    }
}