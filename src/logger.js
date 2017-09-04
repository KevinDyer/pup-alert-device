const winston = require('winston');


const isVerbose = process.argv.some((arg) => '--verbose' === arg || '-v' === arg);
const level = (isVerbose ? 'debug' : 'info');
console.log(`isVerbose: ${isVerbose}`);
console.log(`level: ${level}`);

const consoleOptions = {
  colorize: true,
  timestamp: true,
  prettyPrint: true,
  depth: 2
};

const fileOptions = {
  colorize: true,
  timestamp: true,
  filename: '/tmp/pup-alert-device.log',
  maxsize: 4 * 1024 * 1024,
  maxFiles: 10,
  prettyPrint: true,
  depth: null 
};

const logger = new winston.Logger({
  level: level,
  transports: [
    new winston.transports.Console(consoleOptions),
    new winston.transports.File(fileOptions),
  ]
});

module.exports = logger;
