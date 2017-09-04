const ConfigManager = require('./config-manager');
const FirebaseManager = require('./firebase-manager');
const DeviceManager = require('./device-manager');

const configManager = new ConfigManager();
const firebaseManager = new FirebaseManager(configManager);
const deviceManager = new DeviceManager(configManager);

Promise.resolve()
.then(() => configManager.load())
.then(() => firebaseManager.load())
.then(() => deviceManager.load())
.catch((err) => console.log(err.message));
