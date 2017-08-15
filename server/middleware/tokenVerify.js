var userdao = require("../db/userdao");
var oauthdao = require("../db/oauthdao");
var utils = require("../utils/index");
var ApiError = require("../routers/apierror");

var auth = function (req, res, next) {
    var access_token = req.query.access_token;
    if (!access_token) {
        return res.json({
            code:401,
            msg: "缺失access_token"
        });
    }
    oauthdao.findByAccessToken(access_token)
        .then(oauth => {
            if(oauth === undefined){
                return Promise.reject(utils.ApiError(401, "access_token非法"));
            }
            if (oauth.expires.getTime() < Date.now()) {
                return Promise.reject(utils.ApiError(402, "access_token过期"));
            }
            return userdao.findById(oauth.user_id);
        })
        .then(user => {
            if (!user) {
                return Promise.reject(utils.ApiError(500, "内部错误"));
            } else {
                req.body.user = user;
                return next();
            }
        })
        .catch(err => {
            utils.sendError(res,err);
        });
};

module.exports = auth;