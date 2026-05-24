const crypto = require('crypto');

const hashResetToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const generateResetToken = () => crypto.randomBytes(32).toString('hex');

module.exports = { hashResetToken, generateResetToken };
