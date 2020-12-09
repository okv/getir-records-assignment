const http = require('http');
const pino = require('pino');
const expressUtils = require('./utils/express');
const getConfig = require('./config');
const createApp = require('./app');

const logger = pino({name: 'server'});

const main = async () => {
	const config = getConfig();
	logger.level = config.logLevel;
	const app = await createApp({loggerOptions: {level: config.logLevel}});

	process.on('uncaughtException', (err) => {
		logger.error('Uncaught exception occurred: %s', err?.stack || err);
	});

	process.on('unhandledRejection', (err) => {
		logger.error('Unhandled promise rejection occurred: %s', err?.stack || err);
	});

	const {host, port} = config;

	logger.info('Starting server on %s:%s', host, port);

	const server = http.createServer(app);
	server.listen(port, host);
	await expressUtils.waitForServer(server);
};

main().catch((err) => {
	logger.error('Error occurred: %s', err?.stack || err);
});
