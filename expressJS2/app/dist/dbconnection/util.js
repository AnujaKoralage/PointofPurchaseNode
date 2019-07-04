"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function executeQuery(connection, sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.executeQuery = executeQuery;
function selectQuery(connection, sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    });
}
exports.selectQuery = selectQuery;
