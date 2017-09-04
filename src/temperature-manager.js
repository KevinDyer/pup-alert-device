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

  _onChange(...data) {
    console.log(require('util').inspect(data, {colors: true, depth: 1}));
  }

  _onData(...data) {
    console.log(require('util').inspect(data, {colors: true, depth: 1}));
  }

  load() {
    return Promise.resolve()
    .then(() => {
      this._thermometer.enable();
    });
  }
}

module.exports = TemperatureManager;
