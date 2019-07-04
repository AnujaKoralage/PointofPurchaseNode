"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dbconnection_1 = require("./dbconnection/dbconnection");
const router = express.Router();
exports.default = router;
router.use(express.json());
let conneaction;
dbconnection_1.pool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        return;
    }
    conneaction = connection;
});
router.route("")
    .head((req, res) => {
    let sql0 = "select count(id) as cnt from customer";
    sql0 = conneaction.format(sql0, [req.params.id]);
    conneaction.query(sql0, (err, results) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        res.setHeader("X-count", results[0].cnt);
        res.end();
    });
})
    .get((req, res, next) => {
    if ("page" in req.query && "size" in req.query) {
        conneaction.query("select * from customer limit ?,?", [+req.query.page * req.query.size, +req.query.size], (err, results) => {
            if (err) {
                res.sendStatus(500);
                return;
            }
            conneaction.query("select count(*) as cnt from customer", (err1, results1) => {
                if (err1) {
                    res.sendStatus(500);
                    return;
                }
                res.json(new CustomerPage([], results, {
                    number: +req.query.page,
                    size: +req.query.size,
                    totalElements: results1[0].cnt,
                    totalPages: results1[0].cnt / +req.query.size
                }));
            });
        });
    }
    else {
        next();
    }
})
    .get((req, res) => {
    conneaction.query("select * from customer", (err, results) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        else {
            res.json(results);
        }
    });
})
    .post((req, res) => {
    // if (!(("id" in req.body) && ("name" in req.body) && ("address" in req.body))){
    //     res.sendStatus(400);
    //     return;
    // }
    console.log(req.body);
    let sql = "insert into customer values (?,?,?)";
    sql = conneaction.format(sql, [req.body.id, req.body.name, req.body.address]);
    conneaction.query(sql, (err, results) => {
        if (err) {
            console.log(err.message);
            res.sendStatus(500);
            return;
        }
        res.status(results.affectedRows > 0 ? 201 : 500).json({});
    });
});
router.route("/:id")
    .get((req, res) => {
    let sql = "select * from customer where id=?";
    sql = conneaction.format(sql, [req.params.id]);
    conneaction.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        else {
            res.json(results);
        }
    });
})
    .delete((req, res) => {
    let sql0 = "select count(id) as cnt from customer where id=?";
    sql0 = conneaction.format(sql0, [req.params.id]);
    conneaction.query(sql0, (err, results) => {
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
        let sql = "delete from customer where id=?";
        sql = conneaction.format(sql, [req.params.id]);
        conneaction.query(sql, (err, results) => {
            if (err) {
                console.log('unable to delete customer');
                res.sendStatus(500);
                return;
            }
            res.sendStatus(204);
        });
    });
})
    .put((req, res) => {
    let sql0 = "select count(id) as cnt from customer where id=?";
    sql0 = conneaction.format(sql0, [req.params.id]);
    conneaction.query(sql0, (err, results) => {
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
        let sql = "update customer set name=?,address=? where id=?";
        sql = conneaction.format(sql, [req.body.name, req.body.address, req.params.id]);
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
class CustomerPage {
    constructor(links, content, page) {
        this.links = links;
        this.content = content;
        this.page = page;
    }
}
