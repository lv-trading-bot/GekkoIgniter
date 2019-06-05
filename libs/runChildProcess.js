const { spawn } = require('child_process');

const runChildProcess = (cmd, agrs) => {
    return new Promise((resolve, reject) => {
        const instance = spawn(cmd, agrs);

        instance.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        instance.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        instance.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            resolve(code);
        });
    })
}

module.exports = {
    runChildProcess
}