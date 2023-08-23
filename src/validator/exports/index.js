const ExportSchema = require('./schema');
const InvariantError = require('../../exceptions/invariantError');

const ExportValidator = {
  validateExport: (payload) => {
    const validatorResult = ExportSchema.validate(payload);

    if (validatorResult.error) {
      throw new InvariantError(validatorResult.error.message);
    }
  },
};

module.exports = ExportValidator;
