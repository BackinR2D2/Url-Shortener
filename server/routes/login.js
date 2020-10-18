const router = require('express').Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    try {
        console.log('HELLO TEST SIGNING TOKEN');
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
            const confirmpass = await bcrypt.compare(password, user.password)
            if (!confirmpass) {
                res.status(400).json({
                    msg: 'Email or password is incorrect'
                })
                return;
            } else {
                // sign jwt token
                const token = jwt.sign({ id: user._id }, process.env.secret)
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                }).json({
                    status: 'OK',
                    data: user.createdAt,
                })
                return;
            }
        } else {
            res.status(401).json({
                msg: 'Email or password is incorrect.'
            })
            return;
        }
    } catch (error) {
        res.status(500).json({
            msg: 'Error'
        })
    }

})

module.exports = router;