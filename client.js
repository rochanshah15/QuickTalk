const socket = io("http://localhost:8000");
const form = document.getElementById("send-container");
const msginput = document.getElementById("msginp");
const chatbox = document.querySelector(".chat-messages");

// Append messages dynamically with correct styling
const append = (msg, position, timeout = 0) => {
    const message = document.createElement("div");
    message.innerText = msg;
    message.classList.add("message", position); // Ensuring correct positioning
    chatbox.append(message);

    // Auto-scroll to latest message
    chatbox.scrollTop = chatbox.scrollHeight;

    if (timeout > 0) {
        setTimeout(() => {
            message.remove();
        }, timeout);
    }
};

// Handle form submission (sending message)
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = msginput.value.trim();
    if (msg === "") return; // Prevent empty messages

    append(`You: ${msg}`, "sent"); // Message on right side
    socket.emit("send", msg);
    msginput.value = ""; // Clear input field
});

// Ask for username and notify others
const name = prompt("Enter your name to join");
socket.emit("new-user-joined", name);

// When a new user joins
socket.on("user-joined", (data) => {
    append(`${data} joined the chat`, "system", 5000); // System message in center
});

// Handle receiving messages from others
socket.on("receive", (data) => {
    append(`${data.name}: ${data.message}`, "received"); // Message on left side
});

// Handle user leaving
socket.on("user-left", (name) => {
    append(`${name} left the chat`, "system", 5000);
});
