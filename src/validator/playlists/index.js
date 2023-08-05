const InvariantError = require('../../exceptions/invariantError');
const { PlaylistSchema, ManagePlaylistSchema } = require('./schema');

const PlaylistValidator = {
  validatePlaylist: (payload) => {
    const validationResult = PlaylistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateManagePlaylist: (payload) => {
    const validationResult = ManagePlaylistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
