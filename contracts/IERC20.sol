pragma solidity ^0.4.11;
/*
    ERC20 Standard Token Protocol interface
    Going by strict definition at: https://github.com/ethereum/EIPs/issues/20
*/
contract IERC20 {

    /**
    * Important to note that with the current version of node, you can no longer do:
    * function totalSupply() constant returns (uint256 totalSupply);
    * This seems to have to do specifically with "empty functions" like totalSupply() not balanceOf(address _owner) etc...
    * For some unknown reason, you need the syntax below:
    */
    function name() public constant returns (string name) { name; }
    function symbol() public constant returns (string symbol) { symbol; }
    function decimals() public constant returns (uint8 decimals) { decimals; }

    // ERC-20 defined functions
    function totalSupply() constant returns (uint256 totalSupply) { totalSupply; }
    function balanceOf(address _owner) constant returns (uint256 balance);
    function transfer(address _to, uint256 _value) returns (bool success);
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
    function approve(address _spender, uint256 _value) returns (bool success);
    function allowance(address _owner, address _spender) constant returns (uint256 remaining);

    // ERC-20 defined events
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

}
