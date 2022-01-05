const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host : `${process.env.DB_HOST}`,
    user : `${process.env.DB_USER}`,
    password : `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_DATABASE}`,
    port: `${process.env.DB_PORT}`,
})
console.log('---->test mysql ok')
console.log(db)


module.exports.database = () => {
    return db
}