require('dotenv').config()
const express = require('express')
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

app.listen(PORT , ()=> console.log(`Running on port ${PORT}`))

