// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Token} from "./Token.sol";

contract Factory {
    //State variables
    uint256 public fee; 
    address public owner;

    uint256 public totalTokens = 0;

    address[] public tokens;

    constructor(uint256 _fee){
        //local variables
        fee = _fee; 
        owner = msg.sender; 
    }

    function create(
        string memory _name,
        string memory _symbol
    ) 
    external 
    payable {
        // Create a new token 
        Token newToken = new Token(msg.sender, _name, _symbol, 1_000_000 ether);//ether mean 18 zeros after the number 1_000_000

        // Save the token for later use
        tokens.push(address(newToken));

        totalTokens++; 

        // List the token for sale
        // Tell people it's live
    }   
}