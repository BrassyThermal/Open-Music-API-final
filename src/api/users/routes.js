const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postHandler,
  },
];

module.exports = routes;
