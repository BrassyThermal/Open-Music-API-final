const {
  postAuthSchema,
  PutAuthSchema,
  DeleteAuthSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/invariantError');

const AuthValidator = {
  validatePostAuth: (payload) => {
    const validationResult = postAuthSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAuth: (payload) => {
    const validationResult = PutAuthSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuth: (payload) => {
    const validationResult = DeleteAuthSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthValidator;
