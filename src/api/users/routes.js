const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUser,
  },
];

module.exports = routes;
