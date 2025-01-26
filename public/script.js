const socket = io();

const roomSelect = document.getElementById('room-select');
const joinRoomButton = document.getElementById('join-room');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendMessageButton = document.getElementById('send-message');

let currentRoom = null;

// Join a room
joinRoomButton.addEventListener('click', () => {
    const room = roomSelect.value;

    // Check if room is selected
    if (!room) {
        alert("Please select a room to join.");
        return;
    }

    if (currentRoom) socket.emit('leaveRoom', currentRoom);
    currentRoom = room;
    socket.emit('joinRoom', room);
    
    // Clear the chat box and show room name
    chatBox.innerHTML = `<p>You joined the room: ${room}</p>`;
});

// Send message
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message && currentRoom) {
        socket.emit('chatMessage', { room: currentRoom, message });
        chatBox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
        messageInput.value = '';
    }
});

// Receive messages
socket.on('chatMessage', (message) => {
    chatBox.innerHTML += `<p>${message}</p>`;
});
