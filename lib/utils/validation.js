const Ajv = require('ajv');

exports.createValidator = ({ValidationError, ajvOptions} = {}) => {
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
			const validation = (validationData) => {
				const result = validator.validate(schema, validationData);
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

const validator = exports.createValidator();

exports.validate = (schema, data) => validator.validate(schema, data);
