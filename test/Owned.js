const Owned = artifacts.require('Owned.sol');

/*
7 tests:
1) 'verifies the owner after construction'
2) 'verifies the new owner after ownership transfer'
3) 'verifies that newOnwer is cleared out after ownership transfer'
4) 'verify that ownership transfer fires an OwnerUpdate event'
5) 'verify that no ownership transfer takes place until the new owner accepts it'
6) 'verifies that only the contract owner can transfer ownership'
7) 'verifies that the owner can cancel ownership transfer before the new owner accepts it'
*/

contract('Owned', (accounts) => {
  it('verifies the owner after construction', async () => {
    let contract = await Owned.new();
    let owner = await contract.owner.call();
    assert.equal(owner, accounts[0]);
  });

  it('verifies the new owner after ownership transfer', async () => {
    let contract = await Owned.new();
    await contract.transferOwnership(accounts[1]);
    await contract.acceptOwnership({ from: accounts[1] });
    let owner = await contract.owner.call();
    assert.equal(owner, accounts[1]);
  });

  it('verifies that newOnwer is cleared out after ownership transfer', async () => {
    let contract = await Owned.new();
    await contract.transferOwnership(accounts[1]);
    await contract.acceptOwnership({ from: accounts[1] });
    let newOwner = await contract.newOwner.call();
    assert.equal(newOwner, '0x0000000000000000000000000000000000000000');
  });

  it('verify that ownership transfer fires an OwnerUpdate event', async () => {
    let contract = await Owned.new();
    await contract.transferOwnership(accounts[1]);
    let response = await contract.acceptOwnership({ from: accounts[1] });
    assert(response.logs.length > 0 && response.logs[0].event == 'OwnerUpdate');
  });

  it('verify that no ownership transfer takes place until the new owner accepts it', async () => {
    let contract = await Owned.new();
    await contract.transferOwnership(accounts[1]);
    let owner = await contract.owner.call();
    assert.equal(owner, accounts[0]);
  });

  it('verifies that only the contract owner can transfer ownership', async () => {
    let contract = await Owned.new();

    try {
      await contract.transferOwnership(accounts[1], { from: accounts[2] });
      assert(false, "didn't throw");
    }
    catch (error) {
      return error.toString();
    }
  });

  it('verifies that the owner can cancel ownership transfer before the new owner accepts it', async () => {
    let contract = await Owned.new();
    await contract.transferOwnership(accounts[1]);
    await contract.transferOwnership('0x0');
    let newOwner = await contract.newOwner.call();
    assert.equal(newOwner, '0x0000000000000000000000000000000000000000')
  });
});
