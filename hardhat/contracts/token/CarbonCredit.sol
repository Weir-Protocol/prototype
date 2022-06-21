// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCredit is ERC20, Ownable {
    uint8 public PRICE_IN_tUSD;
    address public tUSD_Address;

    constructor() ERC20("Sample Carbon Credit", "SCC") {
        _mint(msg.sender, 100 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function setPriceInTUSD(uint8 price) external onlyOwner {
        PRICE_IN_tUSD = price;
    }

    function setTUSDAddress(address _tUSD_Address) external onlyOwner {
        tUSD_Address = _tUSD_Address;
    }

    function withdrawTUSD() external onlyOwner {
        ERC20(tUSD_Address).transfer(
            owner(),
            ERC20(tUSD_Address).balanceOf(msg.sender)
        );
    }

    function purchaseWithTUSD(uint TUSDamount) external {
        ERC20(tUSD_Address).transferFrom(
            msg.sender,
            address(this),
            TUSDamount
        );
        _mint(msg.sender, TUSDamount / PRICE_IN_tUSD);
    }
}