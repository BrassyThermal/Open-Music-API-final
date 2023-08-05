const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/invariantError');
const NotFoundError = require('../../exceptions/notFoundError');

class PlaylistSongService {
  constructor(activity) {
    this._pool = new Pool();
    this._activity = activity;
  }

  async addSong(playlistId, songId, userId) {
    const id = `playlistSongs-${nanoid(16)}`;

    const cekSongId = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };

    const resultSongId = await this._pool.query(cekSongId);
    if (!resultSongId.rows.length) {
      throw new NotFoundError('Lagu anda tidak ditemukan!');
    }

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist!');
    }
    await this._activity.addActivity({
      playlistId, songId, userId, action: 'add',
    });
    return result.rows[0].id;
  }

  async deleteSong(songId, playlistId, userId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id =$2 RETURNING id',
      values: [songId, playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('ID lagu anda tidak ditemukan!');
    }
    await this._activity.addActivity({
      playlistId, songId, userId, action: 'delete',
    });
  }
}

module.exports = PlaylistSongService;
