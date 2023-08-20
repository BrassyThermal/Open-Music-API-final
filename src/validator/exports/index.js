const { ExportSongsPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/invariantError');

const ExportValidator = {
  validateExportSongsPayload: (payload) => {
    const validatorResult = ExportSongsPayloadSchema.validate(payload);

    if (validatorResult.error) {
      throw new InvariantError(validatorResult.error.message);
    }
  },
};

module.exports = ExportValidator;
