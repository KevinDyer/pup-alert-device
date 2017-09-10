(() => {
  'use strict';

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

        this._temperatureLed = new five.Led('P1-29');
        this._temperatureLed.on();

        this._dataLed = new five.Led('P1-31');
        this._dataLed.on();

        this._thermometer = new five.Thermometer({
          controller: 'TMP102',
          freq: 10 * 1000,
        });
        this._thermometer.on('data', this._onTempData.bind(this));
        this._thermometer.disable();
      })
      .then(() => this._blinkLed(this._connectedLed, 3))
      .then(() => this._connectedLed.off())
      .then(() => this._blinkLed(this._temperatureLed, 3))
      .then(() => this._temperatureLed.off())
      .then(() => this._blinkLed(this._dataLed, 3))
      .then(() => this._dataLed.off())
      .then(() => this._thermometer.enable());
    }

    _blinkLed(led, numOfBlinks) {
      return new Promise((resolve) => {
        let count = 0;
        led.blink(100, () => {
          count++;
          if (numOfBlinks < count) {
            led.stop();
            resolve();
          }
        });
      });
    }

    getConnectedLed() {
      return this._connectedLed;
    }

    getDataLed() {
      return this._dataLed;
    }
  }

  module.exports = DeviceManager;
})();
