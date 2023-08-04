const autoBind = require('auto-bind');

class UsersHandler {
  constructor(userService, UserValidator) {
    this._service = userService;
    this._validator = UserValidator;
    autoBind(this);
  }

  async postUser(request, h) {
    this._validator.validateUser(request.payload);

    const { username, password, fullname } = request.payload;
    const userId = await this._service.addUser({ username, password, fullname });

    return h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    }).code(201);
  }
}

module.exports = UsersHandler;
