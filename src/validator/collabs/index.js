const InvariantError = require('../../exceptions/invariantError');
const collabSchema = require('./schema');

const CollabValidator = {
  validateCollabs: (payload) => {
    const validationResult = collabSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollabValidator;
