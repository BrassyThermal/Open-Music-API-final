const AlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { albumService, albumLikeService, AlbumValidator }) => {
    const albumHandler = new AlbumHandler(albumService, albumLikeService, AlbumValidator);
    server.route(routes(albumHandler));
  },
};
