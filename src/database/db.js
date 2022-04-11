const mysql = require("mysql");
const config = require("config");

const connection = mysql.createConnection({
    host: config.get("DB_HOST"),
    port: config.get("DB_PORT"),
    user: config.get("DB_USERNAME"),
    password: config.get('DB_PASSWORD'),
    database: config.get('DB_DATABASE')
});

module.exports = connection;