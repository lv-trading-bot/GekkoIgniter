const log = require('../log');
const utils = require('../utils');
const _ = require('lodash');
const {runChildProcess} = require('../libs/runChildProcess');

const paramsTypeOfPostStopGekko = {
    container_name: (val, body) => _.isString(val) && !_.isEmpty(val),
}

const validateReqBody = (body) => {
    for (let key in paramsTypeOfPostStopGekko) {
        if ( !paramsTypeOfPostStopGekko[key](body[key], body)) {
            throw new Error(`${key} thiếu hoặc sai định dạng`);
        }
    }
}

const postStopGekko = (req, res, next) => {
    try {
        validateReqBody(req.body);
    } catch (error) {
        res.status(500).send({error: "" + error});
        return;   
    }

    runChildProcess("docker", ["stop", req.body.container_name])
    .then(code => {
        res.send({code});
    })
    .catch(error => {
        log.warn(error);
        res.status(500).send({error: "" + error});
        return; 
    })
}

module.exports = {
    postStopGekko
}