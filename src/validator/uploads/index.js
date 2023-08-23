const InvariantError = require('../../exceptions/invariantError');
const ImageHeaderSchema = require('./schema');

const UploadsValidator = {
  validateImage: (headers) => {
    const validationResult = ImageHeaderSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
