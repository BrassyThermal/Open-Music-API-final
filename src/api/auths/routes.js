const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: handler.postHandler,
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: handler.putHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: handler.deleteHandler,
  },
];

module.exports = routes;
