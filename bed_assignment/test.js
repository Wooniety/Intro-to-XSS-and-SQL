const mysql = require("mysql2"); 
const connection = mysql.createConnection({ 
    host: "aws-buildon-rds.cokyaqjxq7d8.ap-southeast-1.rds.amazonaws.com",  
    port: 3306,
    user: "admin", 
    password: "AWSBuildOn", 
    database: "vouchers",
    dateStrings:true,
    // calling direct inside code  
    connectionLimit: 10,   
    multipleStatements: true,
    // Prevent nested sql statements 
    connectionLimit: 1000,   
    connectTimeout: 60 * 60 * 1000, 
    acquireTimeout: 60 * 60 * 1000, 
    timeout: 60 * 60 * 1000, 
    debug: true 
})

connection.connect(function (err){
    if(err){
        console.log(err)
    }
    else{
        const query = "SELECT * FROM vouchers"
        connection.query(query,(result,error) => {
            connection.end()
            if (error){
                console.log(error)
            }
            else{
                console.log(result)
            }
        })
    }
})