const Jwt = require('@hapi/jwt');
const config = require('../utils/config');
const InvariantError = require('../exceptions/invariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, config.Jwt.access),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, config.Jwt.refresh),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, config.Jwt.refresh);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token yang anda input tidak valid!');
    }
  },
};



module.exports = TokenManager;
