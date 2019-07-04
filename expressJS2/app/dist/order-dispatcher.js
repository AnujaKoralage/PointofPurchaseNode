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
    .post((req, res) => {
    conneaction.beginTransaction(err => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        let sql1 = "insert into orderdetails values (?,?,?)";
        sql1 = conneaction.format(sql1, [req.body.detailsDTO.orderid, req.body.detailsDTO.cusid, req.body.detailsDTO.orderdate]);
        conneaction.query(sql1, err1 => {
            conneaction.rollback(err2 => {
                console.log("error in details");
                res.sendStatus(500);
                return;
            });
        });
        let sql2 = "insert into orderitems values (?,?,?)";
        let ar = req.body.orderItemDTOS;
        for (let i = 0; i < ar.length; i++) {
            sql2 = conneaction.format(sql2, [ar[i].orderid, ar[i].itemcode, ar[i].qty]);
            conneaction.query(sql2, err1 => {
                if (err1) {
                    console.log("error");
                    res.sendStatus(500);
                    return;
                }
                conneaction.rollback(err2 => {
                    console.log("error in items ");
                    res.sendStatus(500);
                    return;
                });
            });
            let sql3 = "select qty from item where code=?";
            conneaction.query(sql3, [ar[i].itemcode], (err1, results) => {
                if (err1) {
                    console.log("error");
                    res.sendStatus(500);
                    return;
                }
                let newqty = results[0] - Number(ar[i].qty);
                let sql4 = "update item set qty=? where code=?";
                conneaction.query(sql4, [newqty.toString(), ar[i].itemcode], (err2, results1) => {
                    if (err2) {
                        conneaction.rollback(err3 => {
                            console.log("error in update");
                            res.sendStatus(500);
                            return;
                        });
                    }
                });
            });
            if (i == ar.length - 1) {
                conneaction.commit(err1 => {
                    res.sendStatus(500);
                    return;
                });
                res.sendStatus(201).json({});
            }
        }
    });
})
    .get((req, res) => {
    if (req.query.maxid === 'true') {
        conneaction.query("select orderid from orderdetails order by orderid DESC LIMIT 1", (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            res.json(results[0].orderid);
            res.end();
        });
    }
});
// async function placeOrder(connection: PoolConnection, req: Request, res: Response) {
//     try {
//         let result = await executeQuery(connection, "insert into orderdetails values (?,?,?)", [req.body.detailsDTO.orderid, req.body.detailsDTO.cusid, req.body.detailsDTO.orderdate]);
//
//         if (result.affectedRows === 0){
//             connection.rollback();
//             connection.release();
//             res.sendStatus(500);
//             return;
//         }
//         let sql2 = "insert into orderitems values (?,?,?)";
//         let ar: {orderid: string, itemcode: string, qty: string}[] = req.body.orderItemDTOS;
//         for (let i=0;i<ar.length;i++){
//             let result2 = await executeQuery(connection, sql2, [ar[i].orderid, ar[i].itemcode, ar[i].qty]);
//             if (result2.affectedRows === 0) {
//                 connection.rollback();
//                 connection.release();
//                 res.sendStatus(500);
//                 return;
//             }
//             let sql3 = "select qty from item where code=?";
//             let result3 = await executeQuery(connection , sql3, [ar[i].itemcode]);
//             let newqty = result3[0] - Number(ar[i].qty);
//             conneaction.query(sql3, [ar[i].itemcode], (err1, results) => {
//                 if (err1){
//                     console.log("error");
//                     res.sendStatus(500);
//                     return;
//                 }
//                 let newqty = results[0] - Number(ar[i].qty);
//                 let sql4 = "update item set qty=? where code=?";
//                 conneaction.query(sql4, [newqty.toString(), ar[i].itemcode], (err2, results1) => {
//                     if (err2){
//                         conneaction.rollback(err3 => {
//                             console.log("error in update");
//                             res.sendStatus(500);
//                             return;
//                         });
//                     }
//                 });
//             });
//             if (i == ar.length-1){
//                 conneaction.commit(err1 => {
//                     res.sendStatus(500);
//                     return;
//                 });
//                 res.sendStatus(201).json({});
//             }
//         }
//     }
// }
