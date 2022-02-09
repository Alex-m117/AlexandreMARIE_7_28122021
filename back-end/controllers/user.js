const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcrypt');
const bdd = require ('../utils/database');
const fs = require('fs');
const dotenv = require('dotenv');
const result = dotenv.config();
const data = bdd.database();

exports.signup = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = ({
      pseudo: req.body.pseudo, 
      email: req.body.email,
      password: hash,
      photo : `${req.protocol}://${req.get('host')}/images/default.png`,
      admin: false
    });

    const email = req.body.email;
    const selectEmail = `SELECT email FROM users WHERE email = ?`;
      data.query(selectEmail, email, (err, result) => {
        if (err) {
          console.log(err)  
        };
        if (result.length > 0) {
          res.status(403).json ({ message: 'Erreur: email deja utilisée !' });
          return;
        };

    const account = `INSERT INTO users SET ?`;
      data.query(account, user, (err, result) => {
        if (err) {
          console.log(err)   
        }
        else {
          res.status(201).json ({ message: 'Utilisateur créé et sauvegardé !' });
          return;
        }
      });
      });
  }
  catch(err) {res.status(500).json({ message: " Erreur serveur", err });
  };
};

exports.login = (req, res, next) => {
  try{
    
    const { email, password } = req.body;

      if(email === null || password === null) {
        res.status(200).json ({ message: 'Informations incorrectes !' });
        return;
      };
    
      const selectEmail = `SELECT * FROM users WHERE email = ?`;
      data.query(selectEmail, [email], (err, results) => {
        if (!results[0])  {
          res.status(403).json ({ message: "Erreur: L'email est incorrect !" });
          return;
        };
   
        bcrypt.compare(password, results[0].password)
        .then(user => {
          if (!user) {
            res.status(403).json ({ error: "Erreur: Mot de passe incorrect !" });
            return;
          };

          res.status(200).json ({
            userId: results[0].id, 
            admin: results[0].admin,
            token: jwt.sign(
            { userId: results[0].id,
              admin: results[0].admin },
            `${process.env.JWT_KEY_TOKEN}`,
            { expiresIn: "5h" }
            )  
          });         
        })
        .catch(error => res.status(500).json ({ error })); 
    });
  }
  catch (err) {res.status(404).json({ message: " Erreur serveur", err });
  };
};

exports.getAccount = (req, res, next) => {

  const { id } = req.params;
  const account = `SELECT * FROM users WHERE id = ?`;
  data.query(account, id,(err, result) => {
    if (err)  { console.log(err) };
    if (result) {
      res.status(200).json ({ result }); 
    }
    else{
      res.status(404).json ({ message: "Récupération des informations impossible !" });
      return;
    };
  });
};

exports.updateAccount = (req, res, next) => {
  
  const { id } = req.params;
  let imageUrl;
  if (id == req.auth.userId) {
    const account = `SELECT * FROM users WHERE id = ?`;
    data.query(account, id,(err, result) => {
      if (err) { console.log(err) };
        if (req.file) {
          if(result[0].photo != "http://localhost:3000/images/default.png") {
            const split = result[0].photo.split('/images/')[1];
            fs.unlink(`images/${split}`, () => {
              if (err) console.log(err); 
            })
          };
        };
      });
    }
    else{
      res.status(403).json ({ message: "Modifications non autorisées." });
      return;
    }
    if (id == req.auth.userId) {
      if(req.file) {
        imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
      }
        const updatePhoto = `UPDATE users SET photo = ? WHERE id = ?`;
        data.query(updatePhoto, [imageUrl, id],  (err, result) => {
          if (err) { console.log(err) };
        }); 
    }
    else {
      res.status(403).json ({ message: "Impossible de mettre à jour l'image utilisateur, vérifier le format." });
      return;
    };
    // Modification du pseudo & biographie.
    const { pseudo, biography } = req.body;
    if (id == req.auth.userId) {
      if(pseudo) {
        const changePseudo = `UPDATE users SET pseudo = ? WHERE id = ?`;
        data.query(changePseudo, [pseudo, id],(err, result) => {
          if (err) { console.log(err) };
        });
      };
    }
    else {
      res.status(403).json ({ message: "Impossible de changer votre Pseudo !" });
      return;
    }
    if (id == req.auth.userId) { 
      if(biography) {
        const changeBiography = `UPDATE users SET biography = ? WHERE id = ?`;
        data.query(changeBiography, [biography, id],(err, result) => {
          if (err) { console.log(err) };
        });
      };  
    }          
    else {
      res.status(403).json ({ message: "Impossible de changer votre Biographie !" });
      return;
    }
      res.status(201).json ({ message: "Vos modifications ont bien étaient prises en compte !" });
};

exports.deleteAccount = (req, res, next) => {

  const { id } = req.params;
  
  const account = `SELECT * FROM Users WHERE id = ?`;
  data.query(account, id,(err, result) => {
    if (id == req.auth.userId || req.admin) {  
      if (err) { console.log(err) };
      if(result[0].photo || null) {
        const split = result[0].photo.split('/images/')[1];
        fs.unlink(`images/${split}`, () => {
          if (err) console.log(err);
        });
      };
      const delAccount = `DELETE FROM users WHERE id = ?`;
      data.query(delAccount, id,(err, result) => {
        if (err) { console.log(err) };
        if (result) {
          res.status(200).json ({ message: `Votre compte utilisateur à bien été supprimé !` }); 
        }
      })
    }
    else {
      res.status(401).json ({ message: "Vous n'êtes pas autorisé à supprimer ce compte !" });
      return;
    };
  });
};