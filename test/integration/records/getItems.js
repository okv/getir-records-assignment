const assert = require('assert');
const fetch = require('node-fetch');
const expressUtils = require('../../../lib/utils/express');
const createApp = require('../../../lib/app');

describe('records getItems', () => {
	let app;
	let server;
	let oldMongodbUri;
	let recordsUrl;

	before(async () => {
		oldMongodbUri = process.env.MONGODB_URI;
		process.env.MONGODB_URI = (
			process.env.TEST_MONGODB_URI ||
			'mongodb://127.0.0.1/getir-case-study-testdb'
		);
		app = await createApp({loggerOptions: {level: 'fatal'}});
		server = app.listen();
		await expressUtils.waitForServer(server);
		const {port} = server.address();
		recordsUrl = `http://127.0.0.1:${port}/records`;
	});

	after(async () => {
		if (oldMongodbUri) process.env.MONGODB_URI = oldMongodbUri;
		if (server) await expressUtils.closeServer(server);
		const mongoClient = app?.get('mongoClient');
		if (mongoClient) await mongoClient.close();
	});

	describe('without request payload', () => {
		it('should return expected response', async () => {
			const response = await fetch(recordsUrl, {
				method: 'POST'
			});
			const result = await response.json();
			assert.strictEqual(
				response.status,
				400,
				'response should have status 400'
			);
			assert.deepStrictEqual(result, {
				code: 400,
				msg: 'Request is malformed'
			}, 'response content should be as expected');
		});
	});

	describe('with startDate == endDate', () => {
		it('should return expected response', async () => {
			const response = await fetch(recordsUrl, {
				method: 'POST',
				body: JSON.stringify({
					startDate: '2020-01-01',
					endDate: '2020-01-01',
					minCount: 30,
					maxCount: 70
				}),
				headers: {'content-type': 'application/json'}
			});
			const result = await response.json();
			assert.strictEqual(
				response.status,
				400,
				'response should have status 400'
			);
			assert.deepStrictEqual(result, {
				code: 400,
				msg: 'Request is malformed'
			}, 'response content should be as expected');
		});
	});

	describe('with non-existing startDate', () => {
		it('should return expected response', async () => {
			const response = await fetch(recordsUrl, {
				method: 'POST',
				body: JSON.stringify({
					startDate: '2020-02-30',
					endDate: '2020-03-01',
					minCount: 30,
					maxCount: 70
				}),
				headers: {'content-type': 'application/json'}
			});
			const result = await response.json();
			assert.strictEqual(
				response.status,
				400,
				'response should have status 400'
			);
			assert.deepStrictEqual(result, {
				code: 400,
				msg: 'Request is malformed'
			}, 'response content should be as expected');
		});
	});

	describe('with non-existing endDate', () => {
		it('should return expected response', async () => {
			const response = await fetch(recordsUrl, {
				method: 'POST',
				body: JSON.stringify({
					startDate: '2020-02-01',
					endDate: '2020-02-30',
					minCount: 30,
					maxCount: 70
				}),
				headers: {'content-type': 'application/json'}
			});
			const result = await response.json();
			assert.strictEqual(
				response.status,
				400,
				'response should have status 400'
			);
			assert.deepStrictEqual(result, {
				code: 400,
				msg: 'Request is malformed'
			}, 'response content should be as expected');
		});
	});

	describe('with minCount > maxCount', () => {
		it('should return expected response', async () => {
			const response = await fetch(recordsUrl, {
				method: 'POST',
				body: JSON.stringify({
					startDate: '2020-01-01',
					endDate: '2020-01-02',
					minCount: 71,
					maxCount: 70
				}),
				headers: {'content-type': 'application/json'}
			});
			const result = await response.json();
			assert.strictEqual(
				response.status,
				400,
				'response should have status 400'
			);
			assert.deepStrictEqual(result, {
				code: 400,
				msg: 'Request is malformed'
			}, 'response content should be as expected');
		});
	});

	describe('with valid date and count filters but no match', () => {
		before(async () => {
			const records = [{
				createdAt: new Date('2020-01-01T00:00:00'),
				counts: [10, 20],
				key: 'key1'
			}];
			const recordsCol = app.get('db').collection('records');
			await recordsCol.insertMany(records);
		});

		after(async () => {
			const recordsCol = app.get('db').collection('records');
			await recordsCol.deleteMany({});
		});

		it('should return expected response', async () => {
			const response = await fetch(recordsUrl, {
				method: 'POST',
				body: JSON.stringify({
					startDate: '2020-01-01',
					endDate: '2020-01-02',
					minCount: 70,
					maxCount: 70
				}),
				headers: {'content-type': 'application/json'}
			});
			const result = await response.json();
			assert.strictEqual(
				response.status,
				200,
				'response should have status 200'
			);
			assert.deepStrictEqual(result, {
				code: 0,
				msg: 'Success',
				records: []
			}, 'response content should be as expected');
		});
	});

	describe('with valid date and count filters and matched records', () => {
		before(async () => {
			const records = [{
				createdAt: new Date('2020-01-02T00:00:00.000Z'),
				counts: [10, 20],
				key: 'key4'
			}, {
				createdAt: new Date('2020-01-01T18:00:00.000Z'),
				counts: [50, 60],
				key: 'key3'
			}, {
				createdAt: new Date('2020-01-01T12:00:00.000Z'),
				counts: [30, 40],
				key: 'key2'
			}, {
				createdAt: new Date('2020-01-01T00:00:00.000Z'),
				counts: [10, 20],
				key: 'key1'
			}];
			const recordsCol = app.get('db').collection('records');
			await recordsCol.insertMany(records);
		});

		after(async () => {
			const recordsCol = app.get('db').collection('records');
			await recordsCol.deleteMany({});
		});

		it('should return expected response', async () => {
			const response = await fetch(recordsUrl, {
				method: 'POST',
				body: JSON.stringify({
					startDate: '2020-01-01',
					endDate: '2020-01-02',
					minCount: 30,
					maxCount: 70
				}),
				headers: {'content-type': 'application/json'}
			});
			const result = await response.json();
			assert.strictEqual(
				response.status,
				200,
				'response should have status 200'
			);
			assert.deepStrictEqual(result, {
				code: 0,
				msg: 'Success',
				records: [{
					createdAt: new Date('2020-01-01T12:00:00.000Z').toISOString(),
					totalCount: 70,
					key: 'key2'
				}, {
					createdAt: new Date('2020-01-01T00:00:00.000Z').toISOString(),
					totalCount: 30,
					key: 'key1'
				}]
			}, 'response content should be as expected');
		});
	});
});
