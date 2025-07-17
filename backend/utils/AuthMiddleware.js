const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

function UserauthMiddleware(req, res, next) {
    const token = req.body.token ;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        
        req.user = decoded.id;
        next();
    });
  
}

module.exports = UserauthMiddleware;