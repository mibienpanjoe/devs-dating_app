require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const UserProfile = require('../models/UserProfile')
const UserPreferences = require('../models/UserPreferences')

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/devstinder'

const seedData = async () => {
  try {
    await mongoose.connect(mongoURI)
    console.log('Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await UserProfile.deleteMany({})
    await UserPreferences.deleteMany({})

    // Sample users
    const users = [
      { email: 'alice@example.com', password: 'password123', name: 'Alice Johnson' },
      { email: 'bob@example.com', password: 'password123', name: 'Bob Smith' },
      { email: 'charlie@example.com', password: 'password123', name: 'Charlie Brown' },
      { email: 'diana@example.com', password: 'password123', name: 'Diana Prince' },
      { email: 'eve@example.com', password: 'password123', name: 'Eve Wilson' }
    ]

    const hashedUsers = await Promise.all(users.map(async user => {
      user.password = await bcrypt.hash(user.password, 10)
      return user
    }))

    const createdUsers = await User.insertMany(hashedUsers)

    // Sample profiles
    const profiles = [
      { user: createdUsers[0]._id, bio: 'Full-stack developer', skills: ['JavaScript', 'React', 'Node.js'], languages: ['English'], github: 'https://github.com/alice', location: 'New York', age: 25 },
      { user: createdUsers[1]._id, bio: 'Backend engineer', skills: ['Python', 'Django', 'PostgreSQL'], languages: ['English', 'Spanish'], github: 'https://github.com/bob', location: 'San Francisco', age: 30 },
      { user: createdUsers[2]._id, bio: 'Frontend specialist', skills: ['JavaScript', 'Vue.js', 'CSS'], languages: ['English'], github: 'https://github.com/charlie', location: 'Austin', age: 28 },
      { user: createdUsers[3]._id, bio: 'Data scientist', skills: ['Python', 'Machine Learning', 'SQL'], languages: ['English', 'French'], github: 'https://github.com/diana', location: 'Seattle', age: 26 },
      { user: createdUsers[4]._id, bio: 'DevOps engineer', skills: ['Docker', 'Kubernetes', 'AWS'], languages: ['English'], github: 'https://github.com/eve', location: 'Chicago', age: 32 }
    ]

    await UserProfile.insertMany(profiles)

    // Sample preferences
    const preferences = [
      { user: createdUsers[0]._id, preferredLanguages: ['JavaScript', 'Python'], preferredSkills: ['React'], maxDistance: 100, minAge: 20, maxAge: 35 },
      { user: createdUsers[1]._id, preferredLanguages: ['Python', 'JavaScript'], preferredSkills: ['Django'], maxDistance: 50, minAge: 25, maxAge: 40 },
      { user: createdUsers[2]._id, preferredLanguages: ['JavaScript'], preferredSkills: ['Vue.js'], maxDistance: 75, minAge: 22, maxAge: 30 },
      { user: createdUsers[3]._id, preferredLanguages: ['Python'], preferredSkills: ['Machine Learning'], maxDistance: 200, minAge: 24, maxAge: 38 },
      { user: createdUsers[4]._id, preferredLanguages: ['JavaScript', 'Python'], preferredSkills: ['Docker'], maxDistance: 150, minAge: 25, maxAge: 40 }
    ]

    await UserPreferences.insertMany(preferences)

    console.log('Database seeded successfully')
    process.exit(0)
  } catch (error) {
    console.error('Seeding failed:', error)
    process.exit(1)
  }
}

seedData()