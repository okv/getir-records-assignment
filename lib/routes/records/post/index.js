const asyncUtils = require('../../../utils/async');
const {validateBody} = require('./reqValidation');

module.exports = asyncUtils.createRouteHandler(async (req, res) => {
	const reqData = validateBody(req.body);

	const result = {data: reqData};

	res.json(result);
});
