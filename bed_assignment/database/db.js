/*
Class: DISM/FT/2A/02
Group:
Members:
1. Loh Kar Wei 1904204
2. Jess Kwek 1928934
*/

const mysql = require("mysql2");
const sqlite = require("sqlite3").verbose();
// const dbconnect = {
//     getConnection: ()=>{
//         const conn = mysql.createPool({
//             host:"localhost",
//             port: 3306,
//             user: "pikachu",
//             password: "password",
//             database: "SPTRAVEL"
//         }).promise();
//         return conn;
//     }
// }
const dbconnect = {
    getConnection: ()=>{
        const conn = new sqlite.Database("./sad.sqlite",(err)=>{
            if(err){
                console.log(err);
            }
        })
        return conn;
    }
}

module.exports = dbconnect;
