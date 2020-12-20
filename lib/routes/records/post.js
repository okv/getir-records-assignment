const {DateTime} = require('luxon');
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
	const {minCount, maxCount, ...reqData} = validateBody(req.body);

	const startDate = DateTime.fromISO(reqData.startDate, {zone: 'GMT'});
	if (!startDate.isValid) {
		throw new BadRequestError('"startDate" must be a valid date');
	}
	const endDate = DateTime.fromISO(reqData.endDate, {zone: 'GMT'});
	if (!endDate.isValid) {
		throw new BadRequestError('"endDate" must be a valid date');
	}
	if (startDate.toMillis() >= endDate.toMillis()) {
		throw new BadRequestError('"startDate" must be less than "endDate"');
	}
	if (minCount > maxCount) {
		throw new BadRequestError('"minCount" must be less or equal "maxCount"');
	}

	const pipeline = [{
		$match: {createdAt: {$gte: startDate.toJSDate(), $lt: endDate.toJSDate()}}
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
