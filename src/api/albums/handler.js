const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  _validatePayload(payload) {
    this._validator.validateAlbumPayload(payload);
  }

  _createResponse(h, statusCode, responseData) {
    const response = h.response(responseData);
    return response.code(statusCode);
  }

  async postHandler(request, h) {
    this._validatePayload(request.payload);

    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    return this._createResponse(h, 201, {
      status: 'success',
      message: 'Album berhasil ditambahkan!',
      data: { albumId },
    });
  }

  async getByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const songs = await this._service.getSongByAlbumId(id);

    return this._createResponse(h, 200, {
      status: 'success',
      data: { album: { ...album, songs } },
    });
  }

  async putByIdHandler(request, h) {
    this._validatePayload(request.payload);

    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);

    return this._createResponse(h, 200, {
      status: 'success',
      message: 'Album telah diperbarui!',
    });
  }

  async deleteByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return this._createResponse(h, 200, {
      status: 'success',
      message: 'Album telah dihapus!',
    });
  }
}

module.exports = AlbumsHandler;
