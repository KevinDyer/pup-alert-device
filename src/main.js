const ConfigManager = require('./config-manager');
const FirebaseManager = require('./firebase-manager');
const TemperatureManager = require('./temperature-manager');

const configManager = new ConfigManager();
const firebaseManager = new FirebaseManager(configManager);
const temperatureManager = new TemperatureManager();

temperatureManager.on('temp', (event) => {
  if (firebaseManager.isSignedIn()) {
    firebaseManager.setTemperature(event.C);
  }
});

Promise.resolve()
.then(() => configManager.load())
.then(() => firebaseManager.load())
.then(() => temperatureManager.load())
.catch((err) => console.log(err.message));
