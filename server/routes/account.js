const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const auth = require('./auth');

router.get('/account', auth, async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findOne({ _id: id });
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
        const { deleteSlug } = req.body;
        const { id } = req.user;
        const user = await User.findOne({ _id: id });
        const posts = user.posts;
        posts.forEach(async (post, i) => {
            if (post.slug === deleteSlug) {
                posts.splice(i, 1);
                // TODO: DELETE POSTS AND SAVE THE NEW POSTS WITHOUT THE DELETED POST D'OH
                const saved = await user.save()
                const savedUser = await User.findOneAndUpdate({ _id: id }, {
                    posts: saved.posts
                }, { new: true })
                res.status(201).json({
                    status: 'OK',
                    posts: savedUser.posts,
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
        const uid = req.user.id;
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
        if (oldSlug === newSlug) {
            res.status(400).json({
                status: 'Can not update into an already used slug.',
            })
            return;
        }
        let found = false;
        const uid = req.user.id;
        const user = await User.findOne({ _id: uid });
        const posts = user.posts;

        posts.forEach(post => {
            if (post.slug === newSlug) {
                found = true;
            }
        })

        if (found) {
            res.status(400).json({
                msg: 'Slug is already in use.',
            })
            return;
        } else {
            posts.forEach(async post => {
                if (post.slug === oldSlug) {
                    post.slug = newSlug;
                    const saved = await user.save()
                    const savedUser = await User.findOneAndUpdate({ _id: uid }, {
                        posts: saved.posts
                    }, { new: true })
                    res.status(201).json({
                        status: 'OK',
                        posts: savedUser.posts,
                        id: post.postID
                    })
                    return;
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: 'Some error occured... try again'
        })
    }
})

router.delete('/account/delete-account', auth, async (req, res) => {
    try {
        const uid = req.user.id;
        const deletedUser = await User.findOneAndDelete({ _id: uid })
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