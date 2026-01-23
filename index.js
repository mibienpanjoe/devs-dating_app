require('dotenv').config()
const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files
app.use('/uploads', express.static('uploads'))

// Database connection
const connectDB = require('./config/database')
connectDB()

// Routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const profileRoutes = require('./routes/profiles')
const preferenceRoutes = require('./routes/preferences')
const swipeRoutes = require('./routes/swipes')
const matchRoutes = require('./routes/matches')
const messageRoutes = require('./routes/messages')
const reportRoutes = require('./routes/reports')
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/profiles', profileRoutes)
app.use('/api/preferences', preferenceRoutes)
app.use('/api/swipes', swipeRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/reports', reportRoutes)

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Devs Tinder API',
      version: '1.0.0',
      description: 'API for developer dating app'
    },
    servers: [
      {
        url: 'http://localhost:4000/api'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'] // files containing annotations
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Error handling
const errorHandler = require('./utils/errorHandler')
app.use(errorHandler)

const PORT = process.env.PORT || 4000

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
})

// Socket.io middleware for auth
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    return next(new Error('Authentication error'))
  }
  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET)
    socket.userId = decoded._id
    next()
  } catch (err) {
    next(new Error('Authentication error'))
  }
})

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.userId)

  // Join match room
  socket.on('joinMatch', (matchId) => {
    socket.join(matchId)
    console.log(`User ${socket.userId} joined match ${matchId}`)
  })

  // Handle sending message
  socket.on('sendMessage', async (data) => {
    try {
      const { matchId, content } = data
      const Message = require('./models/Message')
      const Match = require('./models/Match')

      // Verify user is in match
      const match = await Match.findById(matchId)
      if (!match || !match.users.some(user => user.equals(socket.userId))) {
        return socket.emit('error', 'Not authorized for this match')
      }

      // Save message
      const message = new Message({
        match: matchId,
        sender: socket.userId,
        content,
        delivered: true
      })
      await message.save()
      await message.populate('sender', 'name')

      // Emit to match room
      io.to(matchId).emit('newMessage', message)
    } catch (error) {
      socket.emit('error', error.message)
    }
  })

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { matchId, isTyping } = data
    socket.to(matchId).emit('typing', { userId: socket.userId, isTyping })
  })

  // Handle read message
  socket.on('readMessage', async (data) => {
    try {
      const { messageId } = data
      const Message = require('./models/Message')

      const message = await Message.findById(messageId)
      if (message && message.sender !== socket.userId) {
        message.read = true
        await message.save()
        io.to(message.match.toString()).emit('messageRead', { messageId })
      }
    } catch (error) {
      socket.emit('error', error.message)
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId)
  })
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

