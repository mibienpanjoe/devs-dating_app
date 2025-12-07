# Backend Planning for Devs Tinder App

## Overview
This is a Tinder-like app for developers to match based on skills, programming languages, projects, and interests. Backend built with **Node.js**, **Express.js**, and **MongoDB** (local instance). Focus on user authentication, profiles, swiping, and matching. Future expansions: messaging, real-time notifications (e.g., Socket.io).

Key Features:
- User registration/login with JWT authentication.
- Developer profiles (skills, languages, GitHub, bio, photos) via UserProfile model.
- Matching preferences via UserPreferences model.
- Swiping on potential matches (like/pass).
- Mutual matches.
- Messaging between matches.
- User reporting system.

## Suggested File Structure
```
devs-tinder/
├── index.js                  # Main entry point: Express app, DB connection, routes (existing)
├── package.json              # Dependencies and scripts (existing)
├── .env                      # Environment variables (JWT_SECRET, MONGO_URI)
├── .gitignore                # Ignore node_modules, .env, etc. (existing)
├── README.md                 # Project setup instructions
├── config/                   # Existing
│   └── database.js           # MongoDB connection setup (create if config/d is partial)
├── models/                   # Existing Mongoose schemas
│   ├── User.js               # Existing basic user/auth model
│   ├── UserProfile.js        # Dev profile details
│   ├── UserPreferences.js    # Matching preferences
│   ├── Swipe.js              # Swipe actions
│   ├── Match.js              # Mutual matches
│   ├── Message.js            # Chat messages
│   └── Report.js             # User reports
├── routes/                   # Existing
│   ├── auth.js
│   ├── users.js              # Basic user ops
│   ├── profiles.js           # UserProfile ops
│   ├── preferences.js        # UserPreferences ops
│   ├── swipes.js
│   ├── matches.js
│   ├── messages.js
│   └── reports.js
├── controllers/              # Existing
│   ├── authController.js
│   ├── userController.js
│   ├── profileController.js
│   ├── preferenceController.js
│   ├── swipeController.js
│   ├── matchController.js
│   ├── messageController.js
│   └── reportController.js
├── middleware/               # Create
│   ├── auth.js               # JWT verification
│   └── validation.js         # Input validation
├── utils/                    # Existing
│   └── errorHandler.js       # Centralized error handling
└── tests/                    # Optional
    └── auth.test.js
```

## Dependencies
Add to `package.json` via `npm install`:

**Production:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT for auth
- `dotenv` - Env variables
- `cors` - Cross-origin requests
- `helmet` - Security headers
- `morgan` - Logging

**Development:**
- `nodemon` - Auto-restart server
- `express-validator` - Input validation

**Scripts in package.json:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

**MongoDB Setup:** Run local MongoDB (`mongod`). Database: `devstinder`. URI: `mongodb://localhost:27017/devstinder`

## Models (Mongoose Schemas)

### 1. User Model (`models/User.js`) - Existing (suggest fixes)
Current content has typos and mixed CJS/ESM. Update to:
```javascript
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        maxlength: 30  // Fixed: maxLemgth -> maxlength
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: 2,
        maxLength: 20,
        trim: true
    },
    role: {
        enum: ['admin', 'user'],
        default: 'user'
    },
    profileImage: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,  // Added missing type
        default: true
    },
    profile: {  // Added
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserProfile'
    },
    preferences: {  // Added
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserPreferences'
    }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);  // Fixed: module.exports instead of export const
```

### 2. UserProfile Model (`models/UserProfile.js`)
Dev-specific profile details (one-to-one with User).
```javascript
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, maxlength: 500 },
  skills: [{ type: String }],  // e.g., ['React', 'Node.js']
  languages: [{ type: String }],  // e.g., ['JavaScript', 'Python']
  github: { type: String },
  photos: [{ type: String }],  // Image URLs
  location: { type: String, default: '' },
  age: { type: Number, min: 18 }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);
```

### 3. UserPreferences Model (`models/UserPreferences.js`)
Matching filters (one-to-one with User).
```javascript
const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  preferredLanguages: [{ type: String }],
  preferredSkills: [{ type: String }],
  maxDistance: { type: Number, default: 50 },  // km
  minAge: { type: Number, min: 18 },
  maxAge: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
```

### 4. Swipe Model (`models/Swipe.js`)
Tracks swipes to avoid duplicates and enable matching.
```javascript
const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema({
  swiper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  swiped: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['like', 'pass'], required: true }
}, { timestamps: true });

swipeSchema.index({ swiper: 1, swiped: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', swipeSchema);
```

### 5. Match Model (`models/Match.js`)
Created on mutual likes.
```javascript
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Exactly 2
  matchedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
```

### 6. Message Model (`models/Message.js`)
Messages within matches.
```javascript
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 1000 }
}, { timestamps: true });

messageSchema.index({ match: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
```

### 7. Report Model (`models/Report.js`)
User reports for moderation.
```javascript
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reported: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true, maxlength: 500 },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' }
}, { timestamps: true });

reportSchema.index({ reporter: 1, reported: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);
```

## API Endpoints & Implementation Details

### 1. Setup (`index.js`)
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./config/database');

// Connect DB
connectDB();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/preferences', require('./routes/preferences'));
app.use('/api/swipes', require('./routes/swipes'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/reports', require('./routes/reports'));

// Error handler
app.use(require('./utils/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### 2. Authentication (`routes/auth.js`, `controllers/authController.js`)
- **POST /api/auth/register**: Hash password (`bcryptjs`), create User, optionally init UserProfile/UserPreferences.
- **POST /api/auth/login**: Compare password (`bcryptjs.compare`), sign JWT (`jsonwebtoken`).

**Middleware** (`middleware/auth.js`): Extract/verify JWT from `Authorization: Bearer <token>`, attach `req.user`.

### 3. Users (`routes/users.js`, `controllers/userController.js`)
Basic user management (protected):
- **GET /api/users/me**: Get own basic info (name, email, role, profileImage, isVerified, isActive).
- **PUT /api/users/me**: Update basic info (name, profileImage).

### 4. Profiles (`routes/profiles.js`, `controllers/profileController.js`) (protected)
- **GET /api/profiles**: Get own UserProfile (populate user).
- **PUT /api/profiles**: Update own UserProfile (skills, bio, etc.).
- **GET /api/profiles/:id**: Get public profile of potential match (no private fields).

### 5. Preferences (`routes/preferences.js`, `controllers/preferenceController.js`) (protected)
- **GET /api/preferences**: Get own UserPreferences.
- **PUT /api/preferences**: Update own preferences (preferredLanguages, etc.).

### 6. Swipes (`routes/swipes.js`, `controllers/swipeController.js`) (protected)
- **GET /api/swipes/potential**: Get potential matches (10 random, filter by preferences using aggregation: match languages/skills overlap, exclude swiped/self/blocked, `$sample: {size: 10}`).
- **POST /api/swipes**: `{ userId: swipedId, action: 'like'|'pass' }`. Create Swipe. If mutual 'like', create Match.

### 7. Matches (`routes/matches.js`, `controllers/matchController.js`) (protected)
- **GET /api/matches**: List user's matches (populate profiles, latest messages).

### 8. Messages (`routes/messages.js`, `controllers/messageController.js`) (protected)
- **GET /api/messages/:matchId**: Get messages for match (populate sender/profileImage).
- **POST /api/messages/:matchId**: Send message `{ content }` (check user in match.users).

### 9. Reports (`routes/reports.js`, `controllers/reportController.js`) (protected)
- **POST /api/reports**: Report user `{ reportedId, reason }`. Create Report (admin-only to review).

### Implementation Steps
1. **Fix User.js**: Apply suggested fixes (typos, exports, add profile/preferences refs).
2. **Install deps**: `npm i express mongoose bcryptjs jsonwebtoken dotenv cors helmet morgan express-validator`, `npm i -D nodemon`.
3. **Create .env**: `MONGO_URI=mongodb://localhost:27017/devstinder`, `JWT_SECRET=your_super_secret_key`, `PORT=5000`.
4. **DB Config**: Create `config/database.js` with `mongoose.connect(MONGO_URI)`.
5. **Populate models**: Implement all schemas in respective files (UserProfile.js etc.).
6. **Middleware**: Create `middleware/auth.js` (JWT verify), `middleware/validation.js`.
7. **Controllers & Routes**: Implement auth first (register/login), then users, profiles, preferences.
8. **Swipes & Matches**: Potential query using aggregation (filter by preferences overlap: `$expr: { $gt: [{ $size: { $setIntersection: ['$languages', req.user.preferences.preferredLanguages] } }, 0] }`), swipe logic, mutual check.
9. **Messages & Reports**: Basic CRUD with auth checks.
10. **index.js**: Setup app, connect DB, mount routes, error handler.
11. **Utils**: `utils/errorHandler.js` for async errors, 404.
12. **Security**: Add `express-rate-limit`, helmet config, input validation.
13. **Test**: `npm run dev`, Postman for endpoints, MongoDB Compass for data.
14. **Optimizations**: Indexes (e.g., Swipe: {swiper:1, swiped:1}), populate sparingly, paginate lists.

### Potential Enhancements
- Geolocation (add coordinates to UserProfile, haversine distance filter).
- Image upload (multer, Cloudinary/Mongo GridFS).
- Real-time messaging/notifications (Socket.io).
- Advanced matching (cosine similarity on skills/languages vectors).
- Admin dashboard (list reports, manage users).
- Push notifications (FCM).
- Blocking users (add Block model).

This structure is scalable, follows MVC pattern, and separates concerns.