// socket code in js.

const socket = io.connect('http://localhost:3000');
const username = prompt('Enter your name');
// Emit the username to the server
socket.emit("join", username);

// Get the elements
const messageInput = document.getElementById("messageInput"); // Correct ID
const messageList = document.querySelector(".chat-messages"); // Select the correct message list container
const sendButton = document.getElementById("sendButton"); // Correct ID
const welcomeMessage = document.querySelector(".welcome-message");
const typingIndicator = document.querySelector(".typing-indicator");
const connectedUsersList = document.querySelector(".connected-users ul"); // User list container

// Display the welcome message
welcomeMessage.textContent = `Welcome ${username}`;


// sendButton.addEventListener('click', function () {
//     // Read the message from input and send to server.
//     const message = messageInput.value;
//     if (message) {
//         socket.emit('new_message', message); // Emitting the message to the server

//         // Add message to the list 
//         const messageElement = document.createElement("div");
//         messageElement.classList.add("message");
//         messageElement.innerText = username + ": " + message;
//         messageList.appendChild(messageElement);

//         // Reset the value of textbox to empty
//         messageInput.value = '';
//     }
// });

sendButton.addEventListener('click', function () {
    // Read the message from input and send to server.
    const message = messageInput.value;
    if (message) {
        // Emitting the message to the server
        socket.emit('new_message', message); 

        // Create the main message container
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        
        //  // Set the background color for the sent message
        //  messageElement.style.backgroundColor = '#34d670'; 
         

        // Create the profile picture div
        const profilePicElement = document.createElement("div");
        profilePicElement.classList.add("profile-pic");
        profilePicElement.style.backgroundImage = "url('images/user1.png')"; // Replace with actual user image URL if available
        messageElement.appendChild(profilePicElement);

        // Create the message content container
        const messageContentElement = document.createElement("div");
        messageContentElement.classList.add("message-content");

        // Create the username element
        const usernameElement = document.createElement("span");
        usernameElement.classList.add("username");
        usernameElement.textContent = username; // Display the sender's username
        messageContentElement.appendChild(usernameElement);

        // Create the message text element
        const messageTextElement = document.createElement("span");
        messageTextElement.classList.add("message-text");
        messageTextElement.textContent = message; // Display the content of the message
        messageContentElement.appendChild(messageTextElement);

        // Create the timestamp element
        const timestampElement = document.createElement("span");
        timestampElement.classList.add("timestamp");
        timestampElement.textContent = new Date().toLocaleTimeString(); // Display the current time
        messageContentElement.appendChild(timestampElement);

        // Append the message content to the main message container
        messageElement.appendChild(messageContentElement);

        // Append the constructed message element to the message list
        messageList.appendChild(messageElement);

        // Reset the value of the textbox to empty
        messageInput.value = '';
        socket.emit('stop_typing');
    }
});
// Typing indicator events
messageInput.addEventListener('input', () => {
    if (messageInput.value) {
        socket.emit('typing', username);
    } else {
        socket.emit('stop_typing');
    }
});
// Hide typing indicator when clicking outside the input box
messageInput.addEventListener('blur', () => {
    socket.emit('stop_typing');
});

socket.on('display_typing', (username) => {
    typingIndicator.textContent = `${username} is typing...`;
});

socket.on('stop_typing', () => {
    typingIndicator.textContent = '';
});
// Update connected users panel
socket.on('update_user_list', (users) => {
    connectedUsersList.innerHTML = ''; // Clear the current list
    users.forEach(user => {
        const userElement = document.createElement('li');
        userElement.innerHTML = `<span class="online-dot"></span>${user}`;
        connectedUsersList.appendChild(userElement);
    });

    // Update the connected users count
    document.querySelector('.connected-header').textContent = `Connected users ${users.length}`;
});
// Display messages on the UI.
// socket.on('load_messages', (messages) => {
//     messages.forEach(message => {
//         const messageElement = document.createElement("div");
//         messageElement.classList.add("message");
//         messageElement.innerText = new Date(message.timestamp).toLocaleTimeString() + " - " + message.username + ": " + message.message;
//         messageList.appendChild(messageElement);
//     });
// });
// Display messages on the UI.
socket.on('load_messages', (messages) => {
    messages.forEach(message => {
        // Create the main message container
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");

        // Create the profile picture div
        const profilePicElement = document.createElement("div");
        profilePicElement.classList.add("profile-pic");
        profilePicElement.style.backgroundImage = "url('images/user1.png')"; // Replace with actual user image URL if available
        messageElement.appendChild(profilePicElement);

        // Create the message content container
        const messageContentElement = document.createElement("div");
        messageContentElement.classList.add("message-content");

        // Create the username element
        const usernameElement = document.createElement("span");
        usernameElement.classList.add("username");
        usernameElement.textContent = message.username;
        messageContentElement.appendChild(usernameElement);

        // Create the message text element
        const messageTextElement = document.createElement("span");
        messageTextElement.classList.add("message-text");
        messageTextElement.textContent = message.message;
        messageContentElement.appendChild(messageTextElement);

        // Create the timestamp element
        const timestampElement = document.createElement("span");
        timestampElement.classList.add("timestamp");
        timestampElement.textContent = new Date(message.timestamp).toLocaleTimeString();
        messageContentElement.appendChild(timestampElement);

        // Append message content to the main message container
        messageElement.appendChild(messageContentElement);

        // Append the constructed message element to the message list
        messageList.appendChild(messageElement);
    });
});


// // Listen for broadcast message, and add it to the list.
// socket.on('broadcast_message', (userMessage) => {
//     const messageElement = document.createElement("div");
//     messageElement.classList.add("message");
//     messageElement.innerText = userMessage.username + ": " + userMessage.message;
//     messageList.appendChild(messageElement);
// });
// Listen for broadcast message, and add it to the list.
socket.on('broadcast_message', (userMessage) => {
    // Create the main message container
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    // Create the profile picture div
    const profilePicElement = document.createElement("div");
    profilePicElement.classList.add("profile-pic");
    profilePicElement.style.backgroundImage = "url('images/user1.png')"; // Replace with actual user image URL if available
    messageElement.appendChild(profilePicElement);

    // Create the message content container
    const messageContentElement = document.createElement("div");
    messageContentElement.classList.add("message-content");

    // Create the username element
    const usernameElement = document.createElement("span");
    usernameElement.classList.add("username");
    usernameElement.textContent = userMessage.username;
    messageContentElement.appendChild(usernameElement);

    // Create the message text element
    const messageTextElement = document.createElement("span");
    messageTextElement.classList.add("message-text");
    messageTextElement.textContent = userMessage.message;
    messageContentElement.appendChild(messageTextElement);

    // Create the timestamp element
    const timestampElement = document.createElement("span");
    timestampElement.classList.add("timestamp");
    timestampElement.textContent = new Date().toLocaleTimeString(); // Using the current time for the broadcasted message
    messageContentElement.appendChild(timestampElement);

    // Append message content to the main message container
    messageElement.appendChild(messageContentElement);

    // Append the constructed message element to the message list
    messageList.appendChild(messageElement);
});
