var config = {};

config.marketsAndPair = {
    exchange: "binance",
    currency: "USDT",
    asset: "BTC"
};

config.candleSizes = 60;

config.dateRanges = {
    trainDaterange: {
        from: "2018-02-11T21:00:00.000Z",
        to: "2018-03-30T18:00:00.000Z"
    },
    backtestDaterange: {
        from: "2018-04-15T09:00:00.000Z",
        to: "2018-05-01T00:00:00.000Z"
    }
}

config.settingsOfStrategy = {
    stopLoss: -10,
    takeProfit: 2,
    amountForOneTrade: 100,
    expirationPeriod: 24,
    decisionThreshold: 0.5,
    backtest: true,
    dataFile: "",
    stopTradeLimit: -5000,
    // totalWatchCandles: 24,
    breakDuration: -1,
    features: ["start", "open", "high", "low", "close", "volume", "trades", {
        name: "omlbct",
        params: {
            takeProfit: 2,
            stopLoss: -10,
            expirationPeriod: 24
        }
    }
    ],
    label: "omlbct",
    note: "Ghi chú tại đây"
}

config.modelName = "random_forest";

config.modelType = "fixed";

config.rollingStep = 5;

config.modelLag = 23;

config.api_base = process.env.ML_BASE_API;

config.asset = 0;

config.currency = 5000;

config.fileNameResult = process.env.FILE_NAME_RESULT

module.exports = config;