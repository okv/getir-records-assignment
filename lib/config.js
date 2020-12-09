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
			HOST: {type: 'string', minLength: 7, default: '0.0.0.0'},
			JSON_BODY_LIMIT: {type: 'string', minLength: 1, default: '10kb'}
		},
		required: []
	};

	validationUtils.validate(schema, process.env);

	config = {
		port: process.env.PORT,
		host: process.env.HOST,
		jsonBodyLimit: process.env.JSON_BODY_LIMIT
	};

	return config;
};
