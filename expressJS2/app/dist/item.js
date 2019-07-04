"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mysql = require("mysql");
var app = express();
app.use(express.json());
var conneaction = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    port: 3306,
    database: "simplepos",
    user: "root",
    password: ""
});
app.get("/api/v1/items", function (req, res) {
    conneaction.query("select * from item", function (err, results) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        else {
            res.json(results);
        }
    });
});
app.get("/api/v1/item/:code", function (req, res) {
    var sql = "select * from item where code=?";
    sql = conneaction.format(sql, [req.params.code]);
    conneaction.query(sql, function (err, results) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        else {
            if (results.length === 0) {
                res.sendStatus(404);
                return;
            }
            res.json(results);
        }
    });
});
app.delete("/api/v1/item/:id", function (req, res) {
    var sql0 = "select count(code) as cnt from item where code=?";
    sql0 = conneaction.format(sql0, [req.params.id]);
    conneaction.query(sql0, function (err, results) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        if (results[0].cnt <= 0) {
            console.log('unable to delete item');
            res.sendStatus(400);
            return;
        }
        var sql = "delete from item where code=?";
        sql = conneaction.format(sql, [req.params.id]);
        conneaction.query(sql, function (err, results) {
            if (err) {
                console.log('unable to delete item');
                res.sendStatus(500);
                return;
            }
            res.sendStatus(204);
        });
    });
});
app.put("/api/v1/item/:code", function (req, res) {
    var sql0 = "select count(code) as cnt from item where code=?";
    sql0 = conneaction.format(sql0, [req.params.code]);
    conneaction.query(sql0, function (err, results) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        if (results[0].cnt <= 0) {
            console.log('unable to update item');
            res.sendStatus(400);
            return;
        }
        var sql = "update item set description=?,qty=?,price=? where code=?";
        sql = conneaction.format(sql, [req.body.description, req.body.qty, req.body.price, req.params.code]);
        conneaction.query(sql, function (err1, results1) {
            if (err) {
                console.log(err1);
                res.sendStatus(500);
                return;
            }
            res.sendStatus(results1.affectedRows > 0 ? 204 : 500);
        });
    });
});
app.post("/api/v1/item", function (req, res) {
    // if (!(("id" in req.body) && ("name" in req.body) && ("address" in req.body))){
    //     res.sendStatus(400);
    //     return;
    // }
    var sql = "insert into item values (?,?,?,?)";
    sql = conneaction.format(sql, [req.body.code, req.body.description, req.body.qty, req.body.price]);
    conneaction.query(sql, function (err, results) {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
        }
        res.sendStatus(results.affectedRows > 0 ? 201 : 500);
    });
});
app.listen(6060, function () {
});
