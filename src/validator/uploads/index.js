const InvariantError = require('../../exceptions/invariantError');
const { AlbumHeadersSchema } = require('./schema');

const UploadsValidator = {
  validateAlbumHeaders: (headers) => {
    const validatorResult = AlbumHeadersSchema.validate(headers);

    if (validatorResult.error) {
      throw new InvariantError(validatorResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
