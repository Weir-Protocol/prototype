// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./interfaces/IRouter.sol";
import "./interfaces/IWeirInit.sol";

contract WeirController is IWeirInit, Initializable {
    bool outcome;
    address oracle;
    address swapRouter;
    
    WeirParams public weirData;

    function isDeadlineOver() external view returns(bool) {
        return block.timestamp > weirData.deadline;
    }

    function initialize(
        WeirParams calldata _weirData,
        address _oracle,
        address _swapRouter
    ) 
        external 
        initializer     
    {
        weirData = _weirData;
        oracle = _oracle;
        swapRouter = _swapRouter;
    }

    // function releaseLiquidity() private {
    //     IRouter(swapRouter).addLiquidity(daoToken, stablecoin, amountADesired, amountBDesired, amountAMin, amountBMin, to, deadline);
    // }

    // function refundTokens() private {

    // }
}