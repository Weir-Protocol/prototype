// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./WeirController.sol";
import "./interfaces/IWeirInit.sol";

contract WeirFactory is Ownable {
    address public treasury;
    address public oracle;
    address public swapRouter;
    address public immutable baseImplementation;

    constructor() {
        baseImplementation = address(new WeirController());
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    function setOracle(address _oracle) external onlyOwner {
        oracle = _oracle;
    }

    function setSwapRouter(address _swapRouter) external onlyOwner {
        swapRouter = _swapRouter;
    }

    function createWeir(
        IWeirInit.WeirParams calldata initData
    ) 
        external 
    {
        address newWeir = Clones.clone(baseImplementation);
        WeirController(newWeir).initialize(initData, oracle, swapRouter);
    }
}