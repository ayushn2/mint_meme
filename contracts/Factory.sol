// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Token} from "./Token.sol";

contract Factory {
    //State variables
    uint256 public fee; 
    address public owner;
    uint256 public totalTokens;
    address[] public tokens;

    mapping(address => TokenSale) public tokenToSale;

    struct TokenSale{
        address token;
        string name;
        address creator;
        uint256 sold;
        uint256 raised;
        bool isOpen;
    }

    event Created(address indexed token);

    constructor(uint256 _fee){
        //local variables
        fee = _fee; 
        owner = msg.sender; 
    }

    function getTokenSale(uint256 _index) public view returns(TokenSale memory){
        return tokenToSale[tokens[_index]];
    }

    function create(
        string memory _name,
        string memory _symbol
    ) 
    external 
    payable {
        // Make sure that the fee is correct
        require(msg.value >= fee, "Not enough Ether sent");//if false, the function stops execution

        // Create a new token 
        Token newToken = new Token(msg.sender, _name, _symbol, 1_000_000 ether);//ether mean 18 zeros after the number 1_000_000

        // Save the token for later use
        tokens.push(address(newToken));
        totalTokens++; 

        // List the token for sale
        TokenSale memory sale = TokenSale(
            address(newToken),
            _name,
            msg.sender,
            0,
            0,
            true
        );

        tokenToSale[address(newToken)] = sale;
 
        // Tell people it's live
        emit Created(address(newToken));
    }   
 }