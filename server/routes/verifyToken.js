const jwt = require('jsonwebtoken');

module.exports = function auth(req,res,next) {
    const token = req.header('token');
    if(!token) return res.status(405).send('Invalid token.');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token.')
    }
}