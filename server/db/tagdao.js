var pool = require("./pool");
var crypto = require("crypto");

var sql = {
    insert: "insert into tag (name) values (?)",
    update: "update tag set name=? where id=?",
    delete: "delete from tag where id=?",
    queryById: "select * from tag where id=?",
    queryByName: "select * from tag where name=?",
    queryAll: "select * from tag"
}

function createTag(name) {
    return findTagByName(name)
        .then(tag => {
            if (tag) {
                return Promise.reject(new Error("标签名不能相同"));
            }
            return new Promise((resolve, reject) => {
                pool.query(sql.insert, [name], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: results.insertId, name });
                    }
                });
            });
        });
}

function findAll(){
    return new Promise((resolve, reject) => {
        pool.query(sql.queryAll, (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    }); 
}

function findTagById(id) {
    return new Promise((resolve, reject) => {
        pool.query(sql.queryById, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

function findTagByName(name) {
    return new Promise((resolve, reject) => {
        pool.query(sql.queryByName, [name], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

function findTagByRegexp(reg){
    return new Promise((resolve, reject) => {
        var sqlstr = "select * from tag where name regexp ?"
        pool.query(sqlstr, [reg], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

function deleteTag(id) {
    return new Promise((resolve, reject) => {
        pool.query(sql.delete, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}

function modify(name, id) {
    return findTagById(id)
        .then(tag => {
            if (!tag) {
                return Promise.reject(new Error("id不存在"));
            }
            return new Promise((resolve, reject) => {
                pool.query(sql.update, [name], (err, results) => {
                    if (err) {
                        return reject(new Error("内部错误"));
                    } else {
                        return resolve({ id, name });
                    }
                });
            });
        });
}

module.exports = {
    createTag,
    findAll,
    findTagById,
    findTagByName,
    findTagByRegexp,
    modify,
    deleteTag
}