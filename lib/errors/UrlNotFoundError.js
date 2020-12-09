const BaseError = require('./BaseError');

class UrlNotFoundError extends BaseError {
}

UrlNotFoundError.prototype.msg = 'Requested url is not found';
UrlNotFoundError.prototype.code = 404;
UrlNotFoundError.prototype.status = 404;

module.exports = UrlNotFoundError;
