import {Connection, PoolConnection} from "mysql";

export function executeQuery(connection: PoolConnection, sql: string, values: Array<string| number>) {
    return new Promise<{affectedRows:number}>((resolve, reject) => {
        connection.query(sql, values, (err, results) => {
            if (err){
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

export function selectQuery(connection: PoolConnection, sql: string, values: Array<string| number>) {
    return new Promise<{result:number| string}>((resolve, reject) => {
        connection.query(sql, values, (err, results) => {
            if (err){
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}