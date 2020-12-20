# getir records assignment

This repository contains the source code of the service that provides HTTP API
for the records resource. See the sections below for more details.


## Requirements

* Node.js >= 14
* MongoDb >= 4.2


## Usage

Make sure that [requirements](#requirements) are satisfied.

### Basic dev setup

* `npm ci` - to install dependencies.
* `TEST_MONGODB_URI="mongodb://127.0.0.1/getir-case-study-testdb" npm test` - to
run tests.

Start service in the development mode with any [app options](#service-configuration)
e.g.:

```
MONGODB_URI="mongodb://127.0.0.1/getir-case-study" npm run dev
```

### Basic production setup

* `npm ci --only=prod` - to install dependencies.

Start service in the production mode with any [app options](#service-configuration)
e.g.:

```
NODE_ENV="production" MONGODB_URI="mongodb://127.0.0.1/getir-case-study" npm start
```

### Request samples

Request records using curl:

```
curl -H 'content-type: application/json' -X POST http://127.0.0.1:3030/records -d '{"startDate": "2015-01-01", "endDate": "2015-01-03", "minCount": 1, "maxCount": 164}'
```


## Service configuration

The service could be configured using environment variables:

* **PORT**: number -- port to listen, the default value is 3030.
* **HOST**: string -- host to listen, the default value is "127.0.0.1".
* **MONGODB_URI**: string -- mongodb connection string (should contain db name),
the default value is "mongodb://127.0.0.1/getir-case-study".
* **LOG_LEVEL**: string -- log level, the default value is "info".
* **JSON_BODY_LIMIT**: string -- body parser limit for json, the default value
is "10kb".


## Service API

This is an HTTP API that uses JSON format. Thus, if an endpoint consumes JSON
payload (see endpoints below) then `content-type: application/json`
request header should be provided.

### POST /records

Returns records according to the request body parameters.

Body parameters (JSON), **all parameters are required**:

* **startDate** - date in a "YYYY-MM-DD" format, picks records with
`createdAt >= startDate`.
* **endDate** - date in a "YYYY-MM-DD" format, picks records with
`createdAt < endDate`.
* **minCount** - picks records with `totalCount >= minCount`.
* **maxCount** - picks records with `totalCount <= maxCount`.

Sample:

```json
{
	"startDate": "2015-01-01",
	"endDate": "2015-01-03",
	"minCount": 1,
	"maxCount": 164
}
```

Response payload (JSON):

* **code** - status code of the response. Possible codes and related response
http statuses:
  * 0 - Success, http status: 200.
  * 400 - Request is malformed, http status: 400.
  * 404 - Requested url is not found, http status: 404.
  * 500 - Internal server error, http status: 500.
* **msg** - message for the status code, "Success" for successful requests, will
contain explanatory message otherwise.
* **records** - filtered items according to the request.

Sample:

```json
{
	"code": 0,
	"msg": "Success",
	"records": [
	{
		"key": "yPfeOYkP",
		"createdAt": "2015-01-02T21:02:42.536Z",
		"totalCount": 164
	},
	{
		"key": "bQkcWXyU",
		"createdAt": "2015-01-02T14:24:03.408Z",
		"totalCount": 85
	}
	]
}
```
