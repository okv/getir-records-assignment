const expressUtils = require('../../utils/express');
const {BadRequestError} = require('../../errors');
const validationUtils = require('../utils/validation');

const validateBody = validationUtils.compile({
	type: 'object',
	properties: {
		startDate: {type: 'string', format: 'date'},
		endDate: {type: 'string', format: 'date'},
		minCount: {type: 'integer', minimum: 1},
		maxCount: {type: 'integer', minimum: 1}
	},
	additionalProperties: false,
	required: ['startDate', 'endDate', 'minCount', 'maxCount']
});

module.exports = expressUtils.createRouteHandler(async (req, res) => {
	const reqData = validateBody(req.body);

	const startDate = new Date(reqData.startDate);
	const endDate = new Date(reqData.endDate);
	if (startDate >= endDate) {
		throw new BadRequestError('"startDate" must be less than "endDate"');
	}
	const {minCount, maxCount} = reqData;
	if (minCount > maxCount) {
		throw new BadRequestError('"minCount" must be less or equal "maxCount"');
	}

	const pipeline = [{
		$match: {createdAt: {$gte: startDate, $lt: endDate}}
	}, {
		$addFields: {totalCount: {$sum: '$counts'}}
	}, {
		$match: {totalCount: {$gte: minCount, $lte: maxCount}}
	}, {
		$project: {
			_id: 0, key: 1, createdAt: 1, totalCount: 1
		}
	}, {
		// to have predictable records order in testing and production
		$sort: {createdAt: -1}
	}];

	const recordsCol = req.app.get('db').collection('records');
	const records = await recordsCol.aggregate(pipeline).toArray();

	res.json({code: 0, msg: 'Success', records});
});
