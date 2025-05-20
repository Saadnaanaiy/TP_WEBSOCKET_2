# Simple Socket.io Chat Application

This is a simple real-time chat application built with Socket.io and React.

## Setup Instructions

1. Install the required dependencies:
   ```
   npm install
   ```

2. Start the Socket.io server:
   ```
   node server.js
   ```

3. Start your Laravel application in a separate terminal:
   ```
   npm run dev
   ```

4. Open your browser and navigate to http://localhost:8000/chat to start chatting!

## How It Works

1. The application uses a direct Socket.io connection between the client and server
2. No Redis or other complex dependencies are required
3. Messages are sent directly to the Socket.io server and broadcast to all connected clients
4. The chat interface updates in real-time as messages are received

## Features

- Simple and lightweight chat application
- Real-time message delivery
- User-customizable display names
- Automatic scrolling to new messages
- Visual distinction between your messages and others' messages
- Typing indicators
- Online users list
- Join/leave notifications

## Troubleshooting

- If messages aren't being received, make sure the Socket.io server is running
- Check your browser console for any connection errors
- Ensure port 3001 is available for the Socket.io server
