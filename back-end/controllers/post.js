const bdd = require ('../utils/database');
const token = require ('../middleware/token')
const fs = require('fs');
const dotenv = require('dotenv');
const result = dotenv.config();
const data = bdd.database();

exports.createPost = (req, res, next) => {

  const userId = token.tokenUserId(req);
  let imageUrl;
  const { message } = req.body;

  try {

    if(message === null) {
      res.status(200).json ({ message: 'Veuillez saisir votre message.' });
      return;
    };

    const create = `SELECT * FROM users WHERE id = ?`;
    data.query(create, userId,(err, result) => {
      if (err)  {
        res.status(404).json ({ message: "Récupération de l'userId impossible !" });
        return;
      }
    });
    if(req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }
    else {
      imageUrl = null;
    }

    var now = new Date();
    var jsonDate = now.toJSON();
    var dateCreate= new Date(jsonDate);

    const post = ({
      message: message,
      image: imageUrl, 
      date : dateCreate,
      userId: userId,      
    })
        
    const sql = `INSERT INTO posts SET ?`;
    data.query(sql, [post],(err, result) => {
      if (err)  {
        res.status(404).json ({ message: "Ajout des informations impossible !" });
        return;
      }
      else {
        res.status(201).json ({ message: "Création de post réussie" }); 
      };
    });
  }
    catch(err) {res.status(500).json({ message: " Erreur serveur", err });
  };
};

exports.getOnePost = (req, res, next) => {

  const { id } = req.params;
  const post = `SELECT * FROM posts WHERE id = ?`;
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
  const posts = `SELECT * FROM posts JOIN users WHERE users.id = userId ORDER BY date DESC LIMIT 50`;
  data.query(posts, id,(err, result) => {
    if (err)  {
      res.status(404).json ({ message: "Récupération des posts impossible !" });
      return;
    }
      res.status(200).json ({ result }); 
  });
};

exports.modifyPost = (req, res, next) => {
  
  const userId = token.tokenUserId(req);
  const { id } = req.params;
  let imageUrl;
 
  const post = `SELECT * FROM posts WHERE id = ?`;
  data.query(post, id,(err, result) => {
    if (result[0].userId === req.auth.userId) {
      if (err)  { console.log(err) };
      if(result[0].image) {
        const split = result[0].image.split('/images/')[1];
        fs.unlink(`images/${split}`, () => {
          if (err) console.log(err);
        })
      };
      if(req.file) {
        imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
      }
      else {
        imageUrl = null;
      }

      var now = new Date();
      var jsonDate = now.toJSON();
      var dateCreate= new Date(jsonDate);

      const modify = {
        message: req.body.message,
        image: imageUrl, 
        date : dateCreate
      };

      const update = `UPDATE posts SET ? WHERE id = ?`;
      data.query(update, [modify, id], (err, result) => {
          if (err) { console.log(err) };
          if (result){
            res.status(201).json ({ message: "Informations mises à jour !" });
            return;
          }
      });
    }
    else {
      res.status(401).json  ({ message: "Impossible de mettre à jour les données utilisateur." });
      return;
    }
  });    
}; 

exports.deletePost = (req, res, next) => {

  const userId = token.tokenUserId(req);
  const { id } = req.params;

  const post = `SELECT * FROM posts WHERE id = ?`;
  data.query(post, id,(err, result) => {
    if (result[0].userId === req.auth.userId) {
    if (err) { console.log(err) };
      if(result[0].image || null) {
        const split = result[0].image.split('/images/')[1];
        fs.unlink(`images/${split}`, () => {
          if (err) console.log(err);
        });
      };  
    }
    else {
      res.status(404).json ({ message: "Récupération des informations impossible !" });
      return;
    }

    if (req.params.id == result[0].id) {
      const post = `DELETE FROM posts WHERE id = ?`;
      data.query(post, id,(err, result) => {
        if (err) { console.log(err) };
        if (result) {
          res.status(200).json ({ message: `Votre post à bien été supprimé !` }); 
          return;
        };
      });
    }
    else {
      res.status(404).json ({ message: "Vous n'êtes pas autorisé à supprimer ce post !" });
      return;
    };
  });
};

exports.createComment = (req, res, next) => {

  const userId = token.tokenUserId(req);
  const { id } = req.params;

  var now = new Date();
  var jsonDate = now.toJSON();
  var dateCreate= new Date(jsonDate);

  const comment = ({
      message: req.body.message,
      date : dateCreate,
      userId: userId,
      postId: id      
  });

  const post = `INSERT INTO comments SET ?`;
  data.query(post, [comment],(err, result) => {
    if (err) { console.log(err) };
    if (result) {
       res.status(200).json ({ message: "Votre commentaire à bien était ajouté !" });
       return;
    }; 
  }); 
};

exports.modifyComment = (req, res, next) => {

  const userId = token.tokenUserId(req);
  const { id } = req.params;

  const select = `SELECT * FROM comments WHERE id = ?`
  data.query(select, id,(err, result) => {
    console.log(result[0].userId)
    console.log(userId)
    if (err) { console.log(err) };
    if (result[0].userId === userId) {
      const {message} = req.body;
      if (message){
        const update = `UPDATE comments SET message = ? WHERE id = ?`;
        data.query(update, [message, id], (err, result) => {
            if (err) { console.log(err) };
            if (result) {
              res.status(201).json ({ message: "Vos modifications ont bien étaient prises en compte !" });
              return;
            };
        });      
      }; 
    }
    else {
      res.status(401).json ({ message: "Impossible de modifier le commentaire." });
      return;
    }
  });    
};

exports.deleteComment = (req, res, next) => {

  const userId = token.tokenUserId(req);
  const { id } = req.params;

  const select = `SELECT * FROM comments WHERE id = ?`;
  data.query(select, id,(err, result) => {
    if (err) { console.log(err) };
    if (result[0].userId === req.auth.userId) {
      const delCom = `DELETE FROM comments WHERE id = ?`;
      data.query(delCom, id,(err, result) => {
        if (err) { console.log(err) };
        if (result) {
          res.status(200).json ({ message: "Votre commentaire à bien été supprimé !" }); 
          return;
        };
      });
    }
    else {
      res.status(404).json ({ message: "Vous n'êtes pas autorisé à supprimer ce commentaire !" });
      return;
    }
  }); 
};

exports.likePost = (req, res, next) => {

  const userId = token.tokenUserId(req);
  const { id } = req.params;
console.log(req.body)
  const select = `SELECT * FROM likes`;
  data.query(select, id,(err, result) => {
    if (err) { console.log(err) };

  });







};
