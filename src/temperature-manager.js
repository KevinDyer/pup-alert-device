const EventEmitter = require('events');
const five = require('johnny-five');
const Raspi = require('raspi-io');
const logger = require('./logger');

class TemperatureManager extends EventEmitter {
  constructor() {
    super();
    this._board = new five.Board({
      io: new Raspi(),
      repl: false
    });
    this._thermometer = new five.Thermometer({
      controller: 'TMP102',
      freq: 10 * 1000
    });
    this._thermometer.on('data', this._onData.bind(this));
    this._thermometer.disable();
  }

  _onData(event) {
    this.emit('temp', event);
  }

  load() {
    return Promise.resolve()
    .then(() => {
      if (!this._board.isReady) {
        return new Promise((resolve) => {
          this._board.once('ready', resolve);
        });
      }
    })
    .then(() => this._thermometer.enable());
  }
}

module.exports = TemperatureManager;
