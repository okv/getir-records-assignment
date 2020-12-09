const {UrlNotFoundError} = require('../errors');

module.exports = () => {
	return ((req, res, next) => {
		next(new UrlNotFoundError(`Url ${req.method} ${req.url} is not found.`));
	});
};
