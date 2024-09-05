import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';

import { chatModel } from './Backend/message.model.js';
import connectDB from './Backend/monogdb.js';

const app = express();
app.use(cors());
app.use(express.static('public'));
// 1. Creating server using http.
const server = http.createServer(app);

// 2. Create socket server.
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
// Keep track of connected users.
const connectedUsers = new Set();
// 3. Use socket events.

io.on('connection', (socket) => {
    console.log("Connection is established");

    socket.on("join", (username) => {
        // socket.username = data;
        socket.username = username;
        connectedUsers.add(username);
            // Notify all clients about the new user.
            io.emit('update_user_list', Array.from(connectedUsers));


        socket.broadcast.emit('user_joined', username);

        // send old messages to the clients.
        chatModel.find().sort({ timestamp: 1 }).limit(50)
            .then(messages => {
                socket.emit('load_messages', messages);
            }).catch(err => {
                console.log(err);
            })
    });
     // Listen for typing event and broadcast it to all clients except the sender
     socket.on('typing', (username) => {
        socket.broadcast.emit('display_typing', username);
    });

    // Listen for stop typing event and broadcast it to all clients except the sender
    socket.on('stop_typing', () => {
        socket.broadcast.emit('stop_typing');
    });


    socket.on('new_message', (message) => {
        let userMessage = {
            username: socket.username,
            message: message
        }

        const newChat = new chatModel({
            username: socket.username,
            message: message,
            timestamp: new Date()
        });
        newChat.save();

        // broadcast this message to all the clients.
        socket.broadcast.emit('broadcast_message', userMessage);
        
         // Emit stop typing to clear the indicator after sending a message
         socket.emit('stop_typing'); 
    })

    socket.on('disconnect', () => {
        console.log("Connection is disconnected");
        connectedUsers.delete(socket.username);
        io.emit('update_user_list', Array.from(connectedUsers)); // Notify all clients about the disconnected user.
    })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT => {
    console.log(`App is listening on ${PORT}`);
    connectDB();
})
