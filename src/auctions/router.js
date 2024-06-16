const { Router } = require('express');

const { getAuctionsWithFilter } = require('./middleware');
const { adminAuth } = require('../auth/middleware');

const router = Router();

router.route('/auctions').get(adminAuth, getAuctionsWithFilter);

module.exports = router;
