var express = require('express');
var router = express.Router();
const {postStopGekko} = require('../controllers/stop_gekko');

/* GET users listing. */
router.post('/', postStopGekko);

module.exports = router;
