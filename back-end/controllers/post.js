const bdd = require ('../utils/database');
const token = require ('../middleware/token')
const jwt = require ('jsonwebtoken');
const fs = require('fs');
const dotenv = require('dotenv');
const result = dotenv.config();
const data = bdd.database();

exports.createPost = (req, res, next) => {
  const userId = token.tokenUserId(req);
  console.log("userId")
  console.log(userId)
  let imageUrl;
  try {
    const account = `SELECT * FROM users WHERE id = ?`;
    data.query(account, userId,(err, result) => {
      if (err)  {
        return res.status(404).json ({ message: "Récupération de l'userId impossible !" }); 
      }
      delete result[0].password;
      console.log("resultat avant del pass")
      console.log(result)
      if (result[0].id === userId) {
        if(req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
          }
          else {
            imageUrl = null;
          }

          const post = {
             message: req.body.message,
              image: imageUrl, 
              date: new Date(),
              userId: userId,      
          }

          console.log("corps de post")
          console.log(post)
          const dbPost = "INSERT INTO Posts (message, image, date, userId) VALUES (?)";
          data.query(dbPost, post,(err, result) => {
            if (err)  {
              console.log(err)
              return res.status(404).json ({ message: "Ajout des informations impossible !" }); 
            }
            else {
              return res.status(200).json ({ result }); 
            };
          });








       
      };
    }); 
  }
    catch(err) {res.status(500).json({ message: " Erreur serveur", err });
  };
};