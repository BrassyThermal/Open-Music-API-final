const autoBind = require('auto-bind');

class CollabsHandler {
  constructor(collabService, playlistService, userService, CollabValidator) {
    this._collaborationsService = collabService;
    this._playlistsService = playlistService;
    this._usersService = userService;
    this._validator = CollabValidator;
    autoBind(this);
  }

  async postCollabs(request, h) {
    this._validator.validateCollabs(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._usersService.getUserById(userId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);
    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    }).code(201);
  }

  async deleteCollabs(request) {
    this._validator.validateCollabs(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);
    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollabsHandler;
