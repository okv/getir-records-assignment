const createValidator = require('./createValidator');

const validator = createValidator();

exports.createValidator = createValidator;
exports.validate = (schema, data) => validator.validate(schema, data);
