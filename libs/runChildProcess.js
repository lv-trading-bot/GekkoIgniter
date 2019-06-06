const { spawn } = require('child_process');
const log = require('../log');

const runChildProcess = (cmd, agrs) => {
    return new Promise((resolve, reject) => {
        const instance = spawn(cmd, agrs);

        instance.stdout.on('data', (data) => {
            log.info(`stdout: ${data}`);
        });

        instance.stderr.on('data', (data) => {
            log.info(`stderr: ${data}`);
        });

        instance.on('close', (code) => {
            log.info(`child process exited with code ${code}`);
            resolve(code);
        });
    })
}

module.exports = {
    runChildProcess
}