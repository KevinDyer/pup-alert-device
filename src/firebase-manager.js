(() => {
  'use strict';

  const firebase = require('firebase');
  const logger = require('./logger');
  const EventEmitter = require('events');

  // Initialize Firebase
  const config = {
    apiKey: 'AIzaSyDTB8FOhoqeHj-kvxfkTjSxOIuCBYA_uXU',
    authDomain: 'pup-alert-dev.firebaseapp.com',
    databaseURL: 'https://pup-alert-dev.firebaseio.com',
    projectId: 'pup-alert-dev',
  };
  firebase.initializeApp(config);

  class FirebaseManager extends EventEmitter {
    constructor(configManager) {
      super();
      this._configManager = configManager;
      this._auth = firebase.auth();
      this._user = null;
      this._auth.onAuthStateChanged((user) => {
        if (user) {
          logger.info('Device signed in.', {uid: user.uid});

          const deviceRef = firebase.database().ref(`devices/${user.uid}`);

          const isOnlineRef = deviceRef.child('isOnline');
          isOnlineRef.onDisconnect().set(false);
          isOnlineRef.set(true);

          const lastOnlineRef = deviceRef.child('lastOnline');
          lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);

          this._user = user;

          this.emit('signedIn', user);
        } else {
          logger.info('Device signed out.');

          this._user = null;

          this.emit('signedOut');
        }
      });
    }

    load() {
      logger.debug('Loading firebase manager');
      return Promise.resolve()
      .then(() => this._signIn());
    }

    _signIn() {
      const email = this._configManager.getEmail();
      const password = this._configManager.getPassword();
      return this._auth.signInWithEmailAndPassword(email, password);
    }

    isSignedIn() {
      return null !== this._user;
    }

    getUser() {
      return this._user;
    }

    setTemperature(temperature) {
      return Promise.resolve()
      .then(() => {
        if (!this.isSignedIn()) {
          return Promise.reject(new Error('device is not signed in'));
        }
        const database = firebase.database();
        const temperatureRef = database.ref(`devices/${this._user.uid}/temperature`);
        logger.debug(`Temperature update: ${temperature}.`);
        return temperatureRef.set(temperature);
      })
      .then(() => logger.debug('Temperature updated succeeded.'))
      .catch((err) => logger.error(`Temperature update failed: ${err.message}.`));
    }
  }

  module.exports = FirebaseManager;
})();

