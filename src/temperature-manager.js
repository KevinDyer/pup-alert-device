const EventEmitter = require('events');
const five = require('johnny-five');

class TemperatureManager extends EventEmitter {
  constructor() {
    super();
    this._thermometer = new five.Thermometer({
      controller: 'TMP102',
      freq: 10 * 1000
    });
    this._thermometer.on('change', this._onChange.bind(this));
    this._thermometer.on('data', this._onData.bind(this));
    this._thermometer.disable();
  }

  _onChange(event) {
    console.log(`[${Date.now()}]: Change`);
    console.log(require('util').inspect(event, {colors: true, depth: 1}));
  }

  _onData(event) {
    console.log(`[${Date.now()}]: Data`);
    console.log(require('util').inspect(event, {colors: true, depth: 1}));
  }

  load() {
    return Promise.resolve()
    .then(() => {
      this._thermometer.enable();
    });
  }
}

module.exports = TemperatureManager;
