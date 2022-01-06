// Déclaration des modules d'authentification sécurisés (token et hash).
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcrypt');
const bdd = require ('../utils/database')
const dotenv = require('dotenv');
const result = dotenv.config();

exports.signup = (req, res, next) => {
    console.log('req body')
   console.log(req)
  bcrypt.hash(req.body.user_password, 10)
    .then(hash => {
      const user = ({
        user_pseudo: req.body.user_pseudo, 
        user_email: req.body.user_email,
        user_password: hash,
        admin: false
      });
     
      const sql = "INSERT INTO Users SET ?";
      const data = bdd.database();
      data.query(sql, user, (err, result, field) => {
        if (err) {
          console.log(err)
          return res.status(403).json ({ message: 'Erreur: Utilisateur déjà créé !' })  
        }
          return res.status(201).json ({ message: 'Utilisateur créé et sauvegardé !' })
      }); 
    })
    .catch(error => res.status(500).json ({ error }).send(console.log(error)));
};