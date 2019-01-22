const SafeMath = artifacts.require("./SafeMath.sol");
const Owned = artifacts.require("./Owned.sol");
const ERC20 = artifacts.require("./ERC20.sol");

module.exports = async (deployer) => {
  deployer.deploy(SafeMath);
  deployer.deploy(Owned);
  deployer.deploy(ERC20, 'DummyToken', 'DUM', 0);
  //deployer.deploy(ERC20);
};
