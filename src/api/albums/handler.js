const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(albumService, AlbumValidator) {
    this._service = albumService;
    this._validator = AlbumValidator;
    autoBind(this);
  }

  _validatePayload(payload) {
    this._validator.validateAlbum(payload);
  }

  _Response(h, statusCode, responseData) {
    return h.response(responseData).code(statusCode);
  }

  async postHandler(request, h) {
    this._validatePayload(request.payload);

    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    return this._Response(h, 201, {
      status: 'success',
      message: 'Album berhasil ditambahkan!',
      data: { albumId },
    });
  }

  async getByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const songs = await this._service.getSongByAlbumId(id);

    return this._Response(h, 200, {
      status: 'success',
      data: { album: { ...album, songs } },
    });
  }

  async putByIdHandler(request, h) {
    this._validatePayload(request.payload);

    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);

    return this._Response(h, 200, {
      status: 'success',
      message: 'Album telah diperbarui!',
    });
  }

  async deleteByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return this._Response(h, 200, {
      status: 'success',
      message: 'Album telah dihapus!',
    });
  }
}

module.exports = AlbumsHandler;
