const Joi = require('joi');

const AlbumSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().max(new Date().getFullYear()).required(),
});

module.exports = AlbumSchema;
