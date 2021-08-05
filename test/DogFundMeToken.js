const DogFundMeToken = artifacts.require('DogFundMeToken');
const Web3 = require('web3');
const Web3Utils = require('web3-utils');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));

contract ('DogFundMeToken', (accounts) => {
    let dogFundMeToken;

    before(async () => {
        dogFundMeToken = await DogFundMeToken.deployed();
    });
    describe('Deployment', async () =>{
        it('dog Fund Me Token is deployed Sucessfully', async () => {
            const address = await dogFundMeToken.address;
            console.log(address);
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
            assert.notEqual(address, '');
        });
        // it('dog Fund Me Token Has Owner', async () => {
        //     const owner = await dogFundMeToken._owner;
        //     assert.notEqual(owner, 0x0);
        //     assert.notEqual(owner, null);
        //     assert.notEqual(owner, undefined);
        //     assert.notEqual(owner, '');
        // });
    });
});