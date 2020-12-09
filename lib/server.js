const http = require('http');
const pino = require('pino');
const pEvent = require('p-event');
const getConfig = require('./config');
const createApp = require('./app');

const loggerOptions = {
	customLevels: {log: 25}
};

const logger = pino({...loggerOptions, name: 'server'});

const main = async () => {
	const config = getConfig();
	const app = await createApp({logger, loggerOptions});

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

	await pEvent(server, 'listening');
};

main().catch((err) => {
	logger.error('Error occurred: %s', err?.stack || err);
});
