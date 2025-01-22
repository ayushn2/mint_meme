// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Factory {
    //State variables
    uint256 public fee; 
    address public owner; 

    constructor(uint256 _fee){
        //local variables
        fee = _fee; 
        owner = msg.sender; 
    }
}