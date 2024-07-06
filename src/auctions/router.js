const { Router } = require('express');

const { getAuctionsWithFilter, updateAuction } = require('./middleware');
const { adminAuth } = require('../auth/middleware');

const router = Router();

router.route('/auctions').get(adminAuth, getAuctionsWithFilter);
router.route('/auctions/:id').put(adminAuth, updateAuction);

module.exports = router;
