const VariableManager = artifacts.require("VariableManager");

module.exports = function (deployer) {
  deployer.deploy(VariableManager);
};
