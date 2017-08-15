var express = require("express");
var crypto = require("crypto");
var ApiError = require("../apierror");
var userdao = require("../../db/userdao");
var oauthdao = require("../../db/oauthdao");
var utils = require("../../utils/index");

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
    userdao.findByName(username)
        .then(function (data) {
            if (data.length == 0) {
                return userdao.insertUser(username, password);
            } else {
                return Promise.reject(utils.ApiError(400, "用户已经存在"));
            }
        }).then(function (data) {
            utils.sendSuccess(res, "success");
        }).catch(function (err) {
            utils.sendError(res, err);
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
    userdao.findByName(username)
        .then(users => {
            if (users.length <= 0) {
                return Promise.reject(utils.ApiError(400, "用户不存在"));
            }
            let user = users[0];
            let hashedPass = crypto.createHash("md5").update(password + user.salt).digest("hex");
            if (hashedPass === user.password) {
                return Promise.resolve(user);
            } else {
                return Promise.reject(utils.ApiError(400, "密码错误"))
            }
        })
        .then(function (user) {
            return oauthdao.createOrUpdateOauth(user.username, user.id);
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
    oauthdao.findByRefreshToken(refresh_token)
        .then(oauths => {
            if (oauths.length === 0) {
                return Promise.reject(utils.ApiError(400, "refresh_token不存在"));
            } else {
                return Promise.resolve(oauths[0]);
            }
        })
        .then(oauth => {
            return userdao.findById(oauth.user_id)
                .then(user => {
                    if (user) {
                        return oauthdao.createOrUpdateOauth(user.username, user.id);
                    } else {
                        return Promise.reject(utils.ApiError(500, "内部错误"));
                    }
                })
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