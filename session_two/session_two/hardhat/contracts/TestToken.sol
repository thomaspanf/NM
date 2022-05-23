pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(uint256 amount, address account) external returns (bool) { 
        _mint(account, amount);
        return true;
    }

    function burn(uint256 amount, address account) external returns (bool) { 
        _burn(account, amount);
        return true;
    }
}
