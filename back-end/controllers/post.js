const bdd = require ('../utils/database');
const token = require ('../middleware/token')
const fs = require('fs');
const dotenv = require('dotenv');
const result = dotenv.config();
const data = bdd.database();

exports.createPost = (req, res, next) => {

  const userId = token.tokenUserId(req);
  let imageUrl;
  try {
    const create = `SELECT * FROM users WHERE id = ?`;
    data.query(create, userId,(err, result) => {
      if (err)  {
        res.status(404).json ({ message: "Récupération de l'userId impossible !" });
        return;
      }
      delete result[0].password;
      if (result[0].id === userId) {
        if(req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
          }
          else {
            imageUrl = null;
          }

          const post = ({
              message: req.body.message,
              image: imageUrl, 
              date: new Date().toLocaleString("fr-FR",{ timeZone: "Europe/Paris" }),
              userId: userId,      
          })

          const sql = `INSERT INTO Posts SET ?`;
          data.query(sql, [post],(err, result) => {
            if (err)  {
              console.log(err)
              res.status(404).json ({ message: "Ajout des informations impossible !" });
              return;
            }
            else {
              res.status(201).json ({ message: "Création de post réussie" }); 
            };
          });
        };
    }); 
  }
    catch(err) {res.status(500).json({ message: " Erreur serveur", err });
  };
};

exports.getOnePost = (req, res, next) => {

  const { id } = req.params;
  const post = `SELECT * FROM Posts WHERE id = ?`;
  data.query(post, id,(err, result) => {
    if (err)  {
      res.status(404).json ({ message: "Récupération du post impossible !" });
      return;
    }
      res.status(200).json ({ result }); 
  });
};

exports.getAllPosts = (req, res, next) => {

  const { id } = req.params;
  const posts = `SELECT * FROM Posts JOIN users WHERE users.id = userId ORDER BY date DESC LIMIT 50`;
  data.query(posts, id,(err, result) => {
    if (err)  {
      res.status(404).json ({ message: "Récupération des posts impossible !" });
      return;
    }
      res.status(200).json ({ result }); 
  });
};

exports.modifyPost = (req, res, next) => {
  
  const { id } = req.params;
  let imageUrl;

    const post = `SELECT * FROM Posts WHERE id = ?`;
    data.query(post, id,(err, result) => {
      if (err)  {
        return res.status(404).json ({ message: "Récupération des informations impossible !" }); 
      }
      if (result[0].userId === req.auth.userId) {
        if(result[0].image || null) {
          const split = result[0].image.split('/images/')[1];
          fs.unlink(`images/${split}`, () => {
            if (err) console.log(err);
            else console.log('Image supprimée !');
          })
        };
        console.log(req.file)
      if(req.file) {
        imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
      }
      else {
        imageUrl = null;
      }
      const modify = ({
        message: req.body.message,
        image: imageUrl, 
        date: new Date().toLocaleString("fr-FR",{ timeZone: "Europe/Paris" }),
      })
      const update = `UPDATE Posts SET = ? WHERE id = ?`;
      data.query(update, [modify, id], (err, result) => {
        if (err) {
          console.log(err)
          res.status(404).json ({ message: "Impossible de mettre à jour les données utilisateur." });
          return;
        }; 
          res.status(201).json ({ message: "Informations mises à jour !" });
          return;
      });
    }
  })
};

exports.deletePost = (req, res, next) => {

  const userId = token.tokenUserId(req);
  const { id } = req.params;

  const post = `SELECT * FROM Posts WHERE id = ?`;
  data.query(post, id,(err, result) => {
    if (err)  {
      return res.status(404).json ({ message: "Récupération des informations impossible !" }); 
    }
    if (result[0].userId === req.auth.userId) {
      if(result[0].image || null) {
        const split = result[0].image.split('/images/')[1];
        fs.unlink(`images/${split}`, () => {
          if (err) console.log(err);
          else console.log('Image supprimée !');
        });
      };
    }
    console.log(result)
    if (req.params.id == result[0].id) {
      const post = `DELETE FROM Posts WHERE id = ?`;
      data.query(post, id,(err, result) => {
        if (err)  {
          res.status(404).json ({ message: "Vous n'êtes pas autorisé à supprimer ce post !" });
          return;
        }
        if (result) {
          res.status(404).json ({ message: `Votre post n°${req.params.id} est supprimé !` }); 
          return;
        };
      });
    };
  });
};