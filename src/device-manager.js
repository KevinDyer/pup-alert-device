const Raspi = require('raspi-io');
const five = require('johnny-five');
const logger = require('./logger');

class DeviceManager {
  load() {
    return Promise.resolve()
    .then(() => {
      const board = new five.Board({
        io: new Raspi(),
        repl: false
      });
      board.on('connect', () => logger.debug('Board connected'));
      board.on('ready', () => logger.debug('Board ready'));
      board.on('exit', () => logger.debug('Board exited'));
    });
  }
}

module.exports = DeviceManager;