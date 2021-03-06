const { KDF_PBKDF2, KDF_PBKDF2_ITERATIONS_DEFAULT } = require('./lib/crypto');
const utils = require('./lib/api_utils');
const { User } = require('./lib/models');

module.exports.handler = async (event, context, callback) => {
  console.log('Prelogin handler triggered', JSON.stringify(event, null, 2));

  if (!event.body) {
    callback(null, utils.validationError('Request body is missing'));
    return;
  }

  const body = utils.normalizeBody(JSON.parse(event.body));

  const [user] = (await User.scan()
    .where('email').equals(body.email.toLowerCase())
    .execAsync())
    .Items;

  if (!user) {
    callback(null, utils.validationError('Unknown username'));
    return;
  }

  callback(null, utils.okResponse({
    Kdf: KDF_PBKDF2,
    KdfIterations: user.get('kdfIterations') || KDF_PBKDF2_ITERATIONS_DEFAULT,
  }));
};
