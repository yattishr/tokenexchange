var fixedSupplyToken = artifacts.require("./FixedSupplyToken.sol");
var exchange = artifacts.require("./Exchange.sol");

contract('Simple Order Tests', function (accounts) {
    before(function() {
        var instanceExchange;
        var instanceToken;
        return exchange.deployed().then(function (instance) {
            instanceExchange = instance;
             // deposit ETH into the Exchange.
            return instanceExchange.depositEther({from: accounts[0], value: web3.toWei(3, "ether")});
        }).then(function(txResult) {

            return fixedSupplyToken.deployed();
        }).then(function(myTokenInstance) {
            instanceToken = myTokenInstance;
            // add a new Token
            return instanceExchange.addToken("FIXED", instanceToken.address);
        }).then(function(txResult) {
            // approve the purchase of 2000 ETH.
            return instanceToken.approve(instanceExchange.address, 2000);
        }).then(function(txResult) {
            // deposit 2000 ETH in exchange for "FIXED" Tokens.
            return instanceExchange.depositToken("FIXED", 2000);
        });
    });

    // test_1: test tbat we can add a new buy limmit order.
    it("should be possible to add a limit buy order", function () {
        var myExchangeInstance;
        return exchange.deployed().then(function (instance) {
            myExchangeInstance = instance;
            return myExchangeInstance.getBuyOrderBook.call("FIXED");
        }).then(function (orderBook) {
            assert.equal(orderBook.length, 2, "BuyOrderBook should have 2 elements");
            assert.equal(orderBook[0].length, 0, "OrderBook should have 0 buy offers");
            return myExchangeInstance.buyToken("FIXED", web3.toWei(1, "finney"), 5);
        }).then(function(txResult) {
            /**
             * Assert the logs
             */
            // assert that one limit buy order was created.
            assert.equal(txResult.logs.length, 1, "There should have been one Log Message emitted.");
            assert.equal(txResult.logs[0].event, "LimitBuyOrderCreated", "The Log-Event should be LimitBuyOrderCreated");
            return myExchangeInstance.getBuyOrderBook.call("FIXED");
        }).then(function(orderBook) {
            assert.equal(orderBook[0].length, 1, "OrderBook should have 0 buy offers");
            assert.equal(orderBook[1].length, 1, "OrderBook should have 0 buy volume has one element");
        });
    });

    // test_2: test tbat we can add three new buy limmit orders.
    it("should be possible to add three limit buy orders", function () {
        var myExchangeInstance;
        var orderBookLengthBeforeBuy;
        return exchange.deployed().then(function (exchangeInstance) {
            myExchangeInstance = exchangeInstance;
            return myExchangeInstance.getBuyOrderBook.call("FIXED");
        }).then(function (orderBook) {
            orderBookLengthBeforeBuy = orderBook[0].length;
            return myExchangeInstance.buyToken("FIXED", web3.toWei(2, "finney"), 5); //we add one offer on top of another one, doesn't increase the orderBook
        }).then(function(txResult) {
            assert.equal(txResult.logs[0].event, "LimitBuyOrderCreated", "The Log-Event should be LimitBuyOrderCreated");
            return myExchangeInstance.buyToken("FIXED", web3.toWei(1.4, "finney"), 5); //we add a new offer in the middle
        }).then(function(txResult) {
            assert.equal(txResult.logs[0].event, "LimitBuyOrderCreated", "The Log-Event should be LimitBuyOrderCreated");
            return myExchangeInstance.getBuyOrderBook.call("FIXED");
        }).then(function(orderBook) {
            assert.equal(orderBook[0].length, orderBookLengthBeforeBuy+2, "OrderBook should have one more buy offers");
            assert.equal(orderBook[1].length, orderBookLengthBeforeBuy+2, "OrderBook should have 2 buy volume elements");
        });
    });

    // test_3: test tbat we can add two sell limit orders.
    it("should be possible to add two limit sell orders", function () {
        var myExchangeInstance;
        return exchange.deployed().then(function (instance) {
            myExchangeInstance = instance;
            return myExchangeInstance.getSellOrderBook.call("FIXED");
        }).then(function (orderBook) {
            // call the sellToken function to sell one "FIXED" Token for 3 "finney"
            return myExchangeInstance.sellToken("FIXED", web3.toWei(3, "finney"), 5);
        }).then(function(txResult) {
            /**
             * Assert the logs
             */
            assert.equal(txResult.logs.length, 1, "There should have been one Log Message emitted.");
            assert.equal(txResult.logs[0].event, "LimitSellOrderCreated", "The Log-Event should be LimitSellOrderCreated");
            // call the sellToken function again to sell one additional "FIXED" Token for 3 "finney"
            return myExchangeInstance.sellToken("FIXED", web3.toWei(6, "finney"), 5);
        }).then(function(txResult) {
            // call the getSellOrderBook for the "FIXED" Token.
            return myExchangeInstance.getSellOrderBook.call("FIXED");
        }).then(function(orderBook) {
            assert.equal(orderBook[0].length, 2, "OrderBook should have 2 sell offers");
            assert.equal(orderBook[1].length, 2, "OrderBook should have 2 sell volume elements");
        });
    });

    it("should be possible to create and cancel a buy order", function () {
        var myExchangeInstance;
        var orderBookLengthBeforeBuy, orderBookLengthAfterBuy, orderBookLengthAfterCancel, orderKey;
        return exchange.deployed().then(function (instance) {
            myExchangeInstance = instance;
            return myExchangeInstance.getBuyOrderBook.call("FIXED");
        }).then(function (orderBook) {
            orderBookLengthBeforeBuy = orderBook[0].length;
            return myExchangeInstance.buyToken("FIXED", web3.toWei(2.2, "finney"), 5);
        }).then(function(txResult) {
            // console.log(txResult);
            console.log(txResult.logs[0].args);
            /**
             * Assert the logs
             */
            assert.equal(txResult.logs.length, 1, "There should have been one Log Message emitted.");
            assert.equal(txResult.logs[0].event, "LimitBuyOrderCreated", "The Log-Event should be LimitBuyOrderCreated");
            orderKey = txResult.logs[0].args._orderKey;
            return myExchangeInstance.getBuyOrderBook.call("FIXED");
        }).then(function (orderBook) {
            orderBookLengthAfterBuy = orderBook[0].length;
            assert.equal(orderBookLengthAfterBuy, orderBookLengthBeforeBuy + 1, "OrderBook should have 1 buy offers more than before");
            return myExchangeInstance.cancelOrder("FIXED", false, web3.toWei(2.2, "finney"), orderKey);
        }).then(function(txResult) {
            assert.equal(txResult.logs[0].event, "BuyOrderCanceled", "The Log-Event should be BuyOrderCanceled");
            return myExchangeInstance.getBuyOrderBook.call("FIXED");
        }).then(function(orderBook) {
            orderBookLengthAfterCancel = orderBook[0].length;
            assert.equal(orderBookLengthAfterCancel, orderBookLengthAfterBuy, "OrderBook should have 1 buy offers, its not cancelling it out completely, but setting the volume to zero");
            assert.equal(orderBook[1][orderBookLengthAfterCancel-1], 0, "The available Volume should be zero");
        });
    });

});
