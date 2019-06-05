var config = {};
config.debug = true;
config.watch = {
  exchange: 'binance',
  currency: 'USDT',
  asset: 'BTC',
}
config.tradingAdvisor = {
  enabled: true,
  method: 'OMLBCTWithStopTradePaperTrade',
  candleSize: 60,
  historySize: 0,
}
config.production = true;
config.loggerAdapter = 'file';
config.connectManager = {
  enabled: true,
  baseApi: process.env.LIVE_TRADE_MANAGER_BASE_API,
  init: "/init",
  reconnect: "/reconnect",
  trigger: "/trigger",
  trade: "/trade",
  portfolio: "/portfolio"
}
config['OMLBCTWithStopTradePaperTrade'] = {
  stopLoss: -10,
  takeProfit: 2,
  amountForOneTrade: 100,
  expirationPeriod: 24,
  decisionThreshold: 0.5,
  stopTradeLimit: -100,
  // totalWatchCandles: 24,
  breakDuration: -1,
  modelInfo: {
    model_type: 'rolling',
    model_name: 'random_forest',
    lag: 23,
    features: ['start', 'open', 'high', 'low', 'close', 'trades', 'volume',
      {
        name: 'omlbct',
        params: {
          'takeProfit': 2,
          'stopLoss': -10,
          'expirationPeriod': 24
        }
      },
      {
        name: 'TREND_BY_DI',
        params: {
          period: 14
        }
      }
    ],
    label: 'omlbct',
    train_daterange: {
      from: '2019-01-01T00:00:00.000Z',
      to: '2019-04-01T00:00:00.000Z',
    },
    rolling_step: 24*30
  }
}
config.paperTrader = {
  enabled: false,
  // report the profit in the currency or the asset?
  reportInCurrency: true,
  // start balance, on what the current balance is compared with
  simulationBalance: {
    // these are in the unit types configured in the watcher.
    asset: 0,
    currency: 5000,
  },
  // how much fee in % does each trade cost?
  feeMaker: 0.1,
  feeTaker: 0.1,
  feeUsing: 'maker',
  // how much slippage/spread should Gekko assume per trade?
  slippage: 0.05,
}
config.performanceAnalyzer = {
  enabled: true,
  riskFreeReturn: 5,
  roundTripReportMode: "BY_DOUBLESTOP_TRIGGER"
}
config.trader = {
  enabled: false,
  key: '',
  secret: '',
  username: '', // your username, only required for specific exchanges.
  passphrase: '', // GDAX, requires a passphrase.
}
config.mailer = {
  enabled: true, // Send Emails if true, false to turn off
  sendMailOnStart: true, // Send 'Gekko starting' message if true, not if false

  email: 'phuotm6tet@gmail.com', // Your Gmail address
  muteSoft: true, // disable advice printout if it's soft

  // You don't have to set your password here, if you leave it blank we will ask it
  // when Gekko's starts.
  //
  // NOTE: Gekko is an open source project < https://github.com/askmike/gekko >,
  // make sure you looked at the code or trust the maintainer of this bot when you
  // fill in your email and password.
  //
  // WARNING: If you have NOT downloaded Gekko from the github page above we CANNOT
  // guarantuee that your email address & password are safe!

  password: 'xstormdiphuot', // Your Gmail Password - if not supplied Gekko will prompt on startup.

  tag: '[GEKKO] ', // Prefix all email subject lines with this

  //       ADVANCED MAIL SETTINGS
  // you can leave those as is if you
  // just want to use Gmail

  server: 'smtp.gmail.com', // The name of YOUR outbound (SMTP) mail server.
  smtpauth: true, // Does SMTP server require authentication (true for Gmail)
  // The following 3 values default to the Email (above) if left blank
  user: 'phuotm6tet@gmail.com', // Your Email server user name - usually your full Email address 'me@mydomain.com'
  from: 'Tin Tin Trading', // 'me@mydomain.com'
  to: 'xuantinfx@gmail.com', // 'me@somedomain.com, me@someotherdomain.com'
  ssl: true, // Use SSL (true for Gmail)
  port: '', // Set if you don't want to use the default port
}
config.telegrambot = {
  enabled: true,
  // Receive notifications for trades and warnings/errors related to trading
  emitTrades: true,
  token: '851670778:AAE3MQ0Jz1IqX-yDQhAfHuO43E22_oRYRQ4',
  defaultSubcribes: [/*721265885,*/ -393431991]
  // 721265885: Xuân Tin Id
  // -393431991: Group Trading Id
};
config['I understand that Gekko only automates MY OWN trading strategies'] = true;
module.exports = config;