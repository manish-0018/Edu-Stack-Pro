const { LibraryBook, BookCheckout, User, BookReview } = require('../models');

// Add a new book (Admin/Teacher)
const addBook = async (req, res) => {
  try {
    const book = await LibraryBook.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all books
const getBooks = async (req, res) => {
  try {
    const books = await LibraryBook.findAll({
      include: [
        {
          model: BookReview,
          required: false,
          include: [{ model: User, as: 'Student', attributes: ['name'] }]
        }
      ]
    });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Checkout a book (Student)
const checkoutBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await LibraryBook.findByPk(bookId);
    
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies <= 0) return res.status(400).json({ message: 'No copies available currently' });

    // Calculate due date (e.g. 14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const checkout = await BookCheckout.create({
      bookId,
      studentId: req.user.id,
      dueDate
    });

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json(checkout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Return a book
const returnBook = async (req, res) => {
  try {
    const { checkoutId } = req.params;
    const checkout = await BookCheckout.findByPk(checkoutId, { include: ['Book'] });
    
    if (!checkout) return res.status(404).json({ message: 'Checkout record not found' });
    if (checkout.status === 'returned') return res.status(400).json({ message: 'Book already returned' });

    checkout.status = 'returned';
    checkout.returnDate = new Date();
    await checkout.save();

    const book = checkout.Book;
    book.availableCopies += 1;
    await book.save();

    res.status(200).json(checkout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's checkouts
const getMyCheckouts = async (req, res) => {
  try {
    const checkouts = await BookCheckout.findAll({
      where: { studentId: req.user.id },
      include: [{ model: LibraryBook, as: 'Book' }]
    });
    res.status(200).json(checkouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a review for a book (Student)
const addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;

    const book = await LibraryBook.findByPk(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const review = await BookReview.create({
      bookId,
      studentId: req.user.id,
      rating: parseInt(rating),
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addBook, getBooks, checkoutBook, returnBook, getMyCheckouts, addReview };
