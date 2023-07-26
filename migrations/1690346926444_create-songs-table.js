/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(225)',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(225)',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(225)',
      notNull: true,
    },
    duration: {
      type: 'INT',
      notNull: false,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: 'albums',
      onDelete: 'CASCADE',
    },
  });
};
exports.down = (pgm) => {
  pgm.dropTable('songs');
};
