const autoBind = require('auto-bind');

class UserHandler {
  constructor(userService, UserValidator) {
    this._service = userService;
    this._validator = UserValidator;
    autoBind(this);
  }

  async postHandler(request, h) {
    this._validator.validateUser(request.payload);
    const { username, password, fullname } = request.payload;
    const userId = await this._service.addUser({ username, password, fullname });

    return h.response({
      status: 'success',
      message: 'User berhasil ditambahkan!',
      data: {
        userId,
      },
    }).code(201);
  }
}

module.exports = UserHandler;
