const autoBind = require('auto-bind');

class Listener {
  constructor(playlistService, mailSender) {
    this._playlist = playlistService;
    this._mailSender = mailSender;

    autoBind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON
          .parse(message.content.toString());

      const playlist = await this._playlist.getPlaylist(playlistId);
      console.log('playlist:', playlist);
      const songs = await this._playlist.getSong(playlistId);
      console.log('songs:', songs);

      const playlistData = {
        playlist: {
          id: playlist.id,
          name: playlist.name,
          songs: songs.map((song) => ({
            id: song.id,
            title: song.title,
            performer: song.performer,
          })),
        },
      };

      const result = await this._mailSender
          .sendEmail(targetEmail, JSON.stringify(playlistData));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
