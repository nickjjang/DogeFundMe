const hre = require("hardhat");
const { ethers } = hre;
const harvesters = require("../secrets.json").addresses;
const Web3 = require('web3');
const lgeAbi = require('../artifacts/contracts/LGE.sol/LGEContract.json')
const HDWalletProvider = require("@truffle/hdwallet-provider");

let provider = new HDWalletProvider(process.env.PRIVATE_KEY, `https://ropsten.infura.io/v3/1603d226fdf0402e87f5f5d56ae7b66a`)

async function main() {

    const web3 = new Web3(provider)

    const accounts = await web3.eth.getAccounts();

    const LGE = await ethers.getContractFactory('LGEContract');
    const lge = await LGE.deploy('3');

    await lge.deployed();

    // const lgeContractInstance = new web3.eth.Contract(lgeAbi.abi, lge.address);

    // await lgeContractInstance.methods.addHarvesters(harvesters).send({ from : accounts[0] })

    console.log(lge.address);
    // return lge.address;

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });