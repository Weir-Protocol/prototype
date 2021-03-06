// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./interfaces/IRouter.sol";
import "./interfaces/IWeirInit.sol";

contract WeirController is IWeirInit, Initializable {
    address oracle;
    address router;

    WeirParams public weirData;

    event liquidityReleased(address liquidityPool, uint amountD, uint amountS);
    event withdrewTokens(address dao, uint amount);

    modifier onlyOracle {
        require(msg.sender == oracle, "Not oracle");
        _;
    }

    modifier onlyDAO {
        require(msg.sender == weirData.dao, "Not DAO");
        _;
    }

    constructor() {
        _disableInitializers();
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

    function postVoteResult(bool outcome, uint stablecoinAmount) external onlyOracle {
        require(isDeadlineOver() == true, "Lock period active");
        if (outcome) {
            _releaseLiquidity(stablecoinAmount);
            weirData.releasedLiquidity = true;
            emit liquidityReleased(weirData.liquidityPool, weirData.amount, stablecoinAmount);
        }
    }

    function withdrawTokens() external onlyDAO {
        require(isDeadlineOver() == true, "Lock period active");
        _refundTokens();
        emit withdrewTokens(weirData.dao, weirData.amount);
    }

    function _releaseLiquidity(uint stablecoinAmount) private {
        IERC20(weirData.daotoken).approve(
            router,
            weirData.amount
        );
        IERC20(weirData.stablecoin).approve(
            router,
            stablecoinAmount
        );
        IRouter(router).addLiquidity(
            weirData.daotoken, 
            weirData.stablecoin, 
            weirData.amount, 
            stablecoinAmount, 
            weirData.amount, 
            stablecoinAmount, 
            weirData.dao, 
            block.timestamp+300
        );
    }

    function _refundTokens() private {
        IERC20(weirData.daotoken).transfer(weirData.dao, weirData.amount);
    }
}