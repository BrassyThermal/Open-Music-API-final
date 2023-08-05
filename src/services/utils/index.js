const mapAlbum = ({ id, name, year }) => ({ id, name, year });

const mapSongAlbumId = ({ id, title, performer }) => ({ id, title, performer });

const mapSong = ({
  id, title, year, genre, performer, duration, albumId,
}) => ({
  id, title, year, genre, performer, duration, albumId,
});

module.exports = { mapAlbum, mapSongAlbumId, mapSong };
