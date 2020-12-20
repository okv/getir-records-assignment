const pino = require('pino');
const expressUtils = require('./utils/express');
const getConfig = require('./config');
const createApp = require('./app');

const logger = pino({name: 'server'});

process.on('uncaughtException', (err) => {
	logger.error('Uncaught exception occurred: %s', err?.stack || err);
});

process.on('unhandledRejection', (err) => {
	logger.error('Unhandled promise rejection occurred: %s', err?.stack || err);
});

const main = async () => {
	const {host, port, logLevel} = getConfig();
	logger.level = logLevel;
	const app = await createApp({loggerOptions: {level: logLevel}});

	logger.info('Starting server on %s:%s', host, port);

	const server = app.listen(port, host);
	await expressUtils.waitForServer(server);
};

main().catch((err) => {
	logger.error('Error occurred: %s', err?.stack || err);
});
