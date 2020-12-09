const express = require('express');
const expressPinoLogger = require('express-pino-logger');
const bodyParser = require('body-parser');
const pino = require('pino');
const {MongoClient} = require('mongodb');
const getConfig = require('./config');
const recordsRouter = require('./routes/records');
const errorHandlerMiddleware = require('./middlewares/errorHandler');
const notFoundMiddleware = require('./middlewares/notFound');

module.exports = async ({loggerOptions}) => {
	const logger = pino({...loggerOptions, name: 'app'});
	const config = getConfig();

	const app = express();
	const mongoClient = new MongoClient(config.mongodbUri, {
		useUnifiedTopology: true
	});
	await mongoClient.connect();

	app.set('logger', logger);
	app.set('config', config);
	app.set('mongoClient', mongoClient);
	app.set('db', mongoClient.db());

	app.use(expressPinoLogger(loggerOptions));

	app.use(bodyParser.json({
		limit: config.jsonBodyLimit
	}));

	app.use(recordsRouter);

	app.use(notFoundMiddleware());
	app.use(errorHandlerMiddleware({logger}));

	return app;
};
