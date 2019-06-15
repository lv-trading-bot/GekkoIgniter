const { runChildProcess } = require('./runChildProcess');
const fs = require('fs');

const createAndRunNewRealtimeGekkoContainer = (id, {configName, containerName, imageName, networkName}) => {
    let agrs = [
        "run",
        "-d",
        "-e",
        `CONFIG_NAME=${configName}`,
        "-e",
        `MODE=realtime`,
        "-e",
        `E_IGNITER=${containerName}`,
        "-e",
        `LIVE_TRADE_MANAGER_BASE_API=${process.env.LIVE_TRADE_MANAGER_BASE_API}`,
        "-e",
        `AUTHENTICATION_TOKEN=${process.env.AUTHENTICATION_TOKEN}`,
        "-v",
        `${__dirname}/../binding_directory/${id}/config.js:/usr/src/app/${configName}`,
        "-v",
        `${__dirname}/../binding_directory/${id}/logs:/usr/src/app/logs`,
        "-v",
        `${__dirname}/../binding_directory/${id}/save_info:/usr/src/app/save_info`,
        "--name",
        containerName,
        "--restart", 
        "unless-stopped",
        "--network",
        networkName,
        imageName
    ];

    //docker run --rm -e CONFIG_NAME="config1.js" -v "D:/H?c t?p/Lu?n Văn/Code/gekko/save_info/config1.js:/usr/src/app/config1.js" --name test_gekko_config test_gekko_config
    return runChildProcess('docker', agrs);
}

const createAndRunNewBacktestGekkoContainer = (id, {configName, containerName, imageName, networkName}) => {
    let agrs = [
        "run",
        "-e",
        `CONFIG_NAME=${configName}`,
        "-e",
        `MODE=backtest`,
        "-e",
        `E_IGNITER=${containerName}`,
        "-e",
        `ML_BASE_API=${process.env.ML_BASE_API}`,
        "-e",
        `AUTHENTICATION_TOKEN=${process.env.AUTHENTICATION_TOKEN}`,
        "-e",
        `MONGO_INITDB_ROOT_USERNAME=${process.env.MONGO_INITDB_ROOT_USERNAME}`,
        "-e",
        `MONGO_INITDB_ROOT_PASSWORD=${process.env.MONGO_INITDB_ROOT_PASSWORD}`,
        "-v",
        `${__dirname}/../binding_directory/backtest_${id}/backtest-config.js:/usr/src/app/${configName}`,
        "-v",
        `${__dirname}/../binding_directory/backtest_${id}/result.json:/usr/src/app/result.json`,
        "--name",
        containerName,
        "--rm",
        "--network",
        networkName,
        imageName
    ];

    //docker run --rm -e CONFIG_NAME="config1.js" -v "D:/H?c t?p/Lu?n Văn/Code/gekko/save_info/config1.js:/usr/src/app/config1.js" --name test_gekko_config test_gekko_config
    return runChildProcess('docker', agrs);
}

module.exports = {
    createAndRunNewRealtimeGekkoContainer,
    createAndRunNewBacktestGekkoContainer
}