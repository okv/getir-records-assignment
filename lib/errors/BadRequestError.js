const BaseError = require('./BaseError');

class BadRequestError extends BaseError {
}

BadRequestError.prototype.msg = 'Request is malformed';
BadRequestError.prototype.code = 400;
BadRequestError.prototype.status = 400;

module.exports = BadRequestError;
