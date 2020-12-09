const Ajv = require('ajv');

module.exports = ({ValidationError, ajvOptions} = {}) => {
	const validator = new Ajv({
		coerceTypes: true,
		useDefaults: true,
		...ajvOptions
	});

	const validate = (validation, data) => {
		const result = validation(data);

		if (!result) {
			const errorMessage = validator.errorsText(validation.errors);
			const ErrorConstructor = ValidationError || Error;
			throw new ErrorConstructor(errorMessage);
		}
	};

	return {
		validate: (schema, data) => {
			const validation = (data) => {
				const result = validator.validate(schema, data);
				if (!result) validation.errors = validator.errors;
				return result;
			};

			validate(validation, data);
			return data;
		},
		compile: (schema) => {
			const validation = validator.compile(schema);

			return (data) => {
				validate(validation, data);
				return data;
			};
		}
	};
};
