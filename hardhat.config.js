/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config()
require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: "0.8.4",

  networks: {
    mainnet: {
      url: process.env.NODE_PROVIDER,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },

  etherscan: {
    apiKey: process.env.ETHER_SCAN_API_KEY
  }
};
