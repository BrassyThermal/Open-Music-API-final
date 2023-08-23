const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteByIdHandler,
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postAlbumLike,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getAlbumLike,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: handler.deleteAlbumLike,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
