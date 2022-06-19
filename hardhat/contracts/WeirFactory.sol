// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./WeirController.sol";
import "./interfaces/IWeirInit.sol";

contract WeirFactory is Ownable {
    address public treasury;
    address public oracle;
    address public router;
    address public immutable baseImplementation;

    event createdNewWeir(address dao, string daoName, address weir);

    constructor(
        address _treasury,
        address _oracle,
        address _router
    ) {
        treasury = _treasury;
        oracle = _oracle;
        router = _router;
        baseImplementation = address(new WeirController());
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    function setOracle(address _oracle) external onlyOwner {
        oracle = _oracle;
    }

    function setSwapRouter(address _router) external onlyOwner {
        router = _router;
    }

    function createWeir(
        IWeirInit.WeirParams calldata initData
    ) 
        external 
    {
        address newWeir = Clones.clone(baseImplementation);
        WeirController(newWeir).initialize(initData, oracle, router);
        IERC20(initData.daotoken).transferFrom(msg.sender, newWeir, initData.amount);
        IERC20(initData.daotoken).transferFrom(msg.sender, treasury, initData.amount / 2);
        emit createdNewWeir(initData.dao, initData.daoName, newWeir);
    }
}