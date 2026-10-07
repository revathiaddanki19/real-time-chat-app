const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const User = require("./models/User");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");

const authMiddleware =
    require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);


// =====================================================
// SOCKET.IO
// =====================================================

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


// Make Socket.IO available to routes
app.set("io", io);


// =====================================================
// API ROUTES
// =====================================================

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);


// =====================================================
// PROTECTED TEST ROUTE
// =====================================================

app.get(
    "/api/protected",
    authMiddleware,
    (req, res) => {

        res.json({
            message:
                "You accessed a protected route successfully.",

            userId:
                req.userId
        });

    }
);


// =====================================================
// SOCKET.IO CONNECTION
// =====================================================

io.on("connection", (socket) => {

    console.log(
        "User connected:",
        socket.id
    );


    // =================================================
    // JOIN
    // =================================================

    socket.on(
        "join",
        async (userId) => {

            try {

                socket.join(userId);

                socket.userId =
                    userId;


                await User.findByIdAndUpdate(
                    userId,
                    {
                        isOnline:
                            true
                    }
                );


                console.log(
                    `User ${userId} is now ONLINE`
                );


                io.emit(
                    "userStatusChanged",
                    {
                        userId:
                            userId,

                        isOnline:
                            true
                    }
                );

            } catch (error) {

                console.log(
                    "Error updating online status:",
                    error
                );

            }

        }
    );


    // =================================================
    // SEND MESSAGE
    // =================================================

    socket.on(
        "sendMessage",
        (data) => {

            const {
                sender,
                receiver,
                message,
                messageId
            } = data;


            console.log(
                "Real-time message:",
                data
            );


            io.to(receiver).emit(
                "receiveMessage",
                {
                    sender:
                        sender,

                    receiver:
                        receiver,

                    message:
                        message,

                    messageId:
                        messageId
                }
            );

        }
    );


    // =================================================
    // DELETE MESSAGE
    // =================================================

    socket.on(
        "deleteMessage",
        (data) => {

            const {
                sender,
                receiver,
                messageId
            } = data;


            console.log(
                "Real-time message deletion:",
                data
            );


            io.to(receiver).emit(
                "messageDeleted",
                {
                    messageId:
                        messageId
                }
            );


            console.log(
                `Message ${messageId} deletion sent to room: ${receiver}`
            );

        }
    );


    // =================================================
    // TYPING
    // =================================================

    socket.on(
        "typing",
        (data) => {

            const {
                sender,
                receiver,
                username
            } = data;


            console.log(
                "TYPING EVENT RECEIVED:",
                data
            );


            io.to(receiver).emit(
                "userTyping",
                {
                    sender:
                        sender,

                    username:
                        username
                }
            );


            console.log(
                `Typing event sent to room: ${receiver}`
            );

        }
    );


    // =================================================
    // STOP TYPING
    // =================================================

    socket.on(
        "stopTyping",
        (data) => {

            const {
                sender,
                receiver
            } = data;


            console.log(
                "STOP TYPING EVENT RECEIVED:",
                data
            );


            io.to(receiver).emit(
                "userStoppedTyping",
                {
                    sender:
                        sender
                }
            );


            console.log(
                `Stop typing event sent to room: ${receiver}`
            );

        }
    );


    // =================================================
    // DISCONNECT
    // =================================================

    socket.on(
        "disconnect",
        async () => {

            console.log(
                "User disconnected:",
                socket.id
            );


            try {

                if (socket.userId) {

                    const currentTime =
                        new Date();


                    await User.findByIdAndUpdate(
                        socket.userId,
                        {
                            isOnline:
                                false,

                            lastSeen:
                                currentTime
                        }
                    );


                    console.log(
                        `User ${socket.userId} is now OFFLINE`
                    );


                    console.log(
                        `Last seen: ${currentTime}`
                    );


                    io.emit(
                        "userStatusChanged",
                        {
                            userId:
                                socket.userId,

                            isOnline:
                                false,

                            lastSeen:
                                currentTime
                        }
                    );

                }

            } catch (error) {

                console.log(
                    "Error updating offline status:",
                    error
                );

            }

        }
    );

});


// =====================================================
// ROOT ROUTE
// =====================================================

app.get(
    "/",
    (req, res) => {

        res.send(
            "Real-Time Chat Application Server Running"
        );

    }
);


// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
    .connect(
        process.env.MONGO_URI
    )
    .then(() => {

        console.log(
            "MongoDB connected successfully"
        );

    })
    .catch((error) => {

        console.log(
            "MongoDB connection error:",
            error
        );

    });


// =====================================================
// START SERVER
// =====================================================

const PORT =
    process.env.PORT || 5000;

server.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);