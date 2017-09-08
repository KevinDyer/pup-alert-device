const EventEmitter = require('events');
const five = require('johnny-five');
const logger = require('./logger');

class TemperatureManager extends EventEmitter {
  constructor() {
    super();
    this._thermometer = new five.Thermometer({
      controller: 'TMP102',
      freq: 10 * 1000
    });
    this._thermometer.on('data', this._onData.bind(this));
    this._thermometer.disable();
  }

  _onData(event) {
    logger.debug('New temperature', event);
    this.emit('temp', event);
  }

  load() {
    return Promise.resolve()
    .then(() => {
      this._thermometer.enable();
    });
  }
}

module.exports = TemperatureManager;
