const io = require("socket.io")(8000, {
    cors: {
        origin: "*", // Allow all origins (for development)
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    // New user joins
    socket.on("new-user-joined", (name) => {
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name); // Match frontend event name
    });

    // Handle sending messages
    socket.on("send", (message) => {
        socket.broadcast.emit("receive", { message: message, name: users[socket.id] });
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        if (users[socket.id]) {
            socket.broadcast.emit("user-left", users[socket.id]);
            delete users[socket.id];
        }
    });
});
