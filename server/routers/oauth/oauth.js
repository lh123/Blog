var express = require("express");
var User = require("../../models/user");
var OAuth = require("../../models/auth");
var crypto = require("crypto");
var ApiError = require("../apierror");

var router = express.Router();

router.post("/register", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username == null || password == null) {
        res.json({
            msg: "missing username or password"
        });
        return;
    }
    var salt = crypto.randomBytes(16).toString("hex");
    var user = new User();
    user.username = username;
    user.salt = salt;
    user.password = crypto.createHash("md5").update(password + salt).digest("hex");
    User.find({ username: username })
        .then(function (data) {
            if (data.length == 0) {
                return User.find({ isAdmin: true });
            } else {
                return Promise.reject(new ApiError(400, "用户已经存在"));
            }
        })
        .then(function (data) {
            if (data.length == 0) {
                user.isAdmin = true;
            } else {
                user.isAdmin = false;
            }
            return user.save();
        }).then(function (data) {
            res.json({
                code: 0,
                msg: "success"
            });
        }).catch(function (err) {
            res.json({
                code: err.code || 500,
                msg: err.message
            });
        });
});

router.post("/login", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username == null || password == null) {
        res.json({
            code: 400,
            msg: "missing username or password"
        });
        return;
    }
    User.findOne({ username: username })
        .then(function (user) {
            if (user == null) {
                return Promise.reject(new ApiError(400, "用户不存在"));
            }
            var hashedPass = crypto.createHash("md5").update(password + user.salt).digest("hex");
            if (hashedPass === user.password) {
                return Promise.resolve(user);
            } else {
                return Promise.reject(new ApiError(400, "密码错误"))
            }
        })
        .then(function (user) {
            var accessToken = crypto.createHash("md5").update(user.username + crypto.randomBytes(8)).digest("hex");
            var refreshToken = crypto.createHash("md5").update(user.username + crypto.randomBytes(8)).digest("hex");
            var oauth = {};
            oauth.access_token = accessToken;
            oauth.refresh_token = refreshToken;
            var date = new Date();
            date.setDate(date.getDate() + 1);
            oauth.expires = date;
            oauth.user_id = user._id;
            return new Promise(function (resolve, reject) {
                OAuth.findOneAndUpdate({ user_id: user._id }, oauth, { upsert: true })
                    .then(function () {
                        resolve({
                            access_token: oauth.access_token,
                            refresh_token: oauth.refresh_token,
                            expires: oauth.expires
                        });
                    }).catch(err => reject(new ApiError(500, "内部错误")));
            });
        })
        .then(function (result) {
            res.json({
                code: 0,
                msg: "success",
                data: result
            });
        })
        .catch(function (error) {
            res.json({
                code: error.code || 500,
                msg: error.message
            });
        });
});

router.get("/refresh_token", function (req, res) {
    var refresh_token = req.query.refresh_token;
    if (refresh_token == null) {
        return res.json({
            msg: "缺少refresh_token参数"
        });
    }
    OAuth.findOne({ refresh_token: refresh_token })
        .then(data => {
            if (data == null) {
                return Promise.reject(new ApiError(400, "refresh_token不存在"));
            } else {
                return Promise.resolve(data._id);
            }
        })
        .then(id => {
            var accessToken = crypto.randomBytes(16).toString("hex");
            var refreshToken = crypto.randomBytes(16).toString("hex");
            var date = new Date();
            date.setDate(date.getDate() + 1);
            return new Promise((resolve, reject) => {
                OAuth.findByIdAndUpdate(id, { access_token: accessToken, refresh_token: refreshToken, expires: date })
                    .then(() => resolve({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                        expires: date
                    }))
                    .catch(err => reject(err));
            });
        })
        .then(data => {
            res.json({
                code: 0,
                msg: "success",
                data
            });
        })
        .catch(err => {
            res.json({
                code: err.code || 500,
                msg: err.message
            });
        });
});

module.exports = router;