class BaseError extends Error {
}

BaseError.prototype.msg = 'Something went wrong';
BaseError.prototype.code = 1;
BaseError.prototype.status = 500;

module.exports = BaseError;
