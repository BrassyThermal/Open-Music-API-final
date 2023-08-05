const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/notFoundError');

class PlaylistActivityService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity({
    playlistId, songId, userId, action,
  }) {
    const id = `Activity-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }

  async getActivity({ id }) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time 
             FROM playlist_song_activities
             LEFT JOIN users ON playlist_song_activities.user_id = users.id 
             LEFT JOIN songs ON playlist_song_activities.song_id = songs.id 
             WHERE playlist_song_activities.playlist_id = $1 ORDER BY playlist_song_activities.time ASC`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Aktifitas anda tidak ditemukan!');
    }
    return result.rows;
  }
}

module.exports = PlaylistActivityService;
