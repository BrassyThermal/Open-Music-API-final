const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { userService, UserValidator }) => {
    const usersHandler = new UsersHandler(userService, UserValidator);
    server.route(routes(usersHandler));
  },
};
