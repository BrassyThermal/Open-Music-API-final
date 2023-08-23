const InvariantError = require('../../exceptions/invariantError');
const CollabSchema = require('./schema');

const CollabValidator = {
  validateCollabs: (payload) => {
    const validationResult = CollabSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollabValidator;
