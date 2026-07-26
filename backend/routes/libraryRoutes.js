const express = require('express');
const router = express.Router();
const { addBook, getBooks, checkoutBook, returnBook, getMyCheckouts, addReview } = require('../controllers/libraryController');
const { protect, authorize } = require('../middleware/authMiddleware');
router.get('/', getBooks);
router.use(protect);

// getBooks is now public; route defined above
router.post('/', authorize('admin', 'teacher'), addBook);

router.get('/my-checkouts', authorize('student'), getMyCheckouts);
router.post('/checkout/:bookId', authorize('student'), checkoutBook);
router.post('/return/:checkoutId', authorize('student', 'teacher', 'admin'), returnBook);
router.post('/:bookId/reviews', authorize('student'), addReview);

module.exports = router;
