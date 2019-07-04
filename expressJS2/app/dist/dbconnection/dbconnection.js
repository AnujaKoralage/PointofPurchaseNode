"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
exports.pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    port: 3306,
    database: "simplepos",
    user: "root",
    password: ""
});
