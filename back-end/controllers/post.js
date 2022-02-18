const bdd = require ('../utils/database');
const token = require ('../middleware/token');
const fs = require('fs');
const dotenv = require('dotenv');
const result = dotenv.config();
const data = bdd.database();

// Création du post.
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
      message: req.body.message,
      image: imageUrl, 
      date_message : dateCreate,
      userId: userId,      
    })

    const sql = `INSERT INTO posts SET ?`;
    data.query(sql, [post],(err, result) => {
      if (err)  {console.log(err)
        res.status(404).json ({ message: "Ajout des informations impossible !" });
        return;
      }
      else {
        res.status(201).json ({ message: "Création de post réussie" }); 
      };
    });
  });
  }
    catch(err) {res.status(500).json({ message: " Erreur serveur", err });
  };
};

// Récupération d'un post.
exports.getOnePost = (req, res, next) => {

  const { id } = req.params;
  const post = `SELECT * FROM posts WHERE id_post = ?`;
  data.query(post, id,(err, result) => {
    if (err)  {
      res.status(404).json ({ message: "Récupération du post impossible !" });
      return;
    }
      res.status(200).json ({ result }); 
  });
};

// Récupération de tous les posts
exports.getAllPosts = (req, res, next) => {

  const { id } = req.params;
  const posts = `SELECT * FROM posts JOIN users WHERE users.id = userId ORDER BY date_message DESC LIMIT 50`;
  data.query(posts,(err, result) => {
    if (err)  {
      res.status(404).json ({ message: "Récupération des posts impossible !" });
      return;
    }
      res.status(200).json ({ result }); 
  });
};

// Modification d'un post avec ou sans fichier multimédia et suppression des fichiers obsolètes.
// Seul le créateur de la ressource ou l'administrateur peut modifier le post.
exports.modifyPost = (req, res, next) => {
  
  const userId = token.tokenUserId(req);
  const { id } = req.params;
  let imageUrl;
  const post = `SELECT * FROM posts WHERE id_post = ?`;
  data.query(post, id,(err, result) => {
    if (result[0].userId === req.auth.userId || req.admin) {
      if (err)  { console.log(err) };
        if (req.file) {
          if(result[0].image) {
            const split = result[0].image.split('/images/')[1];
            fs.unlink(`images/${split}`, () => {
              if (err) console.log(err);
          })
        }
      };  
      
      if(req.file) {

        imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        const modify1 = {
          message: req.body.message,
          image: imageUrl, 
        };
  
        const update = `UPDATE posts SET ? WHERE id_post = ?`;
        data.query(update, [modify1, id], (err, result) => {
          if (err) { console.log(err) };
          if (result){
            res.status(201).json ({ message: "Informations mises à jour !" });
            return;
          }
        });
      }
      else if (!req.file) {

        const modify2 = {
          message: req.body.message,
        };
  
        const update = `UPDATE posts SET ? WHERE id_post = ?`;
        data.query(update, [modify2, id], (err, result) => {
          if (err) { console.log(err) };
          if (result){
            res.status(201).json ({ message: "Informations mises à jour !" });
            return;
          }
        });
      }
    }
    else {
      res.status(401).json  ({ message: "Impossible de mettre à jour les données utilisateur." });
      return;
    }
  });    
}; 

// Suppression du post et des éléments multimédia du post.
// Seul le créateur de la ressource ou l'administrateur peut supprimer le post.
exports.deletePost = (req, res, next) => {

  const userId = token.tokenUserId(req);
  const { id } = req.params;

  const post = `SELECT * FROM posts WHERE id_post = ?`;
  data.query(post, id,(err, result) => {
    if (result[0].userId === req.auth.userId || req.admin) {
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

    if (req.params.id == result[0].id_post || req.admin) {
      const post = `DELETE FROM posts WHERE id_post = ?`;
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

// Création d'un commentaire lié à un post.
exports.createComment = (req, res, next) => {

  const userId = token.tokenUserId(req);
  const { id } = req.params;

  var now = new Date();
  var jsonDate = now.toJSON();
  var dateCreate= new Date(jsonDate);

  const commentaire = ({
      comment: req.body.comment,
      date_comment : dateCreate,
      userId: userId,
      postId: id      
  });

  const post = `INSERT INTO comments SET ?`;
  data.query(post, [commentaire],(err, result) => {
    if (err) { console.log(err) };
    if (result) {
       res.status(200).json ({ message: "Votre commentaire à bien était ajouté !" });
       return;
    }; 
  }); 
};

// Récupération de tous les commentaires.
exports.getAllComments = (req, res, next) => {

  const { id } = req.params;
  const comments = `SELECT * FROM comments JOIN users WHERE users.id = userId ORDER BY date_comment DESC LIMIT 50`;
  data.query(comments,(err, result) => {
    if (err)  {
      res.status(404).json ({ message: "Récupération des commentaires impossible !" });
      return;
    }
      res.status(200).json ({ result }); 
  });
};

// Suppression du commentaire lié à un post.
// Seul le créateur de la ressource ou l'administrateur peut supprimer le commentaire.
exports.deleteComment = (req, res, next) => {

  const userId = token.tokenUserId(req);
  const { id } = req.params;

  const select = `SELECT * FROM comments WHERE id_comment = ?`;
  data.query(select, id,(err, result) => {
    if (err) { console.log(err) };
    if (result[0].userId === req.auth.userId || req.admin) {
      console.log("userdel")
      console.log(result[0].userId)
      const delCom = `DELETE FROM comments WHERE id_comment = ?`;
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