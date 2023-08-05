const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
