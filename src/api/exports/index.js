const ExportHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { ProducerService, playlistService, ExportValidator }) => {
    const exportHandler = new ExportHandler(ProducerService, playlistService, ExportValidator);
    server.route(routes(exportHandler));
  },
};
