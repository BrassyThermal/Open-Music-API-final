const autoBind = require('auto-bind');

class PlaylistHandler {
  constructor(playlistService, playlistSongService, playlistActivity, PlaylistValidator) {
    this._playlist = playlistService;
    this._playlistSong = playlistSongService;
    this._playlistActivity = playlistActivity;
    this._validator = PlaylistValidator;
    autoBind(this);
  }

  async postHandler(request, h) {
    this._validator.validatePlaylist(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._playlist.addPlaylist(name, credentialId);

    return h.response({
      status: 'success',
      message: 'Playlist Anda berhasil ditambahkan!',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async getHandler(request) {
    const playlists = await this._playlist.getPlaylist(request.auth.credentials);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deleteByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlist.verifyOwner(id, credentialId);
    await this._playlist.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist Anda berhasil dihapus!',
    };
  }

  async postSongByIdHandler(request, h) {
    this._validator.validateManagePlaylist(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlist.verifyAccess(playlistId, credentialId);
    await this._playlistSong.addSong(playlistId, songId, credentialId);

    return h.response({
      status: 'success',
      message: 'Playlist musik berhasil ditambahkan!',
    }).code(201);
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const playlist = await this._playlist.getPlaylistById(id);
    await this._playlist.verifyAccess(id, credentialId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongByIdHandler(request) {
    this._validator.validateManagePlaylist(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    await this._playlist.verifyAccess(id, credentialId);
    await this._playlistSong.deleteSong(songId, id, credentialId);

    return {
      status: 'success',
      message: 'Playlist musik berhasil dihapus!',
    };
  }

  async getActivityByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const activities = await this._playlistActivity.getActivity(request.params);
    await this._playlist.verifyAccess(playlistId, credentialId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistHandler;
