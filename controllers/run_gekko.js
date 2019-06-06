const { createAndRunNewRealtimeGekkoContainer } = require('../libs/runGekkoProcess');
const { prepareForRealtimeGekkoProcess } = require('../libs/prepareForGekkoProcess');
const log = require('../log');
const utils = require('../utils');
const _ = require('lodash');

const gekkoImageName = utils.getConfig().gekkoImageName;
const networkName = utils.getConfig().networkName;
const nameConfigInGekko = utils.getConfig().nameConfigInGekko;

const prefixGekkoContainer = 'test_auto_run_gekko';

// const sample_config = {
//     exchange: "binance",
//     asset_name: "BTC",
//     currency_name: "USDT",
//     candleSize: 600,
//     stopLoss: -10,
//     takeProfit: 2,
//     amountForOneTrade: 100,
//     expirationPeriod: 24,
//     decisionThreshold: 0.5,
//     stopTradeLimit: -100,
//     breakDuration: -1,
//     model_type: "rolling",
//     model_name: "random_forest",
//     lag: 23,
//     features: ['start', 'open', 'high', 'low', 'close', 'trades', 'volume',
//         {
//             name: 'omlbct',
//             params: {
//                 'takeProfit': 2,
//                 'stopLoss': -10,
//                 'expirationPeriod': 24
//             }
//         },
//         {
//             name: 'TREND_BY_DI',
//             params: {
//                 period: 14
//             }
//         }
//     ],
//     label: "omlbct",
//     train_daterange: {
//         from: '2019-01-01T00:00:00.000Z',
//         to: '2019-04-01T00:00:00.000Z',
//     },
//     rolling_step: 24 * 30,
//     mailTag: "[GEKKO]",

//     mode: "paper", // paper || live

//     // live
//     key: "jashjdhsd",
//     secret: "erueuishjd",

//     // paper
//     asset: 0,
//     currency: 50000,
// }

const paramsTypeOfPostRunGekko = {
    asset_name: (val, body) => _.isString(val) && !_.isEmpty(val),
    currency_name: (val, body) => _.isString(val) && !_.isEmpty(val),
    candleSize: (val, body) => (!_.isNaN(parseFloat(val))),
    stopLoss: (val, body) => (!_.isNaN(parseFloat(val))),
    takeProfit: (val, body) => (!_.isNaN(parseFloat(val))),
    amountForOneTrade: (val, body) => (!_.isNaN(parseFloat(val))),
    expirationPeriod: (val, body) => (!_.isNaN(parseFloat(val))),
    decisionThreshold: (val, body) => (!_.isNaN(parseFloat(val))),
    stopTradeLimit: (val, body) => (!_.isNaN(parseFloat(val))),
    breakDuration: (val, body) => (!_.isNaN(parseFloat(val))),
    model_type: (val, body) => _.isString(val) && !_.isEmpty(val)/* && (val === 'rolling' || val === 'fixed')*/,
    model_name: (val, body) => _.isString(val) && !_.isEmpty(val)/* && (val === 'random_forest' || val === 'gradient_boosting')*/,
    lag: (val, body) => (!_.isNaN(parseFloat(val))),
    features: (val, body) => (_.isArray(val)),
    label: (val, body) => _.isString(val) && !_.isEmpty(val),
    train_daterange: (val, body) => _.isObject(val) && !_.isEmpty(val.from) && !_.isEmpty(val.to),
    rolling_step: (val, body) => (!_.isNaN(parseFloat(val))),
    mailTag: (val, body) => true,

    mode: (val, body) => _.isString(val) && !_.isEmpty(val) && (val === 'paper' || val === 'live'), // paper || live

    // live
    key: (val, body) => body.mode === 'paper' || (_.isString(val) && !_.isEmpty(val)),
    secret: (val, body) => body.mode === 'paper' || (_.isString(val) && !_.isEmpty(val)),

    // paper
    asset: (val, body) => body.mode === 'live' || (!_.isNaN(parseFloat(val))),
    currency: (val, body) => body.mode === 'live' || (!_.isNaN(parseFloat(val))),
}

const validateReqBody = (body) => {
    for (let key in paramsTypeOfPostRunGekko) {
        if ( !paramsTypeOfPostRunGekko[key](body[key], body)) {
            throw new Error(`${key} thiếu hoặc sai định dạng`);
        }
    }
}

const postRunGekko = (req, res, next) => {

    try {
        validateReqBody(req.body);
    } catch (error) {
        res.status(500).send({error: "" + error});
        return;   
    }

    let id = `${(new Date()).getTime()}_${(Math.random() * 1000).toFixed(0)}`;
    let containerName = `${prefixGekkoContainer}_${id}`;
    prepareForRealtimeGekkoProcess(id, req.body)
        .then(path => {
            return createAndRunNewRealtimeGekkoContainer(id, {
                configName: `${nameConfigInGekko}.js`,
                containerName: containerName,
                imageName: gekkoImageName,
                networkName: networkName
            })
        })
        .then(code => {
            res.send({ containerName, code });
        })
        .catch(err => {
            res.send(err);
            log.warn(err);
        })
}

module.exports = {
    postRunGekko
}