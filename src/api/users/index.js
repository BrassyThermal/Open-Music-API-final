const UserHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { userService, UserValidator }) => {
    const userHandler = new UserHandler(userService, UserValidator);
    server.route(routes(userHandler));
  },
};
