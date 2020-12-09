// Async wrapper for route handler
exports.createRouteHandler = (handler) => {
	return async (req, res, next) => {
		try {
			await handler(req, res);
		} catch (err) {
			next(err);
		}
	};
};

// Wait for http/net `server` listening in a promise way
exports.waitForServer = (server) => {
	return new Promise((resolve, reject) => {
		server.once('listening', () => resolve());
		server.once('error', (err) => reject(err));
	});
};

// Close `server`, promise resolves when server is closed
exports.closeServer = (server) => {
	return new Promise((resolve) => {
		server.close(() => resolve());
	});
};
