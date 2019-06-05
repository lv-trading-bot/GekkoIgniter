var express = require('express');
var router = express.Router();
const {postRunGekko} = require('../controllers/run_gekko');

/* GET users listing. */
router.post('/', postRunGekko);

module.exports = router;
