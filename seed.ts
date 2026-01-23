import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User';
import UserProfile from './models/UserProfile';
import UserPreferences from './models/UserPreferences';

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/devstinder';

const seedData = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await UserProfile.deleteMany({});
    await UserPreferences.deleteMany({});

    // Sample users
    const users = [
      { email: 'alice@example.com', password: 'password123', name: 'Alice Johnson' },
      { email: 'bob@example.com', password: 'password123', name: 'Bob Smith' },
      { email: 'charlie@example.com', password: 'password123', name: 'Charlie Brown' },
      { email: 'diana@example.com', password: 'password123', name: 'Diana Prince' },
      { email: 'eve@example.com', password: 'password123', name: 'Eve Wilson' }
    ];

    const hashedUsers = await Promise.all(users.map(async user => {
      user.password = await bcrypt.hash(user.password, 10);
      return user;
    }));

    const createdUsers = await User.insertMany(hashedUsers);

    // Sample profiles with approximate coordinates
    const profiles = [
      { user: createdUsers[0]._id, bio: 'Full-stack developer', skills: ['JavaScript', 'React', 'Node.js'], languages: ['English'], github: 'https://github.com/alice', location: 'New York', coordinates: [-74.0060, 40.7128], age: 25 },
      { user: createdUsers[1]._id, bio: 'Backend engineer', skills: ['Python', 'Django', 'PostgreSQL'], languages: ['English', 'Spanish'], github: 'https://github.com/bob', location: 'San Francisco', coordinates: [-122.4194, 37.7749], age: 30 },
      { user: createdUsers[2]._id, bio: 'Frontend specialist', skills: ['JavaScript', 'Vue.js', 'CSS'], languages: ['English'], github: 'https://github.com/charlie', location: 'Austin', coordinates: [-97.7431, 30.2672], age: 28 },
      { user: createdUsers[3]._id, bio: 'Data scientist', skills: ['Python', 'Machine Learning', 'SQL'], languages: ['English', 'French'], github: 'https://github.com/diana', location: 'Seattle', coordinates: [-122.3321, 47.6062], age: 26 },
      { user: createdUsers[4]._id, bio: 'DevOps engineer', skills: ['Docker', 'Kubernetes', 'AWS'], languages: ['English'], github: 'https://github.com/eve', location: 'Chicago', coordinates: [-87.6298, 41.8781], age: 32 }
    ];

    await UserProfile.insertMany(profiles);

    // Sample preferences
    const preferences = [
      { user: createdUsers[0]._id, preferredLanguages: ['JavaScript', 'Python'], preferredSkills: ['React'], maxDistance: 100, minAge: 20, maxAge: 35 },
      { user: createdUsers[1]._id, preferredLanguages: ['Python', 'JavaScript'], preferredSkills: ['Django'], maxDistance: 50, minAge: 25, maxAge: 40 },
      { user: createdUsers[2]._id, preferredLanguages: ['JavaScript'], preferredSkills: ['Vue.js'], maxDistance: 75, minAge: 22, maxAge: 30 },
      { user: createdUsers[3]._id, preferredLanguages: ['Python'], preferredSkills: ['Machine Learning'], maxDistance: 200, minAge: 24, maxAge: 38 },
      { user: createdUsers[4]._id, preferredLanguages: ['JavaScript', 'Python'], preferredSkills: ['Docker'], maxDistance: 150, minAge: 25, maxAge: 40 }
    ];

    await UserPreferences.insertMany(preferences);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', (error as Error).message);
    process.exit(1);
  }
};

seedData();