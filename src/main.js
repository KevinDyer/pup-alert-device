(() => {
  'use strict';

  const ConfigManager = require('./config-manager');
  const FirebaseManager = require('./firebase-manager');
  const DeviceManager = require('./device-manager');

  const configManager = new ConfigManager();
  const firebaseManager = new FirebaseManager(configManager);
  const deviceManager = new DeviceManager();

  deviceManager.on('temp', (event) => {
    if (firebaseManager.isSignedIn()) {
      firebaseManager.setTemperature(event.C);
    } else {
      const dataLed = device.getDataLed();
      let count = 0;
      dataLed.strobe(300, () => {
        if (5 < count) {
          dataLed.stop();
          dataLed.off();
        }
        count++;
      });
    }
  });

  Promise.resolve()
  .then(() => configManager.load())
  .then(() => firebaseManager.load())
  .then(() => deviceManager.load())
  .catch((err) => console.log(err.message));
})();
