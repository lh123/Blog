var crypto = require("crypto");
var pool = require("./pool");

var sql = {
    insert: "insert into blog (content) values (?)",
    update: "update blog set content=? where id=1",
    query: "select * from blog where id=1"
};

function creatOrUpdate(content) {
    return new Promise((resolve, reject) => {
        pool.query(sql.query, (err, results) => {
            if (err) {
                console.error(err.stack);
                return reject(err);
            }
            if (results.length > 0) {
                pool.query(sql.update, [content], (err, results) => {
                    if (err) {
                        console.error(err.stack);
                        return reject(err);
                    }
                    return resolve({ id: 1, content });
                })
            } else {
                pool.query(sql.insert, [content], (err, results) => {
                    if (err) {
                        console.error(err.stack);
                        return reject(err);
                    }
                    return resolve({ id: results.insertId, content });
                })
            }
        })
    })
}

function getBlogInfo(){
    return new Promise((resolve, reject) => {
        pool.query(sql.query,(err,results)=>{
            if (err) {
                console.error(err.stack);
                return reject(err);
            }
            return resolve(results[0]);
        })
    });
}

module.exports = {
    creatOrUpdate,
    getBlogInfo
}
