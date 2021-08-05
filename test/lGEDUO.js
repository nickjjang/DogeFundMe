const LGEContract = artifacts.require('LGEContract');
const Web3 = require('web3');
const Web3Utils = require('web3-utils');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));

contract ('LGEContract', (accounts) => {
    let lgeContract;

    before(async () => {
        lgeContract = await LGEContract.deployed();
    });

    /** Truffle accounts
     * "0xe775209d747904D406b70CEfB97E10Ef393F88a0"
     * "0xe775209d747904D406b70CEfB97E10Ef393F88a0"
     * "0x9BBbAcBDE8fBAC3F5784F30C1110002Ee198BdfE"
     * "0x13e1A9A2A62B883bd3aAb71e6D240Ba10A70eC8A"
     * "0xb2EAFc933ce0420FCafaF278d485Ac4536D84e6a"
     * **/
    
    describe('Deployment', async () =>{
        it('LGE DUO is deployed Sucessfully', async () => {
            const address = await lgeContract.address;
            console.log(address);
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
            assert.notEqual(address, '');
        });
        it('Has Owner', async () => {
            const owner = await lgeContract._owner;
            assert.notEqual(owner, 0x0);
            assert.notEqual(owner, null);
            assert.notEqual(owner, undefined);
            assert.notEqual(owner, '');
        });
        it('Has Confirmations', async () => {
            const confirmations = await lgeContract._min_confirmation;
            assert.notEqual(confirmations, 0)
            assert.notEqual(confirmations, 1)
            assert.notEqual(confirmations, 3)
        });
    });

     describe('Get Contract Balance TestCases!', async () => {
         let balance;
         it('Checking with different accounts', function() {
             return LGEContract.deployed().then(function (instance) {
                 lgeContract = instance;
                 return lgeContract.getContractBalance.call({from: accounts[6]});
             }).then(assert.fail).catch(function(error){
                 assert(error.message.indexOf('revert') >= 0, 'error for revert on account address of 5th index!')
                 return lgeContract.getContractBalance.call({from: accounts[0]});
             }).then(function (success){
                 assert.equal(success, 0, 'When called from one of Harvesters/founder balance is correct');
             });
         })
     });

     describe('Add Liquidity', async() => {
         it('Trying it with different values to ether and different senders', function() {
             return LGEContract.deployed().then(function(instance) {
                 lgeContract = instance;
                 //1 eth = 1000000000000000000
                 return lgeContract.addLiquidity({from: accounts[7], value: 0});
             }).then(assert.fail).catch(function(error) {
                 assert(error.message.indexOf('revert' >= 0, 'error is because the amount is not correct'));
                 return lgeContract.addLiquidity({from: accounts[7], value: 1000000000000000000});
             }).then(function() {
                // assert.equal(lgeContract.liquidityProviders(accounts[7]),1000000000000000000);
                return lgeContract.liquidityProviders(accounts[7]);
             }).then(function(value) {
                 assert.equal(value, 1000000000000000000, 'Value is correct');
             });
         });
     });
     
     describe('Change Contract State', async() => {
        it('Changing state from active to inactive and vise-versa, trying adding liquidity', function(){
           return lgeContract.updateContractState(2)
            .then(assert.fail).catch(function(error) {
                assert(error.message.indexOf('revert' >= 0), 'Invalid type');
                return lgeContract.updateContractState(1);
            }).then(function() {
                // return lgeContract.liquidityProviders(accounts[7]);
                return lgeContract.addLiquidity({from: accounts[8], value: 1000000000000000000});
            }).then(assert.fail).catch(function(error) {
                assert(error.message.indexOf('revert' >= 0, 'The Contract is inactive. Lets active and try again'));
                return lgeContract.updateContractState(0);
            }).then(function() {
                return lgeContract.addLiquidity({from: accounts[8], value: 1000000000000000000});
            }).then(function() {
                return lgeContract.liquidityProviders(accounts[8]);
            }).then(function(value) {
                //checking balance of liquidity funder
                assert.equal(value, 1000000000000000000, 'Value is correct');
            })
        });
    });

    describe('Adding Harvesters', function(){
        let harvesters;
        before(function(){
            harvesters = accounts.slice(1, 5);
        });

        it('Trying different tests while adding harvesters', function(){
            return lgeContract.addHarvesters(harvesters, {from: accounts[1]})
            .then(assert.fail).catch(function(err){
                assert(err.message.indexOf('revert' >= 0, 'Sender is not the owner!'));
                let testHarvesters = accounts.slice(0,6);
                return lgeContract.addHarvesters(testHarvesters)
                .then(assert.fail).catch(function(error) {
                    assert(error.message.indexOf('revert' >= 0, 'Invalid Harvester'));
                    return lgeContract.addHarvesters(harvesters, {from: accounts[0]})
                });
            });
        });
    });

    describe('Create Harvest Request', function(){
        let harvesters;
        before(function() {
            //adding founders
            harvesters = accounts.slice(1, 5);
            // lgeContract.addHarvesters(harvesters, {from: accounts[0]});
        });

        it('Creating the Harvest', function(){
            return lgeContract.createHarvestRequest(Web3Utils.toBN("160000000000000000000"), accounts[7], 'testing', {from: accounts[7]})
            .then(assert.fail).catch(function(err){
                assert(err.message.indexOf('revert' >= 0, 'Invalid Harvester'));
                return lgeContract.createHarvestRequest(Web3Utils.toBN("16000000000000000000000"), accounts[7], 'testing', {from: accounts[1]})
            }).then(assert.fail).catch(function(error){
                assert(error.message.indexOf('revert' >= 0, 'Amount is greater than contract value'));
                //This test was supposed to fail
                return lgeContract.createHarvestRequest(Web3Utils.toBN("1000000000000000000"), accounts[7], 'testing', {from: accounts[1]})
            }).then(function(){
                return lgeContract.getHarvesters();
                // console.log(lgeContract.harvest_rqst_arr.length);
            }).then(function(harvest_rqst_arr) {
                console.log(harvest_rqst_arr.length)
                assert(harvest_rqst_arr.length > 0, 'We have the harvesters');
            });
        });

        it('Approving Harvest', function() {
            return lgeContract.createHarvestRequest(Web3Utils.toBN("1000000000000000000"), accounts[7], 'testing', {from: accounts[1]})
            .then(function(){
                console.log('Request Created');
                return lgeContract.approveHarvestRequest(20)
            }).then(assert.fail).catch(function(err) {
                assert(err.message.indexOf('revert' >= 0, 'Invalid request id'));
                return lgeContract.approveHarvestRequest(2, {from: accounts[9]});
            }).then(assert.fail).catch(function(error){
                assert(error.message.indexOf('revert', 'Invalid Harvester'));
                return lgeContract.approveHarvestRequest(1, {from: accounts[0]});
            }).then(function(){
                return lgeContract.approveHarvestRequest(1, {from: accounts[0]});
            }).then(assert.fail).catch(function(error1){
                assert(error1.message.indexOf('revert' >= 0, 'Sender has already Approved'));
                return lgeContract.approveHarvestRequest(1, {from: accounts[1]});
            }).then(function(receipt){
                assert.equal(receipt.logs.length, 1, 'triggers one event');
                assert.equal(receipt.logs[0].event, 'HarvestRequestApproval', 'should be the "HarvestRequestApproval" event');
                assert.equal(receipt.logs[0].args.request_id, 1, 'logs the request id that is done and dusted');
            });
        });

        it('Harvesting Liquidity', function(){
            let account7Bal;
            return lgeContract.harvestLiquidity(6)
            .then(assert.fail).catch(function(error){
                assert(error.message.indexOf('revert' >= 0, 'Invalid request ID'));
                return lgeContract.harvestLiquidity(0, {from: accounts[7]}) 
             })
             .then(assert.fail).catch(async function(error1){
                assert(error1.message.indexOf('revert' >= 0, 'Invalid Harvester'));
                account7Bal = await web3.eth.getBalance(accounts[7]);
                return lgeContract.harvestLiquidity(1, {from: accounts[1]});
            }).then(async function(){
                let newBalance = await web3.eth.getBalance(accounts[7]);
                console.log(account7Bal);
                console.log(newBalance);
                assert(account7Bal < newBalance);
                account7Bal = newBalance;
                return lgeContract.harvestLiquidity( 1, {from: accounts[1]})
            }).then(assert.fail).catch(function(error4){
                assert(error4.message.indexOf('revert' >= 0, 'The request has already executed!'))
            });
        });
    });
});