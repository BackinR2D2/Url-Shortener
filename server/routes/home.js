const router = require('express').Router();
const auth = require('./auth');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

router.post('/', auth, async (req, res) => {
    const { id } = req.user;
    console.log(req.user);
    const { url, slug } = req.body;
    const postID = mongoose.Types.ObjectId();

    let date = new Date();
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    date = mm + '/' + dd + '/' + yyyy;
    const user = await User.findOne({ _id: id });
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
        userPosts.unshift({ url, slug, postID, date });
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
        res.json({
            status: 'OK',
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Some error occured... Try again',
        })
    }
})

module.exports = router;