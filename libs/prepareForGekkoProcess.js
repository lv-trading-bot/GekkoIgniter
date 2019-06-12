const {runChildProcess} = require('./runChildProcess');
const {genarateRealtimeConfig, genarateBacktestConfig} = require('./genarateConfig');
const log = require('../log');
const fs = require('fs');

const prepareForRealtimeGekkoProcess = (id, config) => {
    // Tạo thư mục chứa thông tin của gekko trong binding_directory
    return runChildProcess('mkdir', [`${__dirname}/../binding_directory/${id}`])
    .then(code => {
        // Tạo thư mục save_info
        return runChildProcess('mkdir', [`${__dirname}/../binding_directory/${id}/save_info`])
    })
    .then(code => {
        // Tạo thư mục logs
        return runChildProcess('mkdir', [`${__dirname}/../binding_directory/${id}/logs`])
    })
    .then(code => {
        return genarateRealtimeConfig(`${__dirname}/../binding_directory/${id}/config.js`, config);
    })
    .catch(err => {
        log.error(err);
        reject(err);
    })
}

const prepareForBacktestGekkoProcess = (id, config) => {
    // Tạo thư mục chứa thông tin của gekko trong binding_directory
    return runChildProcess('mkdir', [`${__dirname}/../binding_directory/backtest_${id}`])
    .then(code => {
        return genarateBacktestConfig(`${__dirname}/../binding_directory/backtest_${id}/backtest-config.js`, config);
    })
    .then(code => {
        return fs.writeFileSync(`${__dirname}/../binding_directory/backtest_${id}/result.json`, "");
    })
    .catch(err => {
        log.error(err);
        reject(err);
    })
}

module.exports = {
    prepareForRealtimeGekkoProcess,
    prepareForBacktestGekkoProcess
}