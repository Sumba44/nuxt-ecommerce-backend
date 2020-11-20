const router = require('express').Router();
const verify = require('./verifyToken');
const db = require("../db");

router.get('/getUser', verify, async (req,res) => {

    try {
        const userInfo = await db.getUser(req.user.id);
        res.status(200).send(userInfo);
      } catch (e) {
        console.log(e);
        res.sendStatus(500).send(e);
      }
});

module.exports = router;