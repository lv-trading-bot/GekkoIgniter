var express = require('express');
var router = express.Router();
const {postStartGekko} = require('../controllers/start_gekko');

/* GET users listing. */
router.post('/', postStartGekko);

module.exports = router;
