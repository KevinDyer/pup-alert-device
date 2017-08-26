const packageInfo = require('./../package.json');
const commander = require('commander');
const logger = require('./logger');

const KEY_EMAIL = 'email';
const KEY_PASSWORD = 'password';

class ConfigManager {
  constructor() {
    this._store = new Map();
  }

  load() {
    commander
      .name(packageInfo.name)
      .version(packageInfo.version)
      .option('-e, --email <email>', 'The device email (provisioned by an admin).')
      .option('-p, --password <password>', 'The device password (provisioned by an admin).')
      .parse(process.argv);
    if (commander.email) {
      logger.debug('Email: %s', commander.email);
      this._store.set(KEY_EMAIL, commander.email);
    }
    if (commander.password) {
      logger.debug('Password: %s', commander.password);
      this._store.set(KEY_PASSWORD, commander.password);
    }
  }

  getEmail() {
    if (this._store.has(KEY_EMAIL)) {
      return this._store.get(KEY_EMAIL);
    }
    throw new Error('No email set');
  }

  getPassword() {
    if (this._store.has(KEY_PASSWORD)) {
      return this._store.get(KEY_PASSWORD);
    }
    throw new Error('No password set');
  }
}

module.exports = ConfigManager;