const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(albumService, albumLikeService, AlbumValidator) {
    this._service = albumService;
    this._like = albumLikeService;
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

  async postAlbumLike(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._like.verifyLike(albumId, credentialId);
    await this._like.addLike(albumId, credentialId);

    return this._Response(h, 201, {
      status: 'success',
      message: ' Anda menambahkan suka pada album ini!',
    });
  }

  async getAlbumLike(request, h) {
    const { id } = request.params;
    const { likes, dataSource } = await this._like.getLike(id);

    return this._Response(h, 200, {
      status: 'success',
      data: {
        likes: parseInt(likes, 10),
      },
    }).header('X-Data-Source', dataSource);
  }

  async deleteAlbumLike(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._like.deleteLike(albumId, credentialId);
    return this._Response(h, 200, {
      status: 'success',
      message: ' Anda menghapus suka pada album ini!',
    });
  }
}

module.exports = AlbumHandler;
