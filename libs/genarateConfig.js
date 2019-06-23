const fs = require('fs');
const sampleRealtimeConfig = require('../binding_directory/sample_realtime_config');
const sampleBacktestConfig = require('../binding_directory/sample-config-for-auto-backtest');
const _ = require('lodash');

const generateConfigString = (config) => {
    return new Promise((resolve, reject) => {
        let dataOut = '';
        dataOut += `var config = {}; \n`;
        for (let attr in config) {
            dataOut += `config['${attr}'] = ${JSON.stringify(config[attr], null, 2)};\n`
        }
        dataOut += "module.exports = config;";
        resolve(dataOut);
    })
}

const genarateRealtimeConfig = (path, config) => {
    return new Promise(async (resolve, reject) => {
        let curConfig = _.cloneDeep(sampleRealtimeConfig);

        // Update Config
        // watch
        // curConfig.watch.exchange = config.exchange;
        curConfig.watch.asset = config.asset_name;
        curConfig.watch.currency = config.currency_name;

        // tradingAdvisor
        curConfig.tradingAdvisor.candleSize = parseInt(config.candleSize);

        // OMLBCTWithStopTradePaperTrade
        curConfig["OMLBCTWithStopTradePaperTrade"].stopLoss = parseFloat(config.stopLoss);
        curConfig["OMLBCTWithStopTradePaperTrade"].takeProfit = parseFloat(config.takeProfit);
        curConfig["OMLBCTWithStopTradePaperTrade"].amountForOneTrade = parseFloat(config.amountForOneTrade);
        curConfig["OMLBCTWithStopTradePaperTrade"].expirationPeriod = parseFloat(config.expirationPeriod);
        curConfig["OMLBCTWithStopTradePaperTrade"].decisionThreshold = parseFloat(config.decisionThreshold);
        curConfig["OMLBCTWithStopTradePaperTrade"].stopTradeLimit = parseFloat(config.stopTradeLimit);
        curConfig["OMLBCTWithStopTradePaperTrade"].breakDuration = parseFloat(config.breakDuration);
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.model_type = config.model_type;
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.model_name = config.model_name;
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.lag = parseInt(config.lag);
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.features = config.features;
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.label = config.label;
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.train_daterange = config.train_daterange;
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.rolling_step = parseInt(config.rolling_step);

        // mailer
        curConfig.mailer.tag = config.mailTag || "[GEKKO]";

        if (config.mode === 'live') {
            curConfig.trader.enabled = true;
            curConfig.trader.key = config.key;
            curConfig.trader.secret = config.secret;
        } else {
            curConfig.paperTrader.enabled = true;
            curConfig.paperTrader.simulationBalance.asset = parseFloat(config.asset);
            curConfig.paperTrader.simulationBalance.currency = parseFloat(config.currency);
        }

        try {
            fs.writeFileSync(path, await generateConfigString(curConfig));
            resolve(path);
        } catch (error) {
            reject(error);
        }
    })
}

const genarateBacktestConfig = (path, config) => {
    return new Promise(async (resolve, reject) => {
        let curConfig = _.cloneDeep(sampleBacktestConfig);

        curConfig.marketsAndPair.currency = config.currency_name;
        curConfig.marketsAndPair.asset = config.asset_name;
        curConfig.candleSizes = parseInt(config.candleSize);
        curConfig.dateRanges = {
            trainDaterange: config.train_daterange,
            backtestDaterange: config.backtest_daterange
        };

        curConfig.settingsOfStrategy = {
            stopLoss: parseFloat(config.stopLoss),
            takeProfit: parseFloat(config.takeProfit),
            amountForOneTrade: parseFloat(config.amountForOneTrade),
            expirationPeriod: parseFloat(config.expirationPeriod),
            decisionThreshold: parseFloat(config.decisionThreshold),
            backtest: true,
            dataFile: "",
            stopTradeLimit: -500000,
            // totalWatchCandles: 24,
            breakDuration: -1,
            features: config.features,
            label: "omlbct",
            note: "Ghi chú tại đây"
        }

        curConfig.modelName = config.model_name;
        curConfig.modelType = config.model_type;
        curConfig.rollingStep = parseInt(config.rolling_step);
        curConfig.modelLag = parseInt(config.lag);
        curConfig.asset = config.asset ? parseFloat(config.asset) : 0;
        curConfig.currency = config.currency ? parseFloat(config.currency) : 5000;
        curConfig.fileNameResult = "result.json";

        try {
            fs.writeFileSync(path, await generateConfigString(curConfig));
            resolve(path);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    genarateRealtimeConfig,
    genarateBacktestConfig
}