// Multer pour la gestion multimédia des fichiers du site (ajout et/ou modifications et suppressions dans le dossier "Images").
const multer = require('multer');
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};

const storage = multer.diskStorage({

  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
   
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({ storage }).single('image');