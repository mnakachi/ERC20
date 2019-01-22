/*
X tests
1) 'verifies token name after construction'
2) 'verifies the token symbol after construction'
3) 'verifies the decimals after construction'
4) 'verifies totalSupply after contruction'
5) 'verfies the balance of two accounts after a transfer'
6) 'verifies that a transfer fires a Transfer event'
7) 'should throw when attempting to transfer more than the balance'
8) 'should throw then attempting to transfer to an invalid address'
9) 'verifies the allowance after an approval'
10) 'verifies that an approval fires an Approval event'
11) 'verifies against double allowance'
*/

const TestERC20Token = artifacts.require('TestERC20Token.sol');

const invalidAccount = '0x0';

contract('ERC20Token', (accounts) => {
  it('verifies token name after construction', async () => {
    let token = await TestERC20Token.new('Token1', 'TKN1', 0);
    let name = await token.name.call();
    assert.equal(name, 'Token1');
  });

  it('verifies the token symbol after construction', async () => {
    let token = await TestERC20Token.new('Token1', 'TKN1', 0);
    let symbol = await token.symbol.call();
    assert.equal(symbol, 'TKN1');
  });

  it('verifies the decimals after construction', async () => {
    let token = await TestERC20Token.new('Token1', 'TKN1', 0);
    let decimals = await token.decimals.call();
    assert.equal(decimals, 0);
  });

  it('verifies totalSupply after contruction', async () => {
    let token = await TestERC20Token.new('Token1', 'TKN1', 1000);
    let totalSupply = await token.totalSupply.call();
    assert.equal(totalSupply, 1000);
  });

  it('verifies the balance of two accounts after a transfer', async () => {
    let token = await TestERC20Token.new('Token1', 'TKN1', 10000);
    await token.transfer(accounts[1], 500);
    let balance;
    balance = await token.balanceOf.call(accounts[0]);
    assert.equal(balance, 9500);
    balance = await token.balanceOf.call(accounts[1]);
    assert.equal(balance, 500);
  });

  it('verifies that a transfer fires a Transfer event', async () => {
    let token = await TestERC20Token.new('Token1', 'TKN1', 10000);
    let response = await token.transfer(accounts[1], 500);
    assert(response.logs.length > 0 && response.logs[0].event == 'Transfer');
  });

  it('should throw when attempting to transfer more than the balance', async () => {
    let token = await TestERC20Token.new('Token1', 'TKN1', 100);

    try {
      await token.transfer(accounts[1], 500);
      assert(false, "didn't throw");
    }
    catch (error) {
      return error.toString();
    }
  });

  it('should throw then attempting to transfer to an invalid address', async () => {
    let token = await TestERC20Token.new('Token1', 'TKN1', 100);

    try {
      await token.transfer(invalidAccount, 10);
      assert(false, "didn't throw");
    }
    catch (error) {
      return error.toString();
    }
  });

  it('verifies the allowance after an approval', async () => {
    let token = await TestERC20Token.new('Token1', 'TKN1', 1000);
    await token.approve(accounts[1], 500);
    let allowance = await token.allowance.call(accounts[0], accounts[1]);
    assert.equal(allowance, 500);
  });

  it('verifies that an approval fires an Approval event', async () => {
    let token = await TestERC20Token.new('Token1', 'TKN1', 1000);
    let response = await token.approve(accounts[1], 500);
    assert(response.logs.length > 0 && response.logs[0].event == 'Approval');
  });

  it('verifies against double allowance', async () => {
    let token = await TestERC20Token.new('Token1', 'TKN1', 1000);
    await token.approve(accounts[1], 500);

    try {
      await token.approve(accounts[1], 250); // reduce allowance
      assert('false', "not allowed");
    }
    catch (error) {
      return error.toString();
    }
  });

});
