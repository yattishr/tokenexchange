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
               gas: 4700000, // set the max gas limit.
               from: "0x2a17b2AE525D02a1F3A23AFFd27609611961f68c" // rinkeby account 1
          }
     }
};
