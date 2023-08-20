const redis = require('redis');
const config = require('../../utils/config');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      host: config.redis.host, // Menggunakan langsung "host" tanpa "socket"
    });
    this._client.on('error', (error) => console.error(error));
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, 'EX', expirationInSecond); // Menggunakan 'EX' sebagai argumen
  }

  async get(key) {
    const result = await this._client.get(key);
    if (result == null) throw new Error('Cache tidak ditemukan');
    return result;
  }

  delete(key) {
    this._client.del(key);
  }
}

module.exports = CacheService;
