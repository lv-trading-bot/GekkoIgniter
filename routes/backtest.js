var express = require('express');
var router = express.Router();
const {postBacktest} = require('../controllers/backtest');

/* GET users listing. */
router.post('/', postBacktest);

module.exports = router;
