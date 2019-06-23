const utils = require('./utils');
const _ = require('lodash');

const gekkoImageName = utils.getConfig().gekkoImageName;
const networkName = utils.getConfig().networkName;
const nameConfigInGekko = utils.getConfig().nameConfigInGekko;

const prefixGekkoContainer = 'live_gekko';

// Id là tên của thư mục trong binding_diẻctory
const gekkoIdList = [];

const { runChildProcess } = require('./libs/runChildProcess');
const { createAndRunNewRealtimeGekkoContainer } = require('./libs/runGekkoProcess');

const upgradeGekko = (id) => {
    let containerName = `${prefixGekkoContainer}_${id}`;
    runChildProcess("docker", ["stop", containerName])
    .then(code => {
        return runChildProcess("docker", ["rm", containerName])
    })
    .then(code => {
        return createAndRunNewRealtimeGekkoContainer(id, {
            configName: `${nameConfigInGekko}.js`,
            containerName: containerName,
            imageName: gekkoImageName,
            networkName: networkName
        })
    })
    .then(code => {

    })
    .catch(error => {
        console.log(error);
        return; 
    })
}

for(let i = 0; i < gekkoIdList.length; i++) {
    upgradeGekko(gekkoIdList[i]);
}