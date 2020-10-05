const router = require('express').Router();

router.post('/', (req, res) => {
    console.log(req.body);
    res.json({
        status: 'OK'
    })
})

module.exports = router;