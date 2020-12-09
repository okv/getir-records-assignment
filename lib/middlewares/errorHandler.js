module.exports = ({logger}) => {
	// eslint-disable-next-line no-unused-vars
	return ((err, req, res, next) => {
		const log = req.log || logger;
		log.error('Error occurred: %s', err?.stack || err);

		if (!res.headersSent) {
			res.status(err.status || 500);

			res.json({
				code: err.code || 500,
				msg: err.msg || 'Internal server error occurred'
			});
		}
	});
};
