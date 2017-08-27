const Raspi = require('raspi-io');
const five = require('johnny-five');
const logger = require('./logger');

class DeviceManager {
  constructor() {
    this._board = new five.Board({
      io: new Raspi(),
      repl: false
    });
    this._board.on('connect', () => logger.debug('Board connected'));
    this._board.on('ready', () => {
      logger.debug('Board ready');
      console.log(require('util').inspect(this._board, {colors: true, depth: null}));
    });
    this._board.on('exit', () => logger.debug('Board exited'));
  }
  load() {
    return Promise.resolve()
    .then(() => {
      console.log(require('util').inspect(this._board, {colors: true, depth: null}));
    });
  }
}

module.exports = DeviceManager;