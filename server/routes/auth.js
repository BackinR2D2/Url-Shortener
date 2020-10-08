const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const situation = jwt.decode(req.cookies.token)
        if (situation == null) {
            res.status(403).json({
                msg: 'Not authorized.'
            })
            return;
        }
        if (Date.now() >= situation.exp * 1000) {
            res.status(401).json({
                msg: 'Session expired. Log in again.'
            })
            return;
        }
        if (!req.cookies.token) {
            res.status(403).json({
                msg: 'Not authorized.'
            })
            return;
        } else if (req.cookies.token) {
            next()
            return;
        }
    } catch (error) {
        res.status(500).json({
            msg: 'Some error occured... Try again.'
        })
    }
}