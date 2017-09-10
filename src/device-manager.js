(() => {
  'use strict';

  const MAX_TEMP_THRESHOLD = 0.5;

  const EventEmitter = require('events');
  const Raspi = require('raspi-io');
  const five = require('johnny-five');

  class DeviceManager extends EventEmitter {
    constructor() {
      super();
      this._board = new five.Board({
        io: new Raspi(),
        repl: false,
        debug: false,
      });
      this._connectedLed = null;
      this._dataLed = null;
      this._temperatureLed = null;
      this._thermometer = null;
      this._lastTemp = null;
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
      .then(() => {
        this._connectedLed = new five.Led('P1-7');
        this._temperatureLed = new five.Led('P1-29');
        this._dataLed = new five.Led('P1-31');
        this._thermometer = new five.Thermometer({controller: 'TMP102'});
        this._thermometer.on('data', this._onTempData.bind(this));
        this._thermometer.disable();

        this._board.once('exit', () => {
          this._connectedLed.off();
          this._temperatureLed.off();
          this._dataLed.off();
          this._thermometer.disable();
        });
      })
      .then(() => this._blinkLed({led: this._connectedLed}))
      .then(() => this._connectedLed.off())
      .then(() => this._blinkLed({led: this._temperatureLed}))
      .then(() => this._temperatureLed.off())
      .then(() => this._blinkLed({led: this._dataLed}))
      .then(() => this._dataLed.off())
      .then(() => this._thermometer.enable());
    }

    _onTempData(event) {
      const temp = event.C;
      if (this._isTempChanged(temp)) {
        this._lastTemp = temp;
        this.emit('temp', this._lastTemp);
      }
    }

    _isTempChanged(temp) {
      if (null === this._lastTemp) {
          return true;
      }
      const diff = Math.abs(this._lastTemp - temp);
      if (diff > MAX_TEMP_THRESHOLD) {
        return true;
      }
      return false;
    }

    _blinkLed({led, numOfBlinks=3, ms}={}) {
      return new Promise((resolve) => {
        let count = 0;
        led.blink(ms, () => {
          count++;
          if (numOfBlinks < count) {
            led.stop();
            resolve();
          }
        });
      });
    }

    hasTemperature() {
       return null !== this._lastTemp;
    }

    getTemperature() {
       return this._lastTemp;
    }

    getConnectedLed() {
      return this._connectedLed;
    }

    getTemperatureLed() {
      return this._temperatureLed;
    }

    getDataLed() {
      return this._dataLed;
    }
  }

  module.exports = DeviceManager;
})();
