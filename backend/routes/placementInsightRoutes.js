const express = require('express');
const router = express.Router();

// Placeholder: returns empty insights data
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Placement insights not implemented yet.' });
});

module.exports = router;
