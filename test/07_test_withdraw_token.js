var fixedSupplyToken = artifacts.require("./FixedSupplyToken.sol");
var exchange = artifacts.require("./Exchange.sol");

contract('Exchange Unit Tests', function(accounts) {

// test 1: should be possible to Withdraw Token
it("should be possible to Withdraw Token", function () {
    var myExchangeInstance;
    var myTokenInstance;
    var balancedTokenInExchangeBeforeWithdrawal;
    var balanceTokenInTokenBeforeWithdrawal;
    var balanceTokenInExchangeAfterWithdrawal;
    var balanceTokenInTokenAfterWithdrawal;

    return fixedSupplyToken.deployed().then(function (instance) {
        myTokenInstance = instance;
        return instance;
    }).then(function (tokenInstance) {
        myTokenInstance = tokenInstance;
        return exchange.deployed();
    }).then(function (exchangeInstance) {
        myExchangeInstance = exchangeInstance;
        return myExchangeInstance.getBalance.call("FIXED");
    }).then(function(balanceExchange) {
        balancedTokenInExchangeBeforeWithdrawal = balanceExchange.toNumber();
        return myTokenInstance.balanceOf.call(accounts[0]);
    }).then(function(balanceToken) {
        balanceTokenInTokenBeforeWithdrawal = balanceToken.toNumber();
        return myExchangeInstance.withdrawToken("FIXED", balancedTokenInExchangeBeforeWithdrawal);
    }).then(function(txResult) {
        return myExchangeInstance.getBalance.call("FIXED");
    }).then(function(balanceExchange) {
        balanceTokenInExchangeAfterWithdrawal = balanceExchange.toNumber();
        return  myTokenInstance.balanceOf.call(accounts[0]);
    }).then(function(balanceToken) {
        balanceTokenInTokenAfterWithdrawal = balanceToken.toNumber();
        assert.equal(balanceTokenInExchangeAfterWithdrawal, 0, "There should be 0 tokens left in the exchange");
        assert.equal(balanceTokenInTokenAfterWithdrawal, balancedTokenInExchangeBeforeWithdrawal + balanceTokenInTokenBeforeWithdrawal, "There should be 0 tokens left in the exchange");
    });
  });
});
