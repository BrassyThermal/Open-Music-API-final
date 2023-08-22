const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const config = require('./config');
const tokenManager = require('../tokenize/tokenManager');

const albums = require('../api/albums');
const songs = require('../api/songs');
const users = require('../api/users');
const auths = require('../api/auths');
const collabs = require('../api/collabs');
const playlists = require('../api/playlists');

const AlbumService = require('../services/postgres/albumService');
const SongService = require('../services/postgres/songService');
const UserService = require('../services/postgres/userService');
const AuthService = require('../services/postgres/authService');
const CollabService = require('../services/postgres/CollabService');
const PlaylistService = require('../services/postgres/playlistService');
const PlaylistSongService = require('../services/postgres/playlistServiceSong');
const PlaylistActivity = require('../services/postgres/playlistServiceActivity');

const AlbumValidator = require('../validator/albums');
const SongValidator = require('../validator/songs');
const UserValidator = require('../validator/users');
const AuthValidator = require('../validator/auths');
const CollabValidator = require('../validator/collabs');
const PlaylistValidator = require('../validator/playlists');

// Exports
const _exports = require('../api/exports');
const ProducerService = require('../services/rabbitmq/producerService');
const ExportsValidator = require('../validator/exports');

// Uploads
const uploads = require('../api/uploads');
const StorageService = require('../services/storage/storageService');
const UploadsValidator = require('../validator/uploads');

// Album Likes
const albumLikes = require('../api/likes');
const AlbumLikesService = require('../services/postgres/likeService');
const CacheService = require('../services/redis/cacheService');

exports.registerPlugins = async (server) => {
  const cacheService = new CacheService();
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();
  const authService = new AuthService();
  const collabService = new CollabService();
  const playlistActivity = new PlaylistActivity(cacheService);
  const playlistService = new PlaylistService(collabService);
  const playlistSongService = new PlaylistSongService(playlistActivity);
  const albumLikesService = new AlbumLikesService(albumService, cacheService);
  const storageService = new StorageService(path.resolve(__dirname, '../api/uploads/file/images'));

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: config.Jwt.access,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.Jwt.tokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        albumService,
        AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        songService,
        SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        userService,
        UserValidator,
      },
    },
    {
      plugin: auths,
      options: {
        authService,
        userService,
        tokenManager,
        AuthValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistService,
        playlistSongService,
        playlistActivity,
        PlaylistValidator,
      },
    },
    {
      plugin: collabs,
      options: {
        collabService,
        playlistService,
        userService,
        CollabValidator,
      },
    },
    {
      plugin: albumLikes,
      options: {
        albumsService: albumService,
        service: albumLikesService,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        playlistsService: playlistService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        storageService,
        validator: UploadsValidator,
      },
    },
  ]);
};
