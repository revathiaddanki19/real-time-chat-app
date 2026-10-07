const express = require("express");

const Message = require("../models/Message");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// SEND MESSAGE
// =====================================================

router.post("/send", authMiddleware, async (req, res) => {

    try {

        const { receiver, message } = req.body;


        // =================================================
        // CHECK REQUIRED FIELDS
        // =================================================

        if (!receiver || message === undefined) {

            return res.status(400).json({
                message: "Receiver and message are required"
            });

        }


        // =================================================
        // CHECK MESSAGE TYPE
        // =================================================

        if (typeof message !== "string") {

            return res.status(400).json({
                message: "Message must be text"
            });

        }


        // =================================================
        // REMOVE EXTRA SPACES
        // =================================================

        const cleanedMessage =
            message.trim();


        // =================================================
        // CHECK EMPTY MESSAGE
        // =================================================

        if (!cleanedMessage) {

            return res.status(400).json({
                message: "Message cannot be empty"
            });

        }


        // =================================================
        // CHECK MESSAGE LENGTH
        // =================================================

        if (cleanedMessage.length > 500) {

            return res.status(400).json({
                message:
                    "Message cannot exceed 500 characters"
            });

        }


        // =================================================
        // CHECK WHETHER RECEIVER EXISTS
        // =================================================

        const receiverUser =
            await User.findById(receiver);


        if (!receiverUser) {

            return res.status(404).json({
                message: "Receiver user not found"
            });

        }


        // =================================================
        // PREVENT SENDING MESSAGE TO YOURSELF
        // =================================================

        if (
            receiver.toString() ===
            req.userId.toString()
        ) {

            return res.status(400).json({
                message:
                    "You cannot send a message to yourself"
            });

        }


        // =================================================
        // CREATE MESSAGE
        // =================================================

        const newMessage =
            new Message({

                sender:
                    req.userId,

                receiver:
                    receiver,

                message:
                    cleanedMessage

            });


        // =================================================
        // SAVE MESSAGE
        // =================================================

        await newMessage.save();


        // =================================================
        // SUCCESS RESPONSE
        // =================================================

        res.status(201).json({

            message:
                "Message sent successfully",

            data:
                newMessage

        });


    } catch (error) {

        console.log(
            "Send message error:",
            error
        );


        res.status(500).json({

            message:
                "Server error while sending message"

        });

    }

});


// =====================================================
// DELETE MESSAGE
// =====================================================

router.delete(
    "/delete/:messageId",
    authMiddleware,
    async (req, res) => {

        try {

            const messageId =
                req.params.messageId;


            // =================================================
            // FIND MESSAGE
            // =================================================

            const message =
                await Message.findById(
                    messageId
                );


            if (!message) {

                return res.status(404).json({

                    message:
                        "Message not found"

                });

            }


            // =================================================
            // CHECK MESSAGE OWNER
            // =================================================

            if (
                message.sender.toString() !==
                req.userId.toString()
            ) {

                return res.status(403).json({

                    message:
                        "You can only delete your own messages"

                });

            }


            // =================================================
            // DELETE MESSAGE
            // =================================================

            await Message.findByIdAndDelete(
                messageId
            );


            // =================================================
            // SUCCESS
            // =================================================

            res.status(200).json({

                message:
                    "Message deleted successfully",

                messageId:
                    messageId

            });

        } catch (error) {

            console.log(
                "Delete message error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error while deleting message"

            });

        }

    }
);


// =====================================================
// GET CHAT HISTORY
// =====================================================

router.get(
    "/history/:userId",
    authMiddleware,
    async (req, res) => {

        try {

            const loggedInUser =
                req.userId;

            const otherUser =
                req.params.userId;


            const messages =
                await Message.find({

                    $or: [

                        {
                            sender:
                                loggedInUser,

                            receiver:
                                otherUser
                        },

                        {
                            sender:
                                otherUser,

                            receiver:
                                loggedInUser
                        }

                    ]

                }).sort({
                    createdAt: 1
                });


            res.status(200).json({

                message:
                    "Chat history retrieved successfully",

                data:
                    messages

            });


        } catch (error) {

            console.log(
                "Chat history error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error while retrieving chat history"

            });

        }

    }
);


// =====================================================
// MARK MESSAGES AS READ
// =====================================================

router.put(
    "/read/:userId",
    authMiddleware,
    async (req, res) => {

        try {

            const loggedInUser =
                req.userId;

            const senderId =
                req.params.userId;


            await Message.updateMany(

                {
                    sender:
                        senderId,

                    receiver:
                        loggedInUser,

                    read:
                        false
                },

                {
                    $set: {
                        read: true
                    }
                }

            );


            res.status(200).json({

                message:
                    "Messages marked as read"

            });


        } catch (error) {

            console.log(
                "Mark messages as read error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error while marking messages as read"

            });

        }

    }
);


module.exports = router;