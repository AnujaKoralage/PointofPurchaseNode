import mysql = require("mysql");

export const pool = mysql.createPool({
    connectionLimit : 10,
    host: "localhost",
    port: 3306,
    database: "simplepos",
    user: "root",
    password: ""
});