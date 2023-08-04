const InvariantError = require('../../exceptions/invariantError');
const albumSchema = require('./schema');

const AlbumValidator = {
  validateAlbum: (payload) => {
    const validationResult = albumSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
