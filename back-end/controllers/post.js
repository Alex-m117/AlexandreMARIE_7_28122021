const bdd = require ('../utils/database');
const token = require ('../middleware/token')
const jwt = require ('jsonwebtoken');
const fs = require('fs');
const dotenv = require('dotenv');
const result = dotenv.config();
const data = bdd.database();

exports.createPost = (req, res, next) => {
  console.log('--->-')
  console.log(req)
  console.log(req.file)
    const userId = token.tokenUserId(req);
    console.log(userId)

    const post = {
        message: req.body.message,
        image: (req.file) ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`: "", 
        date: new Date().toLocaleDateString(),
        userId: userId,
    }
    console.log(req.file)
    console.log(req.body)
   console.log(post)
    const dbPost = "INSERT INTO Posts (message, image, date, userId) VALUES ('?')";
    data.query(dbPost, post,(err, result) => {
      if (err)  {
           console.log(err)
           console.log(result)
        return res.status(404).json ({ message: "Ajout des informations impossible !" }); 
      }
      else  {
        res.status(200).json ({ result }); 
      };
    });
  };