pragma solidity ^0.4.11;
import './IERC20.sol';
import './SafeMath.sol';

contract ERC20 is IERC20, SafeMath {
  string public name = '';
  string public symbol = '';
  uint8 public decimals = 0;
  uint256 public totalSupply = 0;

  mapping (address => uint256) public balanceOf;
  mapping (address => mapping (address => uint256)) public allowance;

  // Modifiers
  modifier validAddress(address _address) {
      require(_address != 0x0);
      _;
  }

  // Constructor
  function ERC20(string _name, string _symbol, uint8 _decimals) {
      require(bytes(_name).length > 0 && bytes(_symbol).length > 0); // validate input

      name = _name;
      symbol = _symbol;
      decimals = _decimals;
  }

  /// @dev Returns number of tokens owned by given address.
  /// @param _owner Address of token owner.
  function balanceOf(address _owner) constant returns (uint256 balance) {
      return balanceOf[_owner];
  }

  /**
      @dev send coins
      throws on any error rather then return a false flag to minimize user errors

      @param _to      target address
      @param _value   transfer amount

      @return true if the transfer was successful, false if it wasn't
  */
  function transfer(address _to, uint256 _value)
      public
      validAddress(_to)
      returns (bool success)
  {
      //All the required validations are in safeSub and safeAdd
      balanceOf[msg.sender] = safeSub(balanceOf[msg.sender], _value);
      balanceOf[_to] = safeAdd(balanceOf[_to], _value);
      Transfer(msg.sender, _to, _value);
      return true;
  }

  /**
      @dev an account/contract attempts to get the coins
      throws on any error rather then return a false flag to minimize user errors

      @param _from    source address
      @param _to      target address
      @param _value   transfer amount

      @return true if the transfer was successful, false if it wasn't
  */
  function transferFrom(address _from, address _to, uint256 _value)
      public
      validAddress(_from)
      validAddress(_to)
      returns (bool success)
  {
      allowance[_from][msg.sender] = safeSub(allowance[_from][msg.sender], _value);
      balanceOf[_from] = safeSub(balanceOf[_from], _value);
      balanceOf[_to] = safeAdd(balanceOf[_to], _value);
      Transfer(_from, _to, _value);
      return true;
  }

  /**
      @dev allow another account/contract to spend some tokens on your behalf
      throws on any error rather then return a false flag to minimize user errors

      also, to minimize the risk of the approve/transferFrom attack vector
      (see https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/), approve has to be called twice
      in 2 separate transactions - once to change the allowance to 0 and secondly to change it to the new allowance value

      @param _spender approved address
      @param _value   allowance amount

      @return true if the approval was successful, false if it wasn't
  */
  function approve(address _spender, uint256 _value)
      public
      validAddress(_spender)
      returns (bool success)
  {
      // if the allowance isn't 0, it can only be updated to 0 to prevent an allowance change immediately after withdrawal
      require(_value == 0 || allowance[msg.sender][_spender] == 0);

      allowance[msg.sender][_spender] = _value;
      Approval(msg.sender, _spender, _value);
      return true;
  }

  /*
   * Read storage functions
   */
  /// @dev Returns number of allowed tokens for given address.
  /// @param _owner Address of token owner.
  /// @param _spender Address of token spender.
  function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
    return allowance[_owner][_spender];
  }
}
