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

  deviceManager.on('temp', (temp) => {
    const temperatureLed = deviceManager.getTemperatureLed();
    if (firebaseManager.isSignedIn()) {
      firebaseManager.setTemperature(temp);
      let count = 0;
      temperatureLed.strobe(100, () => {
        count++;
        if (3 < count) {
          temperatureLed.stop();
          temperatureLed.off();
        }
      });
    } else {
      const dataLed = deviceManager.getDataLed();
      let count = 0;
      temperatureLed.on();
      dataLed.strobe(300, () => {
        count++;
        if (6 < count) {
          dataLed.stop();
          dataLed.off();
          temperatureLed.off();
        }
      });
    }
  });

  const onSignedIn = debounce((isSignedIn) => {
    const connectedLed = deviceManager.getConnectedLed();
    if (isSignedIn) {
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
