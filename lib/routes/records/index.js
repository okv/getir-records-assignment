const {Router} = require('express');

const router = Router();
router.post('/records', require('./post'));

module.exports = router;
