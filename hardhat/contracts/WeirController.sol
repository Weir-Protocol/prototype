// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./interfaces/IRouter.sol";
import "./interfaces/IWeirInit.sol";

contract WeirController is IWeirInit, Initializable {
    address oracle;
    address router;

    bool public releasedLiquidity;
    WeirParams public weirData;

    event liquidityReleased(address liquidityPool, uint amountD, uint amountS);
    event refundedTokens(address dao, uint amount);

    modifier onlyOracle {
        require(msg.sender == oracle, "Not oracle");
        _;
    }

    modifier onlyDAO {
        require(msg.sender == weirData.dao, "Not DAO");
        _;
    }

    function isDeadlineOver() public view returns(bool) {
        return block.timestamp > weirData.deadline;
    }

    function initialize(
        WeirParams calldata _weirData,
        address _oracle,
        address _router
    ) 
        external 
        initializer     
    {
        weirData = _weirData;
        oracle = _oracle;
        router = _router;
    }

    function postResult(bool outcome, uint stablecoinAmount) external onlyOracle {
        require(isDeadlineOver() == true, "Active period");
        if (outcome) {
            _releaseLiquidity(stablecoinAmount);
            releasedLiquidity = true;
            emit liquidityReleased(weirData.liquidityPool, weirData.amount, stablecoinAmount);
        } else {
            _refundTokens();
            emit refundedTokens(weirData.dao, weirData.amount);
        }
    }

    function withdrawTokens() external onlyDAO {
        require(isDeadlineOver() == true, "Active period");
        _refundTokens();
    }

    function _releaseLiquidity(uint stablecoinAmount) private {
        IRouter(router).addLiquidity(
            weirData.daotoken, 
            weirData.stablecoin, 
            weirData.amount, 
            stablecoinAmount, 
            weirData.amount, 
            stablecoinAmount, 
            weirData.dao, 
            block.timestamp+200
        );
    }

    function _refundTokens() private {
        IERC20(weirData.daotoken).transfer(weirData.dao, weirData.amount);
    }
}