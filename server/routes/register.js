const router = require('express').Router();
const User = require('../models/users');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
const code = Math.floor(1000 + Math.random() * 9000);

router.post('/', async (req, res) => {

    const { email } = req.body;
    const user = await User.find({ email: email })
    if (user.length > 0) {
        res.status(400).json({
            msg: 'User already exists.'
        })
        return;
    }

    sgMail.setApiKey(process.env.SG);
    const msg = {
        to: req.body.email,
        from: process.env.umail,
        subject: 'Please verify your email.',
        html: `Copy this given code: <strong>${code}</strong> and enter to verify your email. `,
    }
    sgMail
        .send(msg)
        .then(() => {
            res.status(200).json({
                status: 'OK'
            })
            return;
        })
        .catch((error) => {
            res.status(500).json({
                status: 'Error'
            })
            return;
        })
})

router.post('/verify', async (req, res) => {
    const { inp, email, password } = req.body;
    console.log(inp, email, password);
    if (Number(inp) === code) {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const user = new User({
            email: email,
            password: hashedPass,
        })

        user.save()
            .then((resp) => {
                res.json({
                    status: 'OK'
                })
                return;
            })
            .catch((er) => {
                res.status(500).json({
                    status: 'Error'
                })
                return;
            })
    } else {
        res.status(400).json({
            msg: 'Wrong code.'
        })
        return;
    }
})

module.exports = router;