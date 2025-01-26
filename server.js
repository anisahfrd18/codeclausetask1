const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Store users' rooms
let usersInRoom = {};

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected: ', socket.id);

    // Join a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        if (!usersInRoom[room]) {
            usersInRoom[room] = [];
        }
        usersInRoom[room].push(socket.id);
        io.to(room).emit('chatMessage', `<strong>System:</strong> A new user has joined the room: ${room}`);
    });

    // Leave a room
    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        if (usersInRoom[room]) {
            usersInRoom[room] = usersInRoom[room].filter((id) => id !== socket.id);
        }
        io.to(room).emit('chatMessage', `<strong>System:</strong> A user has left the room: ${room}`);
    });

    // Receive and send chat messages
    socket.on('chatMessage', (data) => {
        io.to(data.room).emit('chatMessage', `<strong>You:</strong> ${data.message}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected: ', socket.id);
        for (const room in usersInRoom) {
            if (usersInRoom[room].includes(socket.id)) {
                usersInRoom[room] = usersInRoom[room].filter((id) => id !== socket.id);
                io.to(room).emit('chatMessage', '<strong>System:</strong> A user has disconnected.');
            }
        }
    });
});

// Start server on port 3000
server.listen(3002, () => {
    console.log('Server is running on http://localhost:3002');
});
