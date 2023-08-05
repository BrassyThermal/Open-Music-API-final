const autoBind = require('auto-bind');

class SongHandler {
  constructor(songService, SongValidator) {
    this._service = songService;
    this._validator = SongValidator;
    autoBind(this);
  }

  _validatePayload(payload) {
    this._validator.validateSong(payload);
  }

  _Response(h, statusCode, responseData) {
    return h.response(responseData).code(statusCode);
  }

  async postHandler(request, h) {
    this._validatePayload(request.payload);
    const songId = await this._service.addSong(request.payload);

    return this._Response(h, 201, {
      status: 'success',
      message: 'Lagu berhasil ditambahkan!',
      data: { songId },
    });
  }

  async getAllHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.getAllSongs(title, performer);

    return this._Response(h, 200, {
      status: 'success',
      data: { songs },
    });
  }

  async getByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return this._Response(h, 200, {
      status: 'success',
      data: { song },
    });
  }

  async putByIdHandler(request, h) {
    this._validatePayload(request.payload);
    const { id } = request.params;
    await this._service.updateSongById(id, request.payload);

    return this._Response(h, 200, {
      status: 'success',
      message: 'Lagu telah diperbarui!',
    });
  }

  async deleteByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return this._Response(h, 200, {
      status: 'success',
      message: 'Lagu telah dihapus!',
    });
  }
}

module.exports = SongHandler;
