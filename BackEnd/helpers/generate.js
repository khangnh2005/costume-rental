const crypto = require('crypto');

module.exports.generateRandomString = (length = 30) => {
  return crypto.randomBytes(length).toString('hex');
};
