const Jwt = require('@hapi/jwt');
const tokenManager = require('./tokenize/tokenManager');

const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users');
const auths = require('./api/auths');
const collabs = require('./api/collabs');
const playlists = require('./api/playlists');

const AlbumService = require('./services/postgres/albumService');
const SongService = require('./services/postgres/songService');
const UserService = require('./services/postgres/userService');
const AuthService = require('./services/postgres/authService');
const CollabService = require('./services/postgres/CollabService');
const PlaylistService = require('./services/postgres/playlistService');
const PlaylistSongService = require('./services/postgres/playlistServiceSong');
const PlaylistActivity = require('./services/postgres/playlistServiceActivity');

const AlbumValidator = require('./validator/albums');
const SongValidator = require('./validator/songs');
const UserValidator = require('./validator/users');
const AuthValidator = require('./validator/auths');
const CollabValidator = require('./validator/collabs');
const PlaylistValidator = require('./validator/playlists');

exports.registerPlugins = async (server) => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();
  const authService = new AuthService();
  const collabService = new CollabService();
  const playlistActivity = new PlaylistActivity();
  const playlistService = new PlaylistService(collabService);
  const playlistSongService = new PlaylistSongService(playlistActivity);

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
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
  ]);
};
