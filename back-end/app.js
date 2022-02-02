// Déclarations des constantes des dépendencies d'app.js.
const express = require('express');
const helmet = require("helmet");
const morgan = require('morgan');
const path = require('path');

// Déclaration des routes
const userRoutes = require ('./routes/user');
const postRoutes = require ('./routes/post');

const mysql = require ('./utils/database');
const app = express();

// Importation de body-parser.
const bodyParser = require ('body-parser');

app.use(morgan("dev"));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes principales du site.
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

module.exports = app;