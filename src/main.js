(() => {
  'use strict';

  const ConfigManager = require('./config-manager');
  const FirebaseManager = require('./firebase-manager');
  const DeviceManager = require('./device-manager');

  const configManager = new ConfigManager();
  const firebaseManager = new FirebaseManager(configManager);
  const deviceManager = new DeviceManager();

  function debounce(fn, delay) {
    let timeout = null;
    return function(...data) {
      clearTimeout(timeout);
      setTimeout(() => {
        fn(...data);
      }, delay);
    };
  }

  const onTemp = debounce((temp) => {
    if (firebaseManager.isSignedIn()) {
      firebaseManager.setTemperature(temp);
      let count = 0;
      const temperatureLed = deviceManager.getTemperatureLed();
      temperatureLed.off();
      temperatureLed.strobe(100, () => {
        count++;
        if (5 < count) {
          temperatureLed.stop();
          temperatureLed.off();
        }
      });
    } else {
      const dataLed = deviceManager.getDataLed();
      let count = 0;
      dataLed.off();
      dataLed.strobe(100, () => {
        count++;
        if (5 < count) {
          dataLed.stop();
          dataLed.off();
        }
      });
    }
  }, 1000);

  deviceManager.on('temp', onTemp);

  const onSignedIn = debounce((isSignedIn) => {
    const connectedLed = deviceManager.getConnectedLed();
    if (isSignedIn) {
      if (deviceManager.hasTemperature()) {
        const lastTemp = deviceManager.getTemperature();
        onTemp(lastTemp);
      }
      connectedLed.off();
    } else {
      connectedLed.on();
    }
    let count = 0;
    connectedLed.strobe(100, () => {
      count++;
      if (4 < count) {
        connectedLed.stop();
        if (isSignedIn) {
          connectedLed.on();
        } else {
          connectedLed.off();
        }
      }
    });
  }, 1000);

  firebaseManager.on('signedIn', onSignedIn);

  Promise.resolve()
  .then(() => configManager.load())
  .then(() => deviceManager.load())
  .then(() => firebaseManager.load())
  .catch((err) => console.log(err.message));
})();
