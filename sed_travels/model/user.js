const db = require("../database/db");
const bcrypt = require("bcrypt");

const dbConn = db.getConnection()

dbConn.query = function (sql, params) {
    var that = this;
    return new Promise(function (resolve, reject) {
        that.all(sql, params, function (error, rows) {
            if (error)
                reject(error);
            else
                resolve({ rows: rows });
        });
    });
};

const generate_hash_password = async (password, salt = null) => {
    if (salt == null) salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(password, salt);
    return [hash, salt];
}

const get_users = async () => {
    const sql = "SELECT userid, username, profile_pic_url, created_at FROM users";
    results = await dbConn.query(sql);
    return results
}

const add_users = async (username, email, profile_pic_url, password,admin=false) => {
    const role = admin? "admin":"user";
    const sql = "INSERT INTO users(username, email, profile_pic_url, password, salt, role) values(?, ?, ?, ?, ?, ?)"
    const [hash, salt] = await generate_hash_password(password);
    results = await dbConn.query(sql, [username, email, profile_pic_url, hash, salt,role]);
    return results.insertId
}

const get_users_by_id = async (userID) => {
    const sql = "SELECT userid, username, profile_pic_url,role created_at FROM users where userid = ?";
    results = await dbConn.query(sql, [userID]);
    return results
}

const update_users = async (userID, username, email, profile_pic_url, password) => {
    const sql = "UPDATE users set username = ?, email = ? , profile_pic_url = ?, password = ?, salt = ? where userID = ?"
    const [hash, salt] = await generate_hash_password(password);
    results = await dbConn.query(sql, [username, email, profile_pic_url, hash, salt, userID]);
    return null

}

const login_user = async (email, password) => {
    const sql = "select email from users where email = '" + email + "'";
    const salt = await dbConn.query(sql,[]);
    const given_hash = await generate_hash_password(password, salt.rows[0].salt);
    const results = await dbConn.query("select password, salt, userid, role, username from users where email = '" + email + "' and password = '" + given_hash[0] + "'",[]);
    if (results.length == 0) throw new Error("Wrong password");
    else {
        return {"message":`Login Successful, welcome user ${results.rows[0].username}`,"user":{"userid":results.rows[0].userid,"role":results.rows[0].role}};
    }
}
// const login_user = async (email, password) => {
//     const results = await dbConn.query("select password, salt, userid, role, username from users where email = ?", [email]);
//     if (results.length == 0) throw new Error("no such user");
//     else {
//         const hash = results.rows[0]["password"];
//         const salt = results.rows[0]["salt"];    
//         const given_hash = await generate_hash_password(password, salt);

//         const match = (hash == given_hash[0]) ? true : false;
//         if (match) return {"message":`Login Successful, welcome user ${results.rows[0].username}`,"user":{"userid":results.rows[0].userid,"role":results.rows[0].role}};
//         else throw new Error("Wrong password");
//     }
// }

module.exports = {
    get_users: get_users,
    add_users: add_users,
    get_users_by_id: get_users_by_id,
    update_users: update_users,
    login_user: login_user
}