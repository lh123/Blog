var OAuth = require("../models/auth");
var User = require("../models/user");
var ApiError = require("../routers/apierror");

var auth = function (req, res, next) {
    var access_token = req.query.access_token;
    if (!access_token) {
        return res.json({
            code:401,
            msg: "缺失access_token"
        });
    }
    OAuth.findOne({ access_token })
        .then(data => {
            if (data == null) {
                return Promise.reject(new ApiError(401, "access_token非法"));
            }
            if (data.expires.getTime() < Date.now()) {
                return Promise.reject(new ApiError(402, "access_token过期"));
            }
            return User.findById(data.user_id);
        })
        .then(user => {
            if (user == null) {
                return Promise.reject(new ApiError(500, "内部错误"));
            } else {
                req.body.user = user;
                next();
            }
        })
        .catch(err => {
            res.json({
                code: err.code || 500,
                msg: err.message
            });
        });
};

module.exports = auth;