const Joi = require('joi');

const SongSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().max(new Date().getFullYear()).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

module.exports = SongSchema;
