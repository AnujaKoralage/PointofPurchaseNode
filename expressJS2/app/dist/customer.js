"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mysql = require("mysql");
var app = express();
app.use(express.json());
var conneaction = mysql.createConnection({
    host: "localhost",
    port: 3306,
    database: "simplepos",
    user: "root",
    password: ""
});
app.get("/api/v1/customers", function (req, res) {
    conneaction.query("select * from customer", function (err, results) {
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
app.get("/api/v1/customer/:id", function (req, res) {
    var sql = "select * from customer where id=?";
    sql = conneaction.format(sql, [req.params.id]);
    conneaction.query(sql, function (err, results) {
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
app.delete("/api/v1/customer/:id", function (req, res) {
    var sql0 = "select count(id) as cnt from customer where id=?";
    sql0 = conneaction.format(sql0, [req.params.id]);
    conneaction.query(sql0, function (err, results) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        if (results[0].cnt <= 0) {
            console.log('unable to delete customer2');
            res.sendStatus(400);
            return;
        }
        var sql = "delete from customer where id=?";
        sql = conneaction.format(sql, [req.params.id]);
        conneaction.query(sql, function (err, results) {
            if (err) {
                console.log('unable to delete customer');
                res.sendStatus(500);
                return;
            }
            res.sendStatus(204);
        });
    });
});
app.put("/api/v1/customer/:id", function (req, res) {
    var sql0 = "select count(id) as cnt from customer where id=?";
    sql0 = conneaction.format(sql0, [req.params.id]);
    conneaction.query(sql0, function (err, results) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        if (results[0].cnt <= 0) {
            console.log('unable to update customer2');
            res.sendStatus(400);
            return;
        }
        var sql = "update customer set name=?,address=? where id=?";
        sql = conneaction.format(sql, [req.body.name, req.body.address, req.params.id]);
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
app.post("/api/v1/customer", function (req, res) {
    // if (!(("id" in req.body) && ("name" in req.body) && ("address" in req.body))){
    //     res.sendStatus(400);
    //     return;
    // }
    console.log(req.body);
    var sql = "insert into customer values (?,?,?)";
    sql = conneaction.format(sql, [req.body.id, req.body.name, req.body.address]);
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
