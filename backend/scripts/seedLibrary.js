require('dotenv').config();
const { sequelize } = require('../config/db');
const { LibraryBook } = require('../models');

const seedBooks = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    const books = [
      {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        category: 'Computer Science',
        totalCopies: 5,
        availableCopies: 5,
        ebookUrl: 'https://example.com/intro-to-algorithms.pdf',
        coverUrl: 'https://example.com/cover1.jpg'
      },
      {
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell',
        category: 'Artificial Intelligence',
        totalCopies: 3,
        availableCopies: 3,
        ebookUrl: 'https://example.com/ai-modern-approach.pdf',
        coverUrl: 'https://example.com/cover2.jpg'
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        category: 'Software Engineering',
        totalCopies: 4,
        availableCopies: 4,
        ebookUrl: 'https://example.com/clean-code.pdf',
        coverUrl: 'https://example.com/cover3.jpg'
      }
    ];
    await LibraryBook.bulkCreate(books);
    console.log('Sample books inserted');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding books:', err);
    process.exit(1);
  }
};

seedBooks();
