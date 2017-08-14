var express = require("express");
var Draft = require("../../models/draft");
var ApiError = require("../apierror");
var tokenVerify = require("../../middleware/tokenVerify");

var router = express.Router();

// title: { type: String, required: true },
// user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
// content: { type: String },
// summary: { type: String },
// tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag" }],
// createTime: { type: Date, default: Date.now() },
// lastModify: { type: Date, default: Date.now() },
// article: { type: mongoose.Types.ObjectId, ref: "article" },
// isPublish: { type: Boolean }
router.post("/createDrafts", tokenVerify, function (req, res) {
    var title = req.body.title;
    var content = "";
    var summary = "";
    var user = req.body.user._id;
    var tags = [];
    var isPublish = false;
    if (!title) {
        return res.json({ code: 400, msg: "标题不能为空" });
    }
    var draft = new Draft({
        title,
        user,
        content,
        summary,
        tags,
        isPublish
    });
    draft.save().catch(err => Promise.reject(new ApiError(500, "内部错误")))
        .then(draft => {
            res.json({
                code: 0,
                msg: "success",
                data: draft
            });
        })
        .catch(err => res.json({ code: err.code, msg: err.message }));
});

router.get("/draftsList", tokenVerify, function (req, res) {
    var tag = req.query.tag;
    var queryOpt = {};
    if (undefined !== tag) {
        queryOpt = { tags: { "$all": [tag] } };
    }
    Draft.find(queryOpt).select("title user summary tags createTime lastModify article isPublish")
        .populate("tags")
        .sort({ lastModify: -1 })
        .exec().catch(err => {
            return Promise.reject(new ApiError(500, "内部错误"))
        })
        .then(results => {
            let draftArr = [];
            if (results.length) {
                results.forEach(value => draftArr.push(value.toObject()));
            }
            res.json({
                code: 0,
                msg: "success",
                data: draftArr
            });
        })
        .catch(err => res.json({ code: err.code, msg: err.message }));
});

router.get("/draftDetail", tokenVerify, function (req, res) {
    const id = req.query.id;
    if (id === undefined) {
        return res.json({ code: 400, msg: "id不能为空" });
    }
    Draft.findOne({ _id: id }).select("title user summary tags createTime lastModify article isPublish content")
        .populate("tags")
        .exec().catch(err => Promise.reject(new ApiError(500, "内部错误")))
        .then(data => Promise.resolve(data.toObject()))
        .then(draft => {
            res.json({
                code: 0,
                msg: "success",
                data: draft
            });
        })
        .catch(err => res.json({ code: err.code, msg: err.message }));
});

router.post("/modifyDraft", tokenVerify, function (req, res) {
    const id = req.query.id;
    var title = req.body.title;
    var content = req.body.content;
    var user = req.body.user._id;
    var tags = req.body.tags;
    var summary;
    if (content) {
        let contentArr = content.split("<!-- more -->");
        if (contentArr.length > 1) {
            summary = contentArr[0];
        }
    }
    var lastModify = Date.now();
    var isPublish = false;
    var modifyOpt = {
        title,
        content,
        tags,
        user,
        summary,
        lastModify,
        isPublish
    };
    for (key in modifyOpt) {
        if (modifyOpt[key] === undefined) {
            delete modifyOpt[key];
        }
    }
    Draft.findByIdAndUpdate(id, { "$set": modifyOpt }, { new: true }).populate("tags").exec()
        .catch(err => {
            if (err.name === "CastError") {
                return Promise.reject(new ApiError(400, "id不存在"));
            } else {
                return Promise.reject(new ApiError(500, "内部错误"));
            }
        })
        .then(result => Promise.resolve(result.toObject()))
        .then(draft => {
            res.json({
                code: 0,
                msg: "success",
                data: draft
            });
        })
        .catch(err => res.json({ code: err.code, msg: err.message }));
});

router.post("/deleteDraft", tokenVerify, function (req, res) {
    const id = req.query.id;
    Draft.findOne({ _id: id })
        .select("article").exec().catch(err => Promise.reject(new ApiError(500, "内部错误")))
        .then(draft => {
            if (!draft) {
                return Promise.reject(new ApiError(400, "id不存在"));
            }
            if (draft.article) {
                return Promise.reject(new ApiError(400, "已发布的草稿无法删除"));
            }
            return Draft.remove({ _id: id }).exec().catch(err => Promise.reject(new ApiError(500, "内部错误")));
        })
        .then(() => res.json({ code: 0, msg: "success" }))
        .catch(err => res.json({ code: err.code, msg: err.message }));
});

module.exports = router;