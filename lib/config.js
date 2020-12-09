const validationUtils = require('./utils/validation');

let config;

module.exports = () => {
	if (config) {
		return config;
	}

	const schema = {
		type: 'object',
		properties: {
			PORT: {type: 'number', minLength: 1, default: 3030},
			HOST: {type: 'string', minLength: 7, default: '127.0.0.1'},
			JSON_BODY_LIMIT: {type: 'string', minLength: 1, default: '10kb'},
			MONGODB_URI: {
				type: 'string',
				minLength: 5,
				default: 'mongodb://127.0.0.1/getir-case-study'
			},
			LOG_LEVEL: {
				type: 'string',
				enum: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
				default: 'info'
			}
		}
	};

	validationUtils.validate(schema, process.env);

	config = {
		port: process.env.PORT,
		host: process.env.HOST,
		jsonBodyLimit: process.env.JSON_BODY_LIMIT,
		mongodbUri: process.env.MONGODB_URI,
		logLevel: process.env.LOG_LEVEL
	};

	return config;
};
