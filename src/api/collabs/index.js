const CollabsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collabs',
  version: '1.0.0',
  register: async (server, {
    collabService, playlistService, userService, CollabValidator,
  }) => {
    const collabsHandler = new CollabsHandler(
      collabService,
      playlistService,
      userService,
      CollabValidator,
    );
    server.route(routes(collabsHandler));
  },
};
