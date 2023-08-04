require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumService = require('./services/postgres/albumService');
const AlbumValidator = require('./validator/albums');
const SongService = require('./services/postgres/songService');
const SongValidator = require('./validator/songs');
const ClientError = require('./exceptions/clientError');

const users = require('./api/users');
const UserService = require('./services/postgres/userService');
const UserValidator = require('./validator/users');

// authentications
const auths = require('./api/auths');
const AuthService = require('./services/postgres/authService');
const tokenManager = require('./tokenize/tokenManager');
const AuthValidator = require('./validator/auths');

// collaborations
const collabs = require('./api/collabs');
const CollabService = require('./services/postgres/CollabService');
const CollabValidator = require('./validator/collabs');

// playlists
const playlists = require('./api/playlists');
const PlaylistService = require('./services/postgres/playlistService');
const PlaylistValidator = require('./validator/playlists');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();
  const authService = new AuthService();
  const collabService = new CollabService();
  const playlistService = new PlaylistService(collabService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

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

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      console.log(response.stack);
      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server!',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
