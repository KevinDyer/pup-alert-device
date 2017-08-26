const winston = require('winston');

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
  level: 'debug',
  transports: [
    new winston.transports.Console(consoleOptions),
    new winston.transports.File(fileOptions),
  ]
});

module.exports = logger;