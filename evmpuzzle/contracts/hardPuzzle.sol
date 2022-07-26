// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Import this file to use console.log
import "hardhat/console.sol";
contract hardPuzzle{
    function cantReturnFalse(bytes memory val) public returns(bool notFalse){
        assembly {
            notFalse := mload(add(val, 1))
        }
    }
}
