require('dotenv').config();

const amqp = require('amqplib');
const Playlist = require('./playlist');
const MailSender = require('./mailSender');
const Listener = require('./listener');

const init = async () => {
  const playlist = new Playlist();
  const mailSender = new MailSender();
  const listener = new Listener(playlist, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();
  await channel.assertQueue('export:playlists', {
    durable: true,
  });
  channel.consume('export:playlists', listener.listen, { noAck: true });
};

init();
