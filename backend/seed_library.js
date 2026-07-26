const { sequelize } = require('./config/db');
const { LibraryBook } = require('./models');

const seedLibrary = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');

    const books = [
      {
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        category: 'Computer Science',
        totalCopies: 5,
        availableCopies: 5,
        ebookUrl: 'https://example.com/algorithms.pdf'
      },
      {
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
        category: 'Software Engineering',
        totalCopies: 3,
        availableCopies: 3,
        ebookUrl: 'https://example.com/design-patterns.pdf'
      },
      {
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        category: 'Software Engineering',
        totalCopies: 4,
        availableCopies: 4,
        ebookUrl: '' // physical only
      },
      {
        title: 'Database System Concepts',
        author: 'Abraham Silberschatz',
        category: 'Database Systems',
        totalCopies: 2,
        availableCopies: 2,
        ebookUrl: 'https://example.com/db-concepts.pdf'
      },
      {
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell and Peter Norvig',
        category: 'Artificial Intelligence',
        totalCopies: 1,
        availableCopies: 1,
        ebookUrl: ''
      }
    ];

    await LibraryBook.bulkCreate(books);
    console.log('Successfully seeded 5 library books!');
  } catch (error) {
    console.error('Error seeding library books:', error);
  } finally {
    process.exit();
  }
};

seedLibrary();
