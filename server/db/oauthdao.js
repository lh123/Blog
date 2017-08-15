var crypto = require("crypto");
var pool = require("./pool");

var sql = {
    insert: "draft",
    update: "update oauth set access_token=?,refresh_token=?,expires=? where id=?",
    delete: "delete from oauth where id=?",
    queryByUserId: "select * from oauth where user_id=?",
    queryByAccessToken: "select * from oauth where access_token=?",
    queryByRefreshToken: "select * from oauth where refresh_token=?",
    queryAll: "select * from oauth"
};

function createOauth(username, userId) {
    return new Promise((reslove, reject) => {
        var accessToken = crypto.createHash("md5").update(username + crypto.randomBytes(8)).digest("hex");
        var refreshToken = crypto.createHash("md5").update(username + crypto.randomBytes(8)).digest("hex");
        var expires = new Date();
        expires.setDate(expires.getDate() + 7);
        pool.query(sql.insert, [accessToken, refreshToken, userId, expires], (err, results) => {
            if (err) {
                reject(err);
            } else {
                reslove({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires
                });
            }
        });
    })
}

function findByAccessToken(token) {
    return new Promise((reslove, reject) => {
        pool.query(sql.queryByAccessToken, [token], (err, results) => {
            if (err) {
                reject(err);
            } else {
                reslove(results[0]);
            }
        })
    });
}

function findByUserId(id) {
    return new Promise((reslove, reject) => {
        pool.query(sql.queryByUserId, [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                reslove(results);
            }
        })
    });
}

function findByRefreshToken(token) {
    return new Promise((reslove, reject) => {
        pool.query(sql.queryByRefreshToken, [token], (err, results) => {
            if (err) {
                reject(err);
            } else {
                reslove(results);
            }
        })
    });
}

function createOrUpdateOauth(username, userId) {
    return findByUserId(userId)
        .then(oauths => {
            if (oauths.length === 0) {
                return createOauth(username, userId);
            } else {
                return new Promise((reslove, reject) => {
                    var id = oauths[0].id;
                    var accessToken = crypto.createHash("md5").update(username + crypto.randomBytes(8)).digest("hex");
                    var refreshToken = crypto.createHash("md5").update(username + crypto.randomBytes(8)).digest("hex");
                    var expires = new Date();
                    expires.setDate(expires.getDate() + 7);
                    pool.query(sql.update, [accessToken, refreshToken, expires, id], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            reslove({
                                access_token: accessToken,
                                refresh_token: refreshToken,
                                expires
                            });
                        }
                    });
                });
            }
        });
}

module.exports = {
    createOauth,
    findByAccessToken,
    findByUserId,
    findByRefreshToken,
    createOrUpdateOauth
};