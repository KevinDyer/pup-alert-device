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

  deviceManager.on('temp', (event) => {
    if (firebaseManager.isSignedIn()) {
      firebaseManager.setTemperature(event.C);
    } else {
      const dataLed = deviceManager.getDataLed();
      let count = 0;
      dataLed.strobe(300, () => {
        count++;
        if (6 < count) {
          dataLed.stop();
          dataLed.off();
        }
      });
    }
  });

  const onSignedIn = debounce((isSignedIn) => {
    const connectedLed = deviceManager.getConnectedLed();
    let count = 0;
    connectedLed.strobe(300, () => {
      count++;
      if (6 < count) {
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
