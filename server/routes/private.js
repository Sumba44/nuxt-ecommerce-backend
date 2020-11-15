const router = require('express').Router();
const verify = require('./verifyToken');
const db = require("../db");

router.get('/getUser', verify, async (req,res) => {
    
    const userInfo = await db.getUser(req.user.id);
    res.send(userInfo);
});

module.exports = router;