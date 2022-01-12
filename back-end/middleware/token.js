const jwt = require ('jsonwebtoken');
require('dotenv').config();

function tokenUserId (req) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.JWT_KEY_TOKEN}`); 
    const userId = decodedToken.userId;
    return userId  
};

module.exports.tokenUserId = tokenUserId;