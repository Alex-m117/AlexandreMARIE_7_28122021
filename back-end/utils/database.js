// Mise en relation avec la base de données Mysql.
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host : `${process.env.DB_HOST}`,
    user : `${process.env.DB_USER}`,
    password : `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_DATABASE}`,
    port: `${process.env.DB_PORT}`,
})

db.connect(function(err) {
    if (err) throw err;
    console.log("Base de données connectée")
})

module.exports.database = () => {
    return db
}