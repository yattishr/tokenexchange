var fixedSupplyToken = artifacts.require("./FixedSupplyToken.sol");
var exchange = artifacts.require("./Exchange.sol");

contract('Exchange Unit Tests', function(accounts) {

// test_3: should be possible to Deposit Token
it("should be possible to Deposit Token", function () {
       var myExchangeInstance;
       var myTokenInstance;
       return fixedSupplyToken.deployed().then(function (instance) {
           myTokenInstance = instance;
           return instance;
       }).then(function (tokenInstance) {
           myTokenInstance = tokenInstance;
           return exchange.deployed();
       }).then(function (exchangeInstance) {
           myExchangeInstance = exchangeInstance;
           return myTokenInstance.approve(myExchangeInstance.address, 2000);
       }).then(function(txResult) {
           return myExchangeInstance.depositToken("FIXED", 2000);
       }).then(function(txResult) {
           // console.log(txResult);
           return myExchangeInstance.getBalance("FIXED");
       }).then(function(balanceToken) {
           assert.equal(balanceToken, 2000, "There should be 2000 tokens for the address");
       });
   });
});
