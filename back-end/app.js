// Déclarations des constantes des dépendencies d'app.js.
const express = require('express');
const helmet = require("helmet");
const morgan = require('morgan');
const path = require('path');
const cors = require('cors')

// Déclaration des routes
const userRoutes = require ('./routes/user');
const postRoutes = require ('./routes/post');

const app = express();

const bodyParser = require ('body-parser');

app.use(morgan("dev"));

app.use((req, res, next) => {
	// CORS headers
	res.setHeader('Access-Control-Allow-Origin', "*");
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Cross-Origin-Resource-Policy","cross-origin")
	next();
});

app.use(cors({ origin: ["http://localhost:8080/", "http://localhost:3000/"] }));

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes principales du site.
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

module.exports = app;