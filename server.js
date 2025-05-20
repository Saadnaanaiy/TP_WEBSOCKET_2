import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store connected users
const users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Handle user joining
  socket.on('user_join', (username) => {
    users[socket.id] = username;
    io.emit('user_joined', { id: socket.id, username: username });
    io.emit('user_list', users);
    console.log(`${username} joined the chat`);
  });

  // Handle chat messages
  socket.on('chat_message', (data) => {
    console.log(`Message from ${users[socket.id]}: ${data.message}`);
    io.emit('chat_message', {
      id: socket.id,
      username: users[socket.id],
      message: data.message,
      timestamp: new Date().toISOString()
    });
  });

 

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`${users[socket.id]} disconnected`);
    io.emit('user_left', { id: socket.id, username: users[socket.id] });
    delete users[socket.id];
    io.emit('user_list', users);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
