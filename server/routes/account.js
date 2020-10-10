const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const auth = require('./auth');

router.get('/account', async (req, res) => {
    try {
        const uid = jwt.verify(req.cookies.token, process.env.secret).id;
        const user = await User.findOne({ _id: uid });
        const userInfo = {
            posts: user.posts,
            email: user.email,
            createdAt: user.createdAt
        }
        res.json({
            status: 'OK',
            userInfo,
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Some error occured... Try again',
        })
    }
})

router.post('/account/delete-post', auth, async (req, res) => {
    try {
        const { slug } = req.body;
        const uid = jwt.verify(req.cookies.token, process.env.secret).id;
        const user = await User.findOne({ _id: uid });
        const posts = user.posts;
        posts.forEach(async (post, i) => {
            if (post.slug === slug) {
                posts.splice(i, 1);
                // TODO: DELETE POSTS AND SAVE THE NEW POSTS WITHOUT THE DELETED POST D'OH
                const saved = await user.save()
                const savedUser = await User.findOneAndUpdate({ _id: uid }, {
                    posts: saved.posts
                }, { new: true })
                res.status(201).json({
                    status: 'OK',
                    id: post.postID,
                    postsLen: posts.length,
                })
                return;
            }
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Some error occured... Try again.',
        })
        return;
    }
})

router.get('/:id/url', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const uid = jwt.verify(req.cookies.token, process.env.secret).id;
        const user = await User.findOne({ _id: uid });
        const posts = user.posts;
        posts.forEach(post => {
            if (post.slug === id) {
                res.json({
                    url: post.url,
                    status: 'OK',
                })
                return;
            }
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Some error occured... Try again.',
        })
    }
})

router.put('/account/update-slug', auth, async (req, res) => {
    try {
        const { oldSlug, newSlug } = req.body;
        const uid = jwt.verify(req.cookies.token, process.env.secret).id;
        const user = await User.findOne({ _id: uid });
        const posts = user.posts;
        posts.forEach(async post => {
            if (post.slug === oldSlug) {
                post.slug = newSlug;
                const saved = await user.save()
                const savedUser = await User.findOneAndUpdate({ _id: uid }, {
                    posts: saved.posts
                }, { new: true })
                res.status(201).json({
                    status: 'OK',
                    newSlug,
                    id: post.postID
                })
                return;
            }
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Some error occured... try again'
        })
    }
})

module.exports = router;