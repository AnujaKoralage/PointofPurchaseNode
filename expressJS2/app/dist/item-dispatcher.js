"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const express = require("express");
const router = express.Router();
exports.default = router;
router.use(express.json());
let conneaction;
mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    port: 3306,
    database: "simplepos",
    user: "root",
    password: ""
}).getConnection((err, connection) => {
    if (err) {
        console.log(err);
        return;
    }
    conneaction = connection;
});
router.get("", (req, res) => {
    conneaction.query("select * from item", (err, results) => {
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
router.get("/:code", (req, res) => {
    let sql = "select * from item where code=?";
    sql = conneaction.format(sql, [req.params.code]);
    conneaction.query(sql, (err, results) => {
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
router.delete("/:id", (req, res) => {
    let sql0 = "select count(code) as cnt from item where code=?";
    sql0 = conneaction.format(sql0, [req.params.id]);
    conneaction.query(sql0, (err, results) => {
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
        let sql = "delete from item where code=?";
        sql = conneaction.format(sql, [req.params.id]);
        conneaction.query(sql, (err, results) => {
            if (err) {
                console.log('unable to delete item');
                res.sendStatus(500);
                return;
            }
            res.sendStatus(204);
        });
    });
});
router.put("/:code", (req, res) => {
    let sql0 = "select count(code) as cnt from item where code=?";
    sql0 = conneaction.format(sql0, [req.params.code]);
    conneaction.query(sql0, (err, results) => {
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
        let sql = "update item set description=?,qty=?,price=? where code=?";
        sql = conneaction.format(sql, [req.body.description, req.body.qty, req.body.price, req.params.code]);
        conneaction.query(sql, (err1, results1) => {
            if (err) {
                console.log(err1);
                res.sendStatus(500);
                return;
            }
            res.sendStatus(results1.affectedRows > 0 ? 204 : 500);
        });
    });
});
router.post("", (req, res) => {
    // if (!(("id" in req.body) && ("name" in req.body) && ("address" in req.body))){
    //     res.sendStatus(400);
    //     return;
    // }
    let sql = "insert into item values (?,?,?,?)";
    sql = conneaction.format(sql, [req.body.code, req.body.description, req.body.qty, req.body.price]);
    conneaction.query(sql, (err, results) => {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
        }
        res.sendStatus(results.affectedRows > 0 ? 201 : 500);
    });
});
