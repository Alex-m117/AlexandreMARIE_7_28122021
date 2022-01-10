const bdd = require ('../utils/database');
const token = require ('../middleware/token')
const jwt = require ('jsonwebtoken');
const fs = require('fs');
const dotenv = require('dotenv');
const result = dotenv.config();
const data = bdd.database();

exports.createPost = (req, res, next) => {

  const userId = token.tokenUserId(req);
  console.log('userId')
  console.log(userId)
  let { body, file } = req;
    if (!file) delete req.body.image;
      body = {...body};

  const db = `INSERT INTO Posts ()`;
  data.query(db, body,(err, result) => {

      console.log("result")
      console.log(result)
    if (err)  {
      console.log(err)
      return res.status(404).json ({ message: "Ajout des informations impossible !" }); 
    }
    if (result) {
        res.status(200).json ({ result }); 
    };
  });

 



  };