
# Devs Tinder Backend API

A Tinder-like backend API for developers to match based on skills, programming languages, projects, and interests. Built with **Node.js**, **Express.js**, **MongoDB**, **Socket.io**, and **Redis** for real-time features and caching. Features user authentication, detailed profiles, intelligent matching algorithms, geolocation filtering with caching, real-time messaging, and performance optimization.

## Features

- **User Authentication**: JWT-based signup, login, logout with password hashing.
- **User Profiles**: Detailed developer profiles with skills, languages, bio, GitHub, photos, age, and location.
- **Intelligent Matching**: Advanced algorithm using compatibility scores (skills, languages, age, distance).
- **Geolocation Filtering**: Location-based matching with distance preferences and geocoding caching.
- **Swiping System**: Like/pass swipes with automatic match creation on mutual likes.
- **Real-Time Messaging**: Socket.io-powered live chat with typing indicators, read receipts, and online status.
- **Image Upload**: Profile image upload with multer (local storage, extensible to cloud).
- **Preferences Management**: Customizable matching preferences (skills, languages, age, distance).
- **Reporting System**: User reports for moderation.
- **Performance Caching**: Redis-powered caching for geocoding, potential matches, and compatibility scores.
- **API Documentation**: Full Swagger/OpenAPI documentation.
- **Seed Data**: Script to populate database with sample users and data.
- **Containerization**: Docker support for easy development and deployment.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis for performance optimization
- **Real-Time**: Socket.io
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Express-validator
- **File Upload**: Multer
- **Geocoding**: Nominatim API with caching
- **Security**: Helmet, CORS, bcrypt
- **Documentation**: Swagger UI
- **Containerization**: Docker & Docker Compose

## Project Structure

```
devs-tinder/
├── index.js                 # Main entry point: Express app, Socket.io, routes
├── seed.js                  # Database seeding script
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables
├── .gitignore               # Git ignore rules
├── README.md                # Project documentation
├── uploads/                 # Uploaded profile images
├── config/
│   └── database.js          # MongoDB connection setup
├── models/
│   ├── User.js              # User authentication model
│   ├── UserProfile.js       # Developer profile details
│   ├── UserPreferences.js   # Matching preferences
│   ├── Swipe.js             # Swipe actions
│   ├── Match.js             # Mutual matches
│   ├── Message.js           # Chat messages
│   └── Report.js            # User reports
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management routes
│   ├── profiles.js          # Profile CRUD routes
│   ├── preferences.js       # Preferences CRUD routes
│   ├── swipes.js            # Swiping routes
│   ├── matches.js           # Match retrieval routes
│   ├── messages.js          # Messaging routes
│   └── reports.js           # Reporting routes
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── userController.js    # User operations
│   ├── profileController.js # Profile management
│   ├── preferenceController.js # Preferences management
│   ├── swipeController.js   # Swiping logic
│   ├── matchController.js   # Match handling
│   ├── messageController.js # Messaging logic
│   └── reportController.js  # Reporting logic
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── validation.js        # Input validation
├── utils/
│   ├── cache.js             # Redis caching utilities
│   ├── errorHandler.js      # Error handling
│   ├── geocode.js           # Geolocation utilities
│   └── matching.js          # Matching algorithms
└── tests/
    └── auth.test.js         # Auth tests
```

## Dependencies

All dependencies are listed in `package.json`. Key packages:

**Production:**

* `express` - Web framework
* `mongoose` - MongoDB ODM
* `ioredis` - Redis client for caching
* `bcrypt` - Password hashing
* `jsonwebtoken` - JWT authentication
* `socket.io` - Real-time messaging
* `multer` - File uploads
* `node-fetch` - HTTP requests for geocoding
* `swagger-ui-express`, `swagger-jsdoc` - API documentation
* `cors`, `helmet`, `morgan` - Security and logging

**Development:**

* `nodemon` - Auto-restart server
* `express-validator` - Input validation

## Scripts

```json
{
  "start": "node index.js",
  "dev": "nodemon index.js",
  "seed": "node seed.js"
}
```

## Quick Start

### Option 1: Local Development (without Docker)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mibienpanjoe/devs-tinder-API.git
   cd devs-tinder-API
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   JWT_SECRET=your_super_secret_jwt_key_here
   MONGO_URI=mongodb://localhost:27017/devstinder
   PORT=4000
   ```

4. **Start MongoDB:**
   Ensure MongoDB is running locally:
   ```bash
   mongod
   ```

5. **Seed the database:**
   ```bash
   npm run seed
   ```

6. **Start the server:**
   ```bash
   npm run dev
   ```

### Option 2: Docker Development (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mibienpanjoe/devs-tinder-API.git
   cd devs-tinder-API
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   JWT_SECRET=your_super_secret_jwt_key_here
   MONGO_URI=mongodb://mongodb:27017/devstinder
   REDIS_URL=redis://redis:6379
   PORT=4000
   ```

3. **Start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```
   This starts the app, MongoDB, and Redis containers.

4. **Seed the database (in another terminal):**
   ```bash
   docker-compose exec app npm run seed
   ```

### Access the API (both options)
- Server: http://localhost:4000
- API Docs: http://localhost:4000/api-docs
- MongoDB: localhost:27017 (Docker) or local (native)
- Sample login: `alice@example.com` / `password123`

## Environment Variables

- `JWT_SECRET`: Secret key for JWT token signing (required)
- `MONGO_URI`: MongoDB connection string (default: `mongodb://localhost:27017/devstinder`)
- `REDIS_URL`: Redis connection string (default: `redis://localhost:6379`)
- `PORT`: Server port (default: 4000)

## Caching Strategy

The application uses Redis for performance optimization:

- **Geocoding Cache**: Address-to-coordinates mappings cached for 24 hours
- **Potential Matches Cache**: User-specific potential matches with compatibility scores cached for 10 minutes
- **Compatibility Scores**: Pair-wise compatibility scores cached for 1 hour
- **Cache Invalidation**: Automatic cleanup on profile updates and swipes

This significantly reduces database load and improves response times.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `DELETE /api/users/profile` - Deactivate user
- `GET /api/users/full-profile` - Get full profile with details
- `POST /api/users/upload-profile-image` - Upload profile image

### Profiles
- `POST /api/profiles` - Create/update profile
- `GET /api/profiles` - Get profile
- `PATCH /api/profiles` - Update profile
- `DELETE /api/profiles` - Delete profile
- `GET /api/profiles/compatibility/:userId` - Get compatibility score

### Preferences
- `POST /api/preferences` - Create/update preferences
- `GET /api/preferences` - Get preferences
- `PATCH /api/preferences` - Update preferences
- `DELETE /api/preferences` - Delete preferences

### Swipes
- `POST /api/swipes` - Swipe on user
- `GET /api/swipes/potential` - Get potential matches

### Matches
- `GET /api/matches` - Get user's matches
- `GET /api/matches/:id` - Get specific match

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:matchId` - Get messages for match

### Reports
- `POST /api/reports` - Report user
- `GET /api/reports` - Get reports (admin)
- `PATCH /api/reports/:id` - Update report status (admin)

## Real-Time Events (Socket.io)

Connect to `ws://localhost:4000` with JWT token in handshake auth.

- `joinMatch` (matchId): Join match room
- `sendMessage` (matchId, content): Send message
- `typing` (matchId, isTyping): Typing indicator
- `readMessage` (messageId): Mark message as read

Events received:
- `newMessage`: New message in match
- `typing`: Typing status update
- `messageRead`: Message read confirmation

## Future Enhancements

* Push notifications (FCM for mobile alerts)
* Profile verification (email/photo verification)
* Admin dashboard (user management, analytics)
* Cloud image storage (AWS S3/Cloudinary)
* User blocking system
* Advanced analytics and reporting
* Rate limiting for API protection
* Multi-server Socket.io scaling with Redis adapter

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
