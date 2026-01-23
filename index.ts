import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import profileRoutes from './routes/profiles';
import preferenceRoutes from './routes/preferences';
import swipeRoutes from './routes/swipes';
import matchRoutes from './routes/matches';
import messageRoutes from './routes/messages';
import reportRoutes from './routes/reports';
import errorHandler from './utils/errorHandler';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from './types';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/swipes', swipeRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);

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
  apis: ['./routes/*.ts', './routes/*.js'] // files containing annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

// Socket.io middleware for auth
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET!) as { _id: string };
    socket.data.userId = decoded._id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.data.userId);

  // Join match room
  socket.on('joinMatch', (matchId) => {
    socket.join(matchId);
    console.log(`User ${socket.data.userId} joined match ${matchId}`);
  });

  // Handle sending message
  socket.on('sendMessage', async (data) => {
    try {
      const { matchId, content } = data;
      const Message = (await import('./models/Message')).default;
      const Match = (await import('./models/Match')).default;

      // Verify user is in match
      const match = await Match.findById(matchId);
      if (!match || !match.users.some((user: any) => user.equals(socket.data.userId))) {
        return socket.emit('error', 'Not authorized for this match');
      }

      // Save message
      const message = new Message({
        match: matchId,
        sender: socket.data.userId,
        content,
        delivered: true
      });
      await message.save();
      await message.populate('sender', 'name');

      // Emit to match room
      io.to(matchId).emit('newMessage', message);
    } catch (error) {
      socket.emit('error', (error as Error).message);
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { matchId, isTyping } = data;
    socket.to(matchId).emit('typing', { userId: socket.data.userId, isTyping });
  });

  // Handle read message
  socket.on('readMessage', async (data) => {
    try {
      const { messageId } = data;
      const Message = (await import('./models/Message')).default;

      const message = await Message.findById(messageId);
      if (message && message.sender !== socket.data.userId) {
        message.read = true;
        await message.save();
        io.to(message.match.toString()).emit('messageRead', { messageId });
      }
    } catch (error) {
      socket.emit('error', (error as Error).message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.data.userId);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available at http://localhost:' + PORT);
});