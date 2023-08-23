const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/invariantError');
const ClientError = require('../../exceptions/clientError');
const NotFoundError = require('../../exceptions/notFoundError');

class AlbumLikeService {
  constructor(albumService, cacheService) {
    this._pool = new Pool();
    this._albumService = albumService;
    this._cacheService = cacheService;
  }

  async verifyLike(albumId, userId) {
    await this._albumService.getAlbumById(albumId);
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new ClientError('Anda sudah menambahkan suka pada album ini!');
    }
  }

  async addLike(albumId, userId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };
    const result = this._pool.query(query);
    if (!(await result).rowCount) {
      throw new InvariantError('Gagal menambahkan suka pada album!');
    }
    await this._cacheService.delete(`album_likes:${albumId}`);
    return result.rows;
  }

  async getLike(albumId) {
    try {
      const result = await this._cacheService.get(`album_likes:${albumId}`);
      return {
        likes: JSON.parse(result),
        dataSource: 'cache',
      };
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      if (!result.rowCount) {
        throw new NotFoundError('Album tidak ditemukan!');
      }
      await this._cacheService.set(`album_likes:${albumId}`, JSON.stringify(result.rowCount));
      return { likes: result.rowCount, dataSource: 'database' };
    }
  }

  async deleteLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan!');
    }
    await this._cacheService.delete(`album_likes:${albumId}`);
  }
}

module.exports = AlbumLikeService;
