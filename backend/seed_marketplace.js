const { Sequelize } = require('sequelize');
const { Material, User, Subject } = require('./models');

const seedMaterials = async () => {
  try {
    // Find an admin or teacher to be the uploader
    const uploader = await User.findOne({ where: { role: 'teacher' } }) || 
                     await User.findOne({ where: { role: 'admin' } });

    if (!uploader) {
      console.log('No teacher or admin found to act as uploader.');
      return;
    }

    // Try to map to some subjects if they exist, else null
    const javaSubject = await Subject.findOne({ where: { name: 'Java Programming' } });
    const dsaSubject = await Subject.findOne({ where: { name: 'Data Structures' } });
    const anySubject = await Subject.findOne();
    if (!anySubject) return console.log("No subjects exist to attach material to");
    
    const newMaterials = [
      {
        title: 'Complete Core Java Handwritten Notes',
        contentUrl: 'https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/Java-Collections-Framework-PDF.pdf',
        price: 20,
        description: 'Comprehensive handwritten notes covering OOPs, Collections, and Multithreading.',
        subjectId: javaSubject ? javaSubject.id : anySubject.id,
        uploaderId: uploader.id,
        date: new Date()
      },
      {
        title: 'Data Structures & Algorithms Cheatsheet',
        contentUrl: 'https://www.cs.princeton.edu/~rs/AlgsDS07/01Fundamentals.pdf',
        price: 15,
        description: 'Quick revision notes for trees, graphs, DP, and sorting algorithms.',
        subjectId: dsaSubject ? dsaSubject.id : anySubject.id,
        uploaderId: uploader.id,
        date: new Date()
      },
      {
        title: 'Machine Learning Andrew Ng Summary',
        contentUrl: 'https://cs229.stanford.edu/notes2020-spring/cs229-notes1.pdf',
        price: 30,
        description: 'Detailed summary of the famous Stanford Machine Learning course.',
        subjectId: anySubject.id,
        uploaderId: uploader.id,
        date: new Date()
      },
      {
        title: 'Python for Data Science Master Guide',
        contentUrl: 'https://wesmckinney.com/book/',
        price: 25,
        description: 'Pandas, NumPy, and Matplotlib code snippets and explanations.',
        subjectId: anySubject.id,
        uploaderId: uploader.id,
        date: new Date()
      }
    ];

    await Material.bulkCreate(newMaterials);
    console.log('Successfully seeded premium marketplace materials!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedMaterials();
