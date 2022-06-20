// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCredit is ERC20, Ownable {
    uint8 public PRICE_IN_tUSD;
    address public tUSD_Address;

    constructor() ERC20("Sample Carbon Credit", "SCC") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function setPriceInTUSD(uint8 price) external onlyOwner {
        PRICE_IN_tUSD = price;
    }

    function setTUSDAddress(address tusdAddress) external onlyOwner {
        tUSD_Address = tusdAddress;
    }

    function withdrawTUSD() external onlyOwner {
        ERC20(tUSD_Address).transfer(
            owner(),
            ERC20(tUSD_Address).balanceOf(msg.sender)
        );
    }

    function purchaseCredits(uint amount) external {
        ERC20(tUSD_Address).transferFrom(
            msg.sender,
            address(this),
            amount * PRICE_IN_tUSD
        );
        transfer(msg.sender, amount);
    }
}