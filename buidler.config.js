// buidler.config.js
require("dotenv").config();
require("@nomiclabs/buidler-etherscan");
require('@nomiclabs/buidler-ethers');

module.exports = {
    networks: {
        development: {
          url: "http://localhost:8545"
        },
        mainnet: {
          url: process.env.NODE_PROVIDER,
          accounts: [`0x${process.env.PRIVATE_KEY}`],
        }
      },
    
    
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: process.env.ETHER_SCAN_API_KEY,
    },
    solc: {
        version: "0.8.4"
      }
      
};