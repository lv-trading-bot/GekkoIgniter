const fs = require('fs');

const write = (method, messages) => {
    fs.appendFileSync(`./logs/${method}.log`, `${messages}\n`);
}

module.exports = {
    debug: (messages) => {
        write('debug', messages);
    },
    info: (messages) => {
        write('info', messages);
    },
    warn: (messages) => {
        write('warn', messages);
    },
    error: (messages) => {
        write('error', messages);
    },
    write: (messages) => {
        write('write', messages);
    },
}