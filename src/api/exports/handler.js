const autoBind = require('auto-bind');

class ExportHandler {
  constructor(ProducerService, playlistService, ExportValidator) {
    this._service = ProducerService;
    this._playlistService = playlistService;
    this._validator = ExportValidator;

    autoBind(this);
  }

  async exportHandler(request, h) {
    this._validator.validateExport(request.payload);
    const userId = request.auth.credentials.id;
    const { id: playlistId } = request.params;
    const { targetEmail } = request.payload;

    await this._playlistService.verifyAccess(playlistId, userId);
    const playlist = await this._playlistService.getPlaylistSongs(playlistId);

    const message = {
      targetEmail,
      playlist,
    };

    await this._service.sendMessage('export:playlists', JSON.stringify(message));

    return h.response({
      status: 'success',
      message: 'Permintaan anda sedang dalam antrean!',
    }).code(201);
  }
}

module.exports = ExportHandler;
