const express = require("express");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// GET ALL USERS
// =====================================================

router.get("/", authMiddleware, async (req, res) => {
    try {

        const users = await User.find(
            { _id: { $ne: req.userId } },
            {
                username: 1,
                email: 1,
                isOnline: 1,
                lastSeen: 1
            }
        );

        res.status(200).json({
            message: "Users retrieved successfully",
            data: users
        });

    } catch (error) {

        console.log("Get users error:", error);

        res.status(500).json({
            message: "Server error while retrieving users"
        });

    }
});


module.exports = router;