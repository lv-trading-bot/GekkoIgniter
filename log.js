/*

  Lightweight logger, print everything that is send to error, warn
  and messages to stdout (the terminal). If config.debug is set in config
  also print out everything send to debug.

*/

var moment = require('moment');
var fmt = require('util').format;
var _ = require('lodash');
var utils = require('./utils');
var config = utils.getConfig();
var debug = config.debug;
var silent = config.silent;

var production = true;
var loggerAdapter = config.loggerAdapter;

var sendToParent = function() {
  var send = method => (...args) => {
    process.send({log: method, message: args.join(' ')});
  }

  return {
    error: send('error'),
    warn: send('warn'),
    info: send('info'),
    write: send('write')
  }
}

var Log = function() {
  _.bindAll(this);

  if(production) {
    this.logger = (require('./logger/' + loggerAdapter));
  }

  this.env = 'standalone';

  if(this.env === 'standalone')
    this.output = console;
  else if(this.env === 'child-process')
    this.output = sendToParent();
};

Log.prototype = {
  _write: function(method, args, name) {
    if(!name)
      name = method.toUpperCase();

    var message = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    message += ' (' + name + '):\t';
    message += fmt.apply(null, args);

    this.output[method](message);
    if(production) {
      this.logger[method](message);
    }
  },
  error: function() {
    this._write('error', arguments);
  },
  warn: function() {
    this._write('warn', arguments);
  },
  info: function() {
    this._write('info', arguments);
  },
  write: function() {
    var args = _.toArray(arguments);
    var message = fmt.apply(null, args);
    this.output.info(message);
  }
}

if(debug)
  Log.prototype.debug = function() {
    this._write('info', arguments, 'DEBUG');  
  }
else
  Log.prototype.debug = _.noop;

if(silent) {
  Log.prototype.debug = _.noop;
  Log.prototype.info = _.noop;
  Log.prototype.warn = _.noop;
  Log.prototype.error = _.noop;
  Log.prototype.write = _.noop;
}

module.exports = new Log;