const VariableManager = artifacts.require("VariableManager");

contract("VariableManager", (accounts) => {
  let variableManager;
  const owner = accounts[0];
  console.log(accounts);

  before(async () => {
    variableManager = await VariableManager.deployed();
  });

  describe("Testing", () => {
    it("testing variables state.", async () => {
      const mainFundingPoolFee = await variableManager.mainFundingPoolFee();
      assert.equal(mainFundingPoolFee, 160);
      const communityRewardPoolFee = await variableManager.communityRewardPoolFee();
      assert.equal(communityRewardPoolFee, 40);

      await variableManager.setMainFundingPoolFee(100);
      const communityRewardPoolFee1 = await variableManager.communityRewardPoolFee();
      assert.equal(communityRewardPoolFee1, 100);
    });
  });
});
