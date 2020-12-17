const { Tanker, errors } = require('@tanker/client-node');
const saveToDisk = require('file-saver');

module.exports = class FileKit {
  constructor(config) {
    this.tanker = new Tanker(config);
  }

  async startDisposableSession(privateIdentity) {
    const { identity } = privateIdentity;
    const status = await this.tanker.start(identity);

    switch (status) {
      case Tanker.statuses.IDENTITY_REGISTRATION_NEEDED: {
        const genVerificationKey = await this.tanker.generateVerificationKey()
        await this.tanker.registerIdentity({ verificationKey: genVerificationKey })
        return;
      }
      case Tanker.statuses.IDENTITY_VERIFICATION_NEEDED: {
        throw new errors.InvalidArgument('This identity has already been used, create a new one.');
      }
      // When hitting back or forward on the browser you can start a disposable
      // session with the same identity twice because the browser is caching
      // the xhr request to fake-auth (or another identity server)
      case Tanker.statuses.READY: {
        return;
      }
      default:
        throw new errors.InternalError(`Assertion error: unexpected status ${status}`);
    }
  }


  async upload(...args) {
    return this.tanker.upload(...args);
  }


  async download(...args) {
    return this.tanker.download(...args);
  }

  async downloadToDisk(...args) {
    const file = await this.download(...args);
    saveToDisk(file);
  }
}
