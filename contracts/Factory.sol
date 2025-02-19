// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Token} from "./Token.sol";

contract Factory {
    uint256 public constant TARGET = 3 ether;
    uint256 public constant TOKEN_LIMIT = 500_000 ether;


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

    event Buy(address indexed token, uint256 amount);

    constructor(uint256 _fee){
        //local variables
        fee = _fee; 
        owner = msg.sender; 
    }

    function getTokenSale(uint256 _index) public view returns(TokenSale memory){
        return tokenToSale[tokens[_index]];
    }

    function getCost(uint256 _sold) public pure returns(uint256){
        uint256 floor = 0.0001 ether;
        uint256 step = 0.0001 ether;
        uint256 increment = 10000 ether;

        uint256 cost = (step * (_sold / increment)) + floor;
        return cost;
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

    function buy(address _token, uint256 _amount) external payable{
        TokenSale storage sale = tokenToSale[_token];

        // Check conditions
        require(sale.isOpen == true, "Factory: Buying closed");
        require(_amount >= 1 ether,"Factory: Amount is too low");
        require(_amount <= 10000 ether, "Factory: Amount exceeded");

        // calculate the price of 1 token based upon total bought
        uint256 cost = getCost(sale.sold);
        uint256 price = cost * (_amount / 10 ** 18);

        // make sure enough eth is sent
        require(msg.value >= price, "Not enough Ether sent");

        // Update the sale
        sale.sold += _amount;
        sale.raised += price;

        // Make sure fund raising goal isn't met
        if(sale.sold >= TOKEN_LIMIT || sale.raised >= TARGET){
            sale.isOpen = false;
        }

        // Transfer tokens to buyers wallet
        Token(_token).transfer(msg.sender, _amount);

        // Emit an event
        emit Buy(_token, _amount);
    }

    function deposit(address _token) external{
        // The remaining token balance and the ETH raised would go into a liquidity pool like uniswap V3
        // For simplicity we'll just transfer remaining tokens and ETH raised to the creator

        Token token = Token(_token);
        TokenSale memory sale = tokenToSale[_token];

        require(sale.isOpen == false, "Factory: Sale is still open");

        // transfer remaining tokens to creator
        token.transfer(sale.creator, token.balanceOf(address(this)));

        // transfer eth raised
        (bool success,) = payable(sale.creator).call{value: sale.raised}("");//We can simply use transfer function but for safety purposes we are using call
        require(success,"Factory: failed to send eth");
    }

    function withdraw(uint256 _amount) external{
        require(msg.sender == owner, "Factory: only owner can call withdraw function");

        (bool success,) = payable(owner).call{value: _amount}("");
        require(success, "Factory: ETH transfer failed");
    }
 }