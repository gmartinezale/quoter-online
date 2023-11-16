const mongoose = require('mongoose');
const User = require('./models/user');

async function seedDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/your-db', { useNewUrlParser: true, useUnifiedTopology: true });

    const defaultUser = new User({
      // replace these values with the default user data
      name: 'Admin',
      email: 'admin@test.com',
      password: 'passwordAdmin',
    });

    await defaultUser.save();

    console.log('User created.');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error when created user:', error);
  }
}

seedDB();