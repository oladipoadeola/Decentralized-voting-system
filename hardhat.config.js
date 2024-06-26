// require("@nomicfoundation/hardhat-toolbox");
// require('dotenv').config();

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//     solidity: "0.8.24",
//     paths: {
//         artifacts: './src/artifacts/',
//     },
//     networks: {
//         hardhat:{
//             chainId: 1337
//         }
//         // rinkeby: {
//         //     url: process.env.ALCHEMY_RINKEBY_URL,
//         //     accounts: [process.env.ACCOUNT_PRIVATE_KEY],
//         // },
//     },
// };

/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
    solidity: "0.8.24",
    paths: {
        artifacts: './src/artifacts/',
    },
   // defaultNetwork: "linea",
   networks: {
      hardhat: {
        chainId: 1337
      },
      volta: {
         chainId: 73799,
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`],
        //  gas: 210000000,
        //  gasPrice: 800000000000,
      },
      linea: {
         chainId: 59141,
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`],
         // gas: 210000000,
         // gasPrice: 800000000000,
      }
      
   },
}
