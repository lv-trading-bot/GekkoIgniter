const fs = require('fs');
const sampleRealtimeConfig = require('../binding_directory/sample_realtime_config');
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
        curConfig.watch.exchange = config.exchange;
        curConfig.watch.asset = config.asset_name;
        curConfig.watch.currency = config.currency_name;

        // tradingAdvisor
        curConfig.tradingAdvisor.candleSize = config.candleSize;

        // OMLBCTWithStopTradePaperTrade
        curConfig["OMLBCTWithStopTradePaperTrade"].stopLoss = config.stopLoss;
        curConfig["OMLBCTWithStopTradePaperTrade"].takeProfit = config.takeProfit;
        curConfig["OMLBCTWithStopTradePaperTrade"].amountForOneTrade = config.amountForOneTrade;
        curConfig["OMLBCTWithStopTradePaperTrade"].expirationPeriod = config.expirationPeriod;
        curConfig["OMLBCTWithStopTradePaperTrade"].decisionThreshold = config.decisionThreshold;
        curConfig["OMLBCTWithStopTradePaperTrade"].stopTradeLimit = config.stopTradeLimit;
        curConfig["OMLBCTWithStopTradePaperTrade"].breakDuration = config.breakDuration;
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.model_type = config.model_type;
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.model_name = config.model_name;
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.lag = config.lag;
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.features = config.features;
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.label = config.label;
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.train_daterange = config.train_daterange;
        curConfig["OMLBCTWithStopTradePaperTrade"].modelInfo.rolling_step = config.rolling_step;

        // mailer
        curConfig.mailer.tag = config.mailTag || "[GEKKO]";

        if (config.mode === 'live') {
            curConfig.trader.enabled = true;
            curConfig.trader.key = config.key;
            curConfig.trader.secret = config.secret;
        } else {
            curConfig.paperTrader.enabled = true;
            curConfig.paperTrader.simulationBalance.asset = config.asset;
            curConfig.paperTrader.simulationBalance.currency = config.currency;
        }

        try {
            fs.writeFileSync(path, await generateConfigString(curConfig));
            resolve(path);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    genarateRealtimeConfig
}