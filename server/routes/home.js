const router = require('express').Router();
const auth = require('./auth');
const User = require('../models/users');

router.post('/', auth, (req, res) => {
    console.log(req.body);
    res.json({
        status: 'OK'
    })
})

router.delete('/logout', auth, (req, res) => {
    try {
        res.clearCookie('token').status(200).json({
            status: 'OK',
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Some error occured... Try again',
        })
    }
})

module.exports = router;