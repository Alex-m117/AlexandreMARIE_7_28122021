const bdd = require ('../utils/database');
const token = require ('../middleware/token')
const jwt = require ('jsonwebtoken');
const fs = require('fs');
const dotenv = require('dotenv');
const result = dotenv.config();
const data = bdd.database();

exports.createPost = (req, res, next) => {
  console.log(req.body.userId)
  console.log(req.file)
    const userId = token.tokenUserId(req);
    console.log(userId)

    const texte = req.body.message;
    const image = (req.file) ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`: "";   
    const post = {
        message: texte,
        image: image,
        //date: new Date().toLocaleDateString("af_AZ", { timeZone : "Paris/Europe" }),
        userId: userId,
    }
    console.log(req.file)
    console.log(req.body)
   console.log(post)
    const dbPost = `INSERT INTO Posts (message, image, userId) VALUES (?)`;
    data.query(dbPost, post,(err, result) => {
      if (err)  {
           console.log(err)
           console.log(result)
        return res.status(404).json ({ message: "Ajout des informations impossible !" }); 
      }
      if (result) {
        res.status(200).json ({ result }); 
      };
    });
  };