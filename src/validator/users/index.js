const InvariantError = require('../../exceptions/invariantError');
const UserSchema = require('./schema');

const UserValidator = {
  validateUser: (payload) => {
    const validationResult = UserSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UserValidator;
