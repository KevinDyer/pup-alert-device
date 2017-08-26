// const Raspi = require('raspi-io');
// const five = require('johnny-five');

// const board = new five.Board({
//   io: new Raspi(),
//   repl: false
// });

// board.on('ready', () => {
//   const led = new five.Led('P1-7');
//   const thermometer = new five.Thermometer({controller: 'TMP102'});

//   led.off();

//   let timeout = null;
//   thermometer.on('change', () => {
//     led.on();
//     clearTimeout(timeout);
//     timeout = setTimeout(() => led.off(), 1000);
//     if (null !== temperatureRef) {
//       temperatureRef.set(temperature.celsius)
//       .catch((err) => logger.warn(err.message));
//     }
//   });

//   board.on('exit', () => {
//     led.off();
//   });
// });

const ConfigManager = require('./config-manager');
const DeviceManager = require('./device-manager');
const FirebaseManager = require('./firebase-manager');

const configManager = new ConfigManager();
const firebaseManager = new FirebaseManager(configManager);
const deviceManager = new DeviceManager(configManager);

Promise.resolve()
.then(() => configManager.load())
.then(() => firebaseManager.load())
.then(() => deviceManager.load())
.catch((err) => console.log(err.message));
