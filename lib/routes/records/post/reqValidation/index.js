const validationUtils = require('../../../utils/validation');
const bodySchema = require('./body.json');

exports.validateBody = validationUtils.compile(bodySchema);
