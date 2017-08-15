var express = require("express");
var tokenVerify = require("../../middleware/tokenVerify");
var utlis = require("../../utils/index");
var tagdao = require("../../db/tagdao");

var router = express.Router();

router.post("/createTag", tokenVerify, function (req, res) {
    var name = req.body.name;
    if (name === undefined) {
        return utlis.sendError(res, 400, "标签名不能为空");
    }
    tagdao.createTag(name)
        .then(tag => {
            utlis.sendSuccess(res, tag);
        })
        .catch(err => utlis.sendError(res, err));
});

router.post("/deleteTag", tokenVerify, function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    if (id) {
        tagdao.deleteTag(id)
            .then(() => utlis.sendSuccess(res))
            .catch(err => utlis.sendError(res, err));
    } else {
        tagdao.findTagByName(name)
            .then(tag => {
                return tagdao.deleteTag(tag.id);
            })
            .then(() => utlis.sendSuccess(res))
            .catch(err => utlis.sendError(res, err));
    }
});

router.get("/tagList", function (req, res) {
    const qStartWith = req.query["start-with"];
    if (undefined !== qStartWith) {
        var reg = "^" + qStartWith
        return tagdao.findTagByRegexp(reg)
            .then(tags => {
                utlis.sendSuccess(res, tags);
            })
            .catch(err => utlis.sendError(res, err));
    } else {
        tagdao.findAll()
            .then(tags => {
                utlis.sendSuccess(res, tags);
            })
            .catch(err => utlis.sendError(res, err));
    }
});

router.post("/modifyTag", function (req, res) {
    var tagName = req.body.name;
    var tagId = req.query.id;
    if (tagName === undefined) {
        return utlis.sendError(res, 400, "标签名不能为空");
    }
    tagdao.modify(tagName,tagId)
        .then(tag =>{
            utlis.sendSuccess(res,tag);
        })
        .catch(err => utlis.sendError(res,err));
});

module.exports = router;