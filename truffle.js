module.exports = {
     // See <http://truffleframework.com/docs/advanced/configuration>
     // to customize your Truffle configuration!
     networks: {
          ganache: {
               host: "localhost",
               port: 7545,
               network_id: "*", // Match any network id
               gas: 4700000// set the max gas limit.
          },
          development: {
               host: "localhost",
               port: 8545,
               network_id: "*", // Match any network id
               gas: 6000000// set the max gas limit.
          },
          rinkeby: {
               host: "localhost",
               port: 8545,
               network_id: "4", // Match 4 network id for Rinkeby Testnet.
               gas: 4700000// set the max gas limit.
          }
     }
};
