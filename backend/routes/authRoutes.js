const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Message = require("../models/Message");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// REGISTER
// =====================================================

router.post("/register", async (req, res) => {
    try {

        const {
            username,
            email,
            password
        } = req.body;

        if (
            !username ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                message:
                    "Username, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters"
            });
        }

        const existingUsername =
            await User.findOne({
                username
            });

        if (existingUsername) {
            return res.status(400).json({
                message:
                    "Username already exists"
            });
        }

        const existingEmail =
            await User.findOne({
                email
            });

        if (existingEmail) {
            return res.status(400).json({
                message:
                    "Email already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const newUser =
            new User({
                username:
                    username,
                email:
                    email,
                password:
                    hashedPassword
            });

        await newUser.save();

        res.status(201).json({
            message:
                "User registered successfully"
        });

    } catch (error) {

        console.log(
            "Registration error:",
            error
        );

        res.status(500).json({
            message:
                "Server error during registration"
        });
    }
});


// =====================================================
// LOGIN
// =====================================================

router.post("/login", async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        if (
            !email ||
            !password
        ) {
            return res.status(400).json({
                message:
                    "Email and password are required"
            });
        }

        const user =
            await User.findOne({
                email
            });

        if (!user) {
            return res.status(400).json({
                message:
                    "Invalid email or password"
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(400).json({
                message:
                    "Invalid email or password"
            });
        }

        const token =
            jwt.sign(
                {
                    userId:
                        user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:
                        "1d"
                }
            );

        res.status(200).json({
            message:
                "Login successful",

            token:
                token,

            user: {
                id:
                    user._id,

                username:
                    user.username,

                email:
                    user.email
            }
        });

    } catch (error) {

        console.log(
            "Login error:",
            error
        );

        res.status(500).json({
            message:
                "Server error during login"
        });
    }
});


// =====================================================
// DELETE ACCOUNT
// =====================================================

router.delete(
    "/delete-account",
    authMiddleware,
    async (req, res) => {

        try {

            const userId =
                req.userId;

            const user =
                await User.findById(
                    userId
                );

            if (!user) {
                return res.status(404).json({
                    message:
                        "User account not found"
                });
            }


            // -----------------------------------------
            // DELETE ALL MESSAGES
            // -----------------------------------------

            await Message.deleteMany({
                $or: [
                    {
                        sender:
                            userId
                    },
                    {
                        receiver:
                            userId
                    }
                ]
            });


            // -----------------------------------------
            // DELETE USER
            // -----------------------------------------

            await User.findByIdAndDelete(
                userId
            );


            // -----------------------------------------
            // REAL-TIME ACCOUNT DELETION EVENT
            // -----------------------------------------

            const io =
                req.app.get("io");

            if (io) {

                io.emit(
                    "userAccountDeleted",
                    {
                        userId:
                            userId
                    }
                );

            }


            // -----------------------------------------
            // RESPONSE
            // -----------------------------------------

            res.status(200).json({
                message:
                    "Account deleted successfully"
            });

        } catch (error) {

            console.log(
                "Delete account error:",
                error
            );

            res.status(500).json({
                message:
                    "Server error while deleting account"
            });
        }
    }
);


module.exports = router;