const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistService, playlistSongService, playlistActivity, PlaylistValidator) {
    this._playlist = playlistService;
    this._playlistSong = playlistSongService;
    this._playlistActivity = playlistActivity;
    this._validator = PlaylistValidator;
    autoBind(this);
  }

  async postPlaylist(request, h) {
    this._validator.validatePlaylist(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._playlist.addPlaylist(name, credentialId);
    return h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async getPlaylistHandler(request) {
    const playlists = await this._playlist.getPlaylists(request.auth.credentials);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlist.verifyPlaylistOwner(id, credentialId);
    await this._playlist.deletePlaylistById(id);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongsByIdHandler(request, h) {
    this._validator.validateManagePlaylist(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlist.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSong.addPlaylistSong(playlistId, songId, credentialId);
    return h.response({
      status: 'success',
      message: 'Playlist songs berhasil ditambahkan',
    }).code(201);
  }

  async getPlaylistSongsByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlist.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._playlist.getPlaylistById(id);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongsByIdHandler(request) {
    this._validator.validateManagePlaylist(request.payload);

    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    await this._playlist.verifyPlaylistAccess(id, credentialId);
    await this._playlistSong.deletePlaylistSong(songId, id, credentialId);
    return {
      status: 'success',
      message: 'Playlist songs berhasil dihapus',
    };
  }

  async getPlaylistActivitiesByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlist.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._playlistActivity.getActivityByPlaylistId(request.params);
    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistsHandler;
