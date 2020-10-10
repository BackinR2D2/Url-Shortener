const router = require('express').Router();
const auth = require('./auth');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

router.post('/', auth, async (req, res) => {
    const { url, slug } = req.body;
    const postID = mongoose.Types.ObjectId();
    const uid = jwt.verify(req.cookies.token, process.env.secret).id;
    const user = await User.findOne({ _id: uid });
    const userPosts = user.posts;
    let isUsed = false;
    userPosts.forEach(post => {
        if (post.slug === slug) {
            isUsed = true;
        }
    });
    if (isUsed) {
        res.status(400).json({
            msg: 'Slug is already in use.',
        })
        return;
    } else {
        userPosts.push({ url, slug, postID });
        user.save()
            .then((resp) => {
                res.json({
                    status: 'OK'
                })
            })
            .catch((err) => {
                res.status(500).json({
                    msg: 'Some error occured... Try again',
                })
            })
        return;
    }

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