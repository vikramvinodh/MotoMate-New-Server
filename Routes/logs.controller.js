const express = require('express');
const fetchuser = require('../Middleware/fetchuser');
const Logs = require('../Models/Logs');
const User = require('../Models/User');
const router = express.Router();

router.get('/', fetchuser, async (req, res) => {
    const userId = req.users.id;
    const user = await User.findById(userId)

    if (user.isadmin != 0) {
        return res.status(401).send('UnAuthorize');
    }
    else {
        try {
            const logs = await Logs.find()
                .sort({ _id: -1 })
            res.status(200).json(logs)
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    }
});

router.post('/', fetchuser, async (req, res) => {
    const userId = req.users.id;
    const { message, date } = req.body;
    const user = await User.findById(userId)
    let dateObj = date.toString()

    try {
        const newLog = new Logs({
            user: user.username,
            message: "User" + " " + message,
            date: dateObj
        });

        await newLog.save();
        res.status(200)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
