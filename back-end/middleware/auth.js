const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.JWT_KEY_TOKEN}`);
    const userId = decodedToken.userId;
    req.auth = { userId };
      if (req.body.userId && req.body.userId !== userId) {
        throw 'Identifiant utilisateur invalide !';
      } 
      else {
      next();
  };
  } 
  catch {
    res.status(401).json({ error: new Error('Requête invalide !')})
  };
}