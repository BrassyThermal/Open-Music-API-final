const autoBind = require('auto-bind');

class AuthHandler {
  constructor(authService, userService, tokenManager, AuthValidator) {
    this._auth = authService;
    this._user = userService;
    this._tokenManager = tokenManager;
    this._validator = AuthValidator;
    autoBind(this);
  }

  async postHandler(request, h) {
    this._validator.validatePostAuth(request.payload);

    const { username, password } = request.payload;
    const id = await this._user.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._auth.addRefreshToken(refreshToken);

    return h.response({
      status: 'success',
      message: 'Autentikasi berhasil ditambahkan!',
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);
  }

  async putHandler(request) {
    this._validator.validatePutAuth(request.payload);
    const { refreshToken } = request.payload;
    await this._auth.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenManager.generateAccessToken({ id });

    return {
      status: 'success',
      message: 'Access token berhasil diperbarui!',
      data: {
        accessToken,
      },
    };
  }

  async deleteHandler(request) {
    this._validator.validateDeleteAuth(request.payload);
    const { refreshToken } = request.payload;
    await this._auth.verifyRefreshToken(refreshToken);
    await this._auth.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus!',
    };
  }
}

module.exports = AuthHandler;
