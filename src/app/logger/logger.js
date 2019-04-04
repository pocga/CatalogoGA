const winston = require('winston'),
    fs = require('fs'),
    logDir = `${__dirname}/logs`;

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
    fs.mkdirSync(`${logDir}/history`);
}

const tsFormat = () => new Date().toLocaleTimeString();
const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            name: 'complete',
            filename: `${logDir}/complete.log`,
            timestamp: tsFormat,
            json: false,
            colorize: false,
            prettyPrint: true
        }),
        new winston.transports.File({
            name: 'errors',
            filename: `${logDir}/errors.log`,
            timestamp: tsFormat,
            colorize: false,
            json: false,
            level: 'error',
            prettyPrint: true,
        }),
        new winston.transports.Console({
            timestamp: tsFormat,
            colorize: false,
            prettyPrint: true
        })
    ]
});

module.exports = logger;