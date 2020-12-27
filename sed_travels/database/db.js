const mysql = require("mysql2");
const sqlite = require("sqlite3").verbose();
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
