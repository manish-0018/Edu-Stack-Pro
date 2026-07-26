const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMarketplaceItems, createMarketplaceItem, purchaseItem } = require('../controllers/marketplaceController');

// List items (global or college-specific via query)
router.get('/', protect, getMarketplaceItems);

// Create new item (seller)
router.post('/', protect, createMarketplaceItem);

// Purchase (deduct virtual coins - placeholder)
router.post('/purchase/:id', protect, purchaseItem);

module.exports = router;
