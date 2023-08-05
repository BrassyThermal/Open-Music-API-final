const AuthHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'auths',
  version: '1.0.0',
  register: async (server, {
    authService,
    userService,
    tokenManager,
    AuthValidator,
  }) => {
    const authHandler = new AuthHandler(
      authService,
      userService,
      tokenManager,
      AuthValidator,
    );
    server.route(routes(authHandler));
  },
};
