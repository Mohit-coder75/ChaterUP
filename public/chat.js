document.addEventListener("DOMContentLoaded", () => {
  const socket = io("http://localhost:3000");

  // Prompt for the username immediately after DOM is loaded
  let username;
  while (!username) {
    username = prompt('Enter your name');
  }

  // Step 2: Wait for the socket to connect before emitting the username
  socket.on("connect", () => {
    socket.emit("join", username);

    // Set up chat event listeners after successful connection
    setupChatListeners(socket, username);
  });

  // Log connection errors to the console
  socket.on("connect_error", (err) => {
    console.error("Connection Error: ", err.message);
  });
});

// Function to set up chat event listeners
function setupChatListeners(socket, username) {
  let typingTimeout;
  const msgerForm = document.querySelector(".msger-inputarea");
  const msgerInput = document.querySelector(".msger-input");
  const msgerChat = document.querySelector(".msger-chat");
  const connectedUsersList = document.querySelector(".connected-users ul");

  // Event listener for sending messages
  msgerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const msgText = msgerInput.value;
    if (!msgText) return;

    appendMessage(username, "right", msgText);
    msgerInput.value = "";
    socket.emit("new_message", msgText);
  });

  // Listen for incoming messages
  socket.on("broadcast_message", (data) => {
    appendMessage(data.username, "left", data.message);
  });

  // Listen for updates to the connected users list
  socket.on("update_user_list", (users) => {
    updateConnectedUsers(users);
  });

  // Listen for user join events
  socket.on("user_joined", (joinedUsername) => {
    appendMessage("System", "center", `${joinedUsername} has joined the chat.`);
  });

  // Listen for old messages
  socket.on("load_messages", (messages) => {
    messages.forEach((msg) => {
      appendMessage(msg.username, "left", msg.message, new Date(msg.timestamp));
    });
  });
  msgerInput.addEventListener("focus", () => {
    // Emit typing event when the input is focused
    socket.emit("typing", username);
  });
  msgerInput.addEventListener("blur", () => {
    // Emit stop typing event when the input loses focus
    socket.emit("stop_typing");
  });

  // Typing event listeners
  
  msgerInput.addEventListener("input", () => {
    // Clear existing timeout
    clearTimeout(typingTimeout);

    // Emit typing event if there's input
    socket.emit("typing", username);

    // Set a timeout to emit stop typing if the user stops typing
    typingTimeout = setTimeout(() => {
      socket.emit("stop_typing");
    }, 1000); // Adjust the timeout duration as needed
  });

 
}

// Helper functions
function showTypingIndicator(username) {
  const typingIndicator = document.querySelector(".typing-indicator");
  typingIndicator.textContent = `${username} is typing...`;
  typingIndicator.style.display = "block";
}

function hideTypingIndicator() {
  const typingIndicator = document.querySelector(".typing-indicator");
  typingIndicator.style.display = "none";
}
function appendMessage(name, side, text, date = new Date()) {
  const msgerChat = document.querySelector(".msger-chat");
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(./images/user1.png)"></div>
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(date)}</div>
        </div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;
  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function updateConnectedUsers(users) {
  const connectedUsersList = document.querySelector(".connected-users ul");
  connectedUsersList.innerHTML = "";
  users.forEach(user => {
    const userHTML = `<li><span class="online-dot"></span> ${user}</li>`;
    connectedUsersList.insertAdjacentHTML("beforeend", userHTML);
  });
}



function formatDate(date) {
  const hours = "0" + date.getHours();
  const minutes = "0" + date.getMinutes();
  return `${hours.slice(-2)}:${minutes.slice(-2)}`;
}
