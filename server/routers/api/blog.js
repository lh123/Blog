var express = require("express");
var tokenVerify = require("../../middleware/tokenVerify");
var blogdao = require("../../db/blogdao");
var utils = require("../../utils/index");

var router = express.Router();

router.get("/blogInfo", function (req, res) {
    blogdao.getBlogInfo()
        .then(info => {
            utils.sendSuccess(res,info);
        })
        .catch(err => utils.sendError(res,err));
});

router.post("/saveBlogInfo", tokenVerify, function (req, res) {
    var content = req.body.content;
    if(!content){
        return utils.sendError(res,400,"content不能为空");
    }
    blogdao.creatOrUpdate(content)
    .then(info => {
        utils.sendSuccess(res,info);
    })
    .catch(err => utils.sendError(res,err));
})

module.exports = router;