(() => {
  'use strict';

  const EventEmitter = require('events');
  const five = require('johnny-five');
  const Raspi = require('raspi-io');

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
    }

    _onTempData(event) {
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
      .then(() => {
        this._connectedLed = new five.Led('P1-7');
        this._connectedLed.on();

        this._dataLed = new five.Led('P1-31');
        this._dataLed.on();

        this._temperatureLed = new five.Led('P1-29');
        this._temperatureLed.on();

        this._thermometer = new five.Thermometer({
          controller: 'TMP102',
          freq: 10 * 1000,
        });
        this._thermometer.on('data', this._onTempData.bind(this));
        this._thermometer.disable();
      })
      .then(() => {
        return new Promise((resolve) => {
          let count = 0;
          this._connectedLed.blink(300, () => {
            count++;
            if (5 < count) {
              this._connectedLed.stop();
              this._connectedLed.off();
              resolve();
            }
          });
        });
      })
      .then(() => {
        return new Promise((resolve) => {
          let count = 0;
          this._temperatureLed.blink(300, () => {
            count++;
            if (5 < count) {
              this._temperatureLed.stop();
              this._temperatureLed.off();
              resolve();
            }
          });
        });
      })
      .then(() => this._thermometer.enable())
      .then(() => {
        return new Promise((resolve) => {
          let count = 0;
          this._dataLed.blink(300, () => {
            count++;
            if (5 < count) {
              this._dataLed.stop();
              this._dataLed.off();
              resolve();
            }
          });
        });
      });
    }

    getDataLed() {
      return this._dataLed;
    }
  }

  module.exports = DeviceManager;
})();
