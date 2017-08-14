var express = require("express");
var Tag = require("../../models/tag");
var ApiError = require("../apierror");
var tokenVerify = require("../../middleware/tokenVerify");
var utlis = require("../../utils/index");

var router = express.Router();

router.post("/createTag", tokenVerify, function (req, res) {
    var name = req.body.name;
    if (name === undefined) {
        return res.json({ code: 400, msg: "标签名不能为空" });
    }
    Tag.findOne({ name })
        .catch(err => Promise.reject(new ApiError(500, "内部错误")))
        .then(tag => {
            if (tag) {
                return Promise.reject(new ApiError(400, "标签已存在"));
            } else {
                var tag = new Tag({ name });
                return tag.save()
                    .catch(err => Promise.reject(new ApiError(500, "内部错误")));
            }
        })
        .then(tag => {
            res.json({ code: 0, msg: "success", data: tag });
        })
        .catch(err => {
            res.json({ code: err.code, msg: err.message });
        });
});

router.post("/deleteTag", tokenVerify, function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    if (id) {
        Tag.findByIdAndRemove(id)
            .catch(err => {
                if (err.name === "CastError") {
                    return Promise.reject(new ApiError(400, "id不存在"));
                } else {
                    return Promise.reject(new ApiError(500, "内部错误"));
                }
            })
            .then((tag) => {
                if (!tag) {
                    return Promise.reject(new ApiError(400, "id不存在"));
                }
                res.json({ code: 0, ms: "success" });
            })
            .catch(err => {
                res.json({ code: err.code, msg: err.message });
            });
    } else {
        Tag.findOneAndRemove({ name })
            .catch(err => Promise.reject(new ApiError(500, "内部错误")))
            .then((tag) => {
                if (tag) {
                    res.json({ code: 0, ms: "success" });
                } else {
                    return Promise.reject(new ApiError(400, "标签不存在"));
                }
            })
            .catch(err => {
                res.json({ code: err.code, msg: err.message });
            });
    }
});

router.get("/tagList", function (req, res) {
    const qStartWith = req.query["start-with"];
    if (undefined !== qStartWith) {
        const qOption = {
            name: {
                "$regex": "^" + qStartWith
            }
        };
        Tag.find(qOption)
            .catch(err => {
                Promise.reject(utlis.ApiError(500, "内部错误"));
            })
            .then(tags => {
                var obj = [];
                tags.forEach(tag => obj.push(tag.toObject()));
                res.json({ code: 0, msg: "success", data: obj });
            })
    } else {
        Tag.find()
            .then(tags => {
                var obj = [];
                tags.forEach(tag => obj.push(tag.toObject()));
                res.json({ code: 0, msg: "success", data: obj });
            })
            .catch(err => {
                res.json({ code: 500, msg: "内部错误" });
            })
    }
});

router.post("/modifyTag", function (req, res) {
    var tagName = req.body.name;
    var tagId = req.query.id;
    if (tagName === undefined) {
        return utlis.sendError(res, 400, "标签名不能为空");
    }
    Tag.findOne({ name: tagName })
        .catch(err => {
            Promise.reject(utlis.ApiError(500, "内部错误"));
        })
        .then(tag => {
            if (tag) {
                return Promise.reject(utlis.ApiError(400, "标签不能重名"));
            } else {
                return Tag.findOneAndUpdate({ _id: tagId }, { name:tagName }, { upsert: false, new: true }).catch(err => Promise.reject(utlis.ApiError(500, "内部错误")));
            }
        })
        .then(tag => {
            utlis.sendSuccess(res,tag);
        })
        .catch(err => {
            utlis.sendError(res, err);
        });
});

module.exports = router;