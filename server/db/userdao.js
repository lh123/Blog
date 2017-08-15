var pool = require("./pool");
var crypto = require("crypto");

var usersql = {
    insert: "insert into user (id,username,password,salt,createOn) values (0,?,?,?,?)",
    update: "update user set username=?,password=?,salt=?,createOn=? where id=?",
    delete: "delete from user where id=?",
    queryById: "select * from user where id=?",
    queryByName: "select * from user where username=?",
    queryAll: "select * from user"
}

function insertUser(username, password) {
    return new Promise(function (resolve, reject) {
        var salt = crypto.randomBytes(16).toString("hex");
        password = crypto.createHash("md5").update(password + salt).digest("hex");
        pool.query(usersql.insert, [username, password, salt, new Date()], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
}

function findById(id) {
    return new Promise((resolve, reject) => {
        pool.query(usersql.queryById, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            }
        });
    })
}

function findByName(name) {
    return new Promise((resolve, reject) => {
        pool.query(usersql.queryByName, [name], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
}

module.exports = {
    insertUser,
    findById,
    findByName
}