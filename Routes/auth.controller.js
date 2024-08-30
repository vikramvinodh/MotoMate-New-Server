const express = require('express');
const User = require('../Models/User');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const router = express.Router();
const fetchuser = require("../Middleware/fetchuser");
const { body, validationResult } = require('express-validator');
const dotenv = require("dotenv");

dotenv.config();

/*----------------------------------------------------------------------------------------------------------------------------------------------------

                                                       API's TO ADD DELETE AND ALTER THE USER DATA

-----------------------------------------------------------------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/
// API REGISTERS THE USER DATA AND GIVE THEM THE JWT TOCKEN

router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 3 })],
    fetchuser,
    async (req, res) => {
        let success = "false"
        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.status(400).json({ success, error: error.array() });
        }

        try {
            let user = await User.findOne({ email: req.body.email })
           
            if (user) {
                return res.status(400).json({ success, msg: 'user exists' });
            }
            
            const Salt = await bcrypt.genSalt(15);
            const Secure_password = await bcrypt.hash(req.body.password, Salt);

            user = await User.create({
                email: req.body.email,
                username: req.body.username,
                password: Secure_password,
                isadmin: req.body.isadmin,
                userStatus: req.body.userStatus,
                created_by: req.users.id
            })

            const data = {
                user: {
                    id: user.id
                }
            }

            const token = jwt.sign(data, process.env.Secret_Key)
            success = 'true'
            res.status(201).json({ success, token, msg: "user created" })

        } catch (error) {
            res.status(500).json({ success, error: error })
        }
    }
)

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/


/*---------------------------------------------------------------------------------------------------------------------------------------------------*/
// GET THE DATA AND VERIFY THE CREDINTALS AND GENERATE TOKEN AND SEND's IN RESPONSE

router.post('/login',
    async (req, res) => {
        let success = false;
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ success, error: "Enter the correct credentials" })
            }

            if (user.userStatus == "inactive") {
                return res.status(400).json({ success, error: "User Is Inactive Contact Admin" })
            }

            const PasswordCompare = await bcrypt.compare(password, user.password);
            if (!PasswordCompare) {
                return res.status(400).json({ success, error: "Enter correct Password" })
            }

            const data = {
                user: {
                    id: user.id
                }
            }
            const Token = jwt.sign(data, process.env.Secret_Key);
            success = true;
            res.status(201).json({ success, Token })
        }
        catch (error) {

            res.status(500).json({ success, error: "Internal error" })
        }
    }
)

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/
// GETS THE DATA FROM USER AND UPDATES THE USER DATA

router.put('/updateprofile/:id', async (req, res) => {
    const { userStatus, isadmin, username } = req.body;
    success = false;
    try {
        var newprofile = {}
        if (userStatus) {
            newprofile.userStatus = userStatus;
        }
        if (isadmin) {
            newprofile.isadmin = isadmin;
        }
        if (username) {
            newprofile.username = username;
        }

        const id = req.params.id;
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).send("Not Found")
        }

        success = true
        user = await User.findByIdAndUpdate(
            id,
            { $set: newprofile },
            { new: true })
        return res.status(200).json({ success })
    }
    catch (error) {

        return res.status(500).json({ success, error: "Internal error" })
    }
});

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/
// GET ONLY THE USER DATA WITH THE ID SENT IN PARAMATER

router.post('/userdata/:id', async (req, res) => {
    let success = false
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password')
        success = true
        return res.status(200).json({ success, user });
    }
    catch (error) {
        success = true;
        return res.status(500).json({ success, error: "Internal error" })
    }
})

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/
//FETCHE'S THE LOGED IN USER DATA AND SEND IN RESPONSE

router.post('/get-admin', fetchuser, async (req, res) => {
    let success = false
    try {
        const userId = req.users.id;
        const user = await User.findById(userId).select('-password')
        success = true
        return res.status(200).json({ success, user });
    }
    catch (error) {
        success = true;
        return res.status(500).json({ success, error: "Internal error" })
    }
})

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/
// FETHCE's THE USERS AND SEND'S IN RESPONSE

router.get('/fetchusers', fetchuser, async (req, res) => {
    let success = false
    if (!req.users.id) return res.status(401).json("Unauthorize")
    try {
        const users = await User.find().select('-password');
        success = true;
        return res.status(200).json({ success, users, error: 'Found users' });
    }
    catch (error) {
        success = true;
        return res.status(500).json({ success, error: "Internal error" });
    }

})

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/
// API DELETS THE USER WITH THE ID SENT IN PARAMATER

router.delete('/user-delete/:id', async (req, res) => {
    try {
        let success = false;
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success, error: "Not Found" })
        }

        user = await User.findByIdAndDelete(req.params.id)
        success = true;

        return res.status(200).json({ success, error: "Successfully Deleted" })
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------------------------------------------------------------*/
// API USED TO CHAGE THE PASSWORD OF THE USER

router.post('/change-password', (req, res) => {
    const { currentPassword, newPassword, id } = req.body;

    try {
        // Validate the current password
        User.findOne({ _id: id }).then(user => {
            bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    // Hash the new password
                    bcrypt.genSalt(15, (err, salt) => {
                        bcrypt.hash(newPassword, salt, (err, hash) => {
                            if (err) throw err;
                            // Update the user's password
                            User.findOneAndUpdate(
                                { _id: id },
                                { $set: { password: hash } },
                                { new: true }
                            ).then(user => {
                                // Send a success response
                                res.status(200).json({ message: 'Password changed successfully' });
                            });
                        });
                    });
                } else {
                    // Send an error response if the current password is incorrect
                    return res.status(400).json({ message: 'Incorrect password' });
                }
            });
        });
    } catch (error) {
        return res.status(400).json(error);
    }

});


module.exports = router 