const Joi = require('joi');

const collabSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = collabSchema;
