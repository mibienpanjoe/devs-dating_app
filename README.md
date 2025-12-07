
# Backend Planning for Devs Tinder App

This is a Tinder-like app for developers to match based on skills, programming languages, projects, and interests. Backend built with **Node.js**, **Express.js**, and **MongoDB** (local instance). Focus on user authentication, profiles, swiping, and matching. Future expansions: messaging, real-time notifications (e.g., Socket.io).

## Project Structure

```javascript
devs-tinder/
├── index.js # Main entry point: Express app, DB connection, routes (existing)
├── package.json # Dependencies and scripts (existing)
├── .env # Environment variables (JWT_SECRET, MONGO_URI)
├── .gitignore # Ignore node_modules, .env, etc. (existing)
├── README.md # Project setup instructions
├── config/
│   └── database.js # MongoDB connection setup (create if config/d is partial)
├── models/
│   ├── User.js # Existing basic user/auth model
│   ├── UserProfile.js # Dev profile details
│   ├── UserPreferences.js # Matching preferences
│   ├── Swipe.js # Swipe actions
│   ├── Match.js # Mutual matches
│   ├── Message.js # Chat messages
│   └── Report.js # User reports
├── routes/
│   ├── auth.js
│   ├── users.js # Basic user ops
│   ├── profiles.js # UserProfile ops
│   ├── preferences.js # UserPreferences ops
│   ├── swipes.js
│   ├── matches.js
│   ├── messages.js
│   └── reports.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── profileController.js
│   ├── preferenceController.js
│   ├── swipeController.js
│   ├── matchController.js
│   ├── messageController.js
│   └── reportController.js
├── middleware/
│   ├── auth.js # JWT verification
│   └── validation.js # Input validation
├── utils/
│   └── errorHandler.js # Centralized error handling
└── tests/
    └── auth.test.js
```

## Dependencies

Add to `package.json` via `npm install`:

**Production:**

* `express`
* `mongoose`
* `bcryptjs`
* `jsonwebtoken`
* `dotenv`
* `cors`
* `helmet`
* `morgan`

**Development:**

* `nodemon`
* `express-validator`

**Scripts in package.json:**

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

**MongoDB Setup:**

Run local MongoDB (`mongod`). Database: `devstinder`. URI: `mongodb://localhost:27017/devstinder`

## Potential Enhancements

*   Geolocation (add coordinates to UserProfile, haversine distance filter).
*   Image upload (multer, Cloudinary/Mongo GridFS).
*   Real-time messaging/notifications (Socket.io).
*   Advanced matching (cosine similarity on skills/languages vectors).
*   Admin dashboard (list reports, manage users).
*   Push notifications (FCM).
*   Blocking users (add Block model).