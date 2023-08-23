const autoBind = require('auto-bind');
const config = require('../../utils/config');

class UploadHandler {
  constructor(storageService, UploadValidator) {
    this._service = storageService;
    this._validator = UploadValidator;
    autoBind(this);
  }

  async uploadCover(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this._validator.validateImage(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const coverUrl = `http://${config.app.host}:${config.app.port}/uploads/images/${filename}`;
    await this._service.addCover(coverUrl, id);

    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
  }
}

module.exports = UploadHandler;
