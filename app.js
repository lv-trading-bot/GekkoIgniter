var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');

var indexRouter = require('./routes/index');
var runGekkoRouter = require('./routes/run_gekko');
var stopGekkoRouter = require('./routes/stop_gekko');
var startGekkoRouter = require('./routes/start_gekko');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('combined', {
  stream: fs.createWriteStream(path.join(__dirname, 'logs/requests.log'), { flags: 'a' })
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/run-gekko', runGekkoRouter);
app.use('/stop-gekko', stopGekkoRouter);
app.use('/start-gekko', startGekkoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
