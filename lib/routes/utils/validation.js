const {createValidator} = require('../../utils/validation');
const {BadRequestError} = require('../../errors');

module.exports = createValidator({
	ValidationError: BadRequestError
});
