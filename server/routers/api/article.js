var express = require("express");
var Article = require("../../models/article");
var ApiError = require("../apierror");
var tokenVerify = require("../../middleware/tokenVerify");

var router = express.Router();

// title: { type: String, required: true },
// user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
// content: { type: String },
// tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag" }],
// createTime: { type: Date, default: Date.now() },
// lastModify: { type: Date },
// hidden: { type: Boolean },
// visits: { type: Number, default: 0 }

router.post("/saveArticle", tokenVerify, function (req, res) {
    var title = req.body.title;
    var user = req.body.user._id;
    var content = req.body.content;
    var tags = req.body.tags;
    var hidden = req.body.hidden;
    var isDraft = req.body.isDraft;
    if (!title) {
        return res.json({
            code: 400,
            msg: "标题不能为空"
        });
    }
    if (!content) {
        return res.json({
            code: 400,
            msg: "内容不能为空"
        });
    }
    var article = new Article({ title, user, content, tags, hidden, isDraft });
    article.save()
        .then((article) => {
            res.json({ code: 0, msg: "success", data: article.toObject() });
        })
        .catch((err) => {
            res.json({ code: 500, msg: err.message });
        });
});

router.get("/articleList", function (req, res) {
    /**
     * @query tag  搜索包含指定标签的文章
     * @param page 文章列表页码 从1开始
     * @param limit 每页文章数量
     * */
    var tag = req.query.tag;
    var page = req.query.page || 0;
    var limit = req.query.limit || 10;
    var skip = limit * page;
    var query;
    if (tag === undefined) {
        query = Article.find({ hidden: false });
    } else {
        query = Article.find({ hidden: false, tags: { $all: tag } });
    }
    return query.skip(skip).limit(limit)
        .select("title tags lastModify visits isDraft").exec()
        .then(articles => {
            var results = [];
            articles.forEach(a => {
                results.push(a.toObject());
            });
            res.json({
                code: 0,
                msg: "success",
                data: {
                    articles: results,
                    count: results.length
                }
            });
        })
        .catch(err => {
            res.json({
                code: 500,
                msg: err.message
            });
        });
});

router.get("/articleDetail", function (req, res) {
    var id = req.query.id;
    if (!id) {
        return res.json({ msg: "id不能为空" });
    }
    return Article.findById(id).select("title content user tags lastModify visits isDraft")
        .populate("user", "username")
        .populate("tags")
        .exec()
        .then(article => {
            if (article) {
                var obj = article.toObject();
                res.json({
                    code: 0,
                    msg: "success",
                    data: obj
                });
            } else {
                res.json({
                    code: 400,
                    msg: "文章不存在"
                });
            }
        })
        .catch(err => {
            res.json({
                msg: err.message
            });
        })
});

router.get("/deleteArticle", tokenVerify, function (req, res) {
    var id = req.query.id;
    if (!id) {
        return res.json({ code: 400, msg: "id不能为空" });
    }
    Article.findByIdAndRemove(id).exec()
        .then((data) => {
            if (data) {
                res.json({ code: 0, msg: "success" });
            } else {
                return Promise.reject(new ApiError(400, "id不存在"));
            }
        })
        .catch(err => {
            res.json({ code: err.code || 500, msg: err.message });
        });
});

router.post("/modifyArticle", tokenVerify, function (req, res) {
    var id = req.query.id;
    var title = req.body.title;
    var content = req.body.content;
    var tags = req.body.tags;
    var hidden = req.body.hidden;
    var isDraft = req.body.isDraft;
    if (!id) {
        return res.json({ code: 400, msg: "id不能为空" });
    }
    var obj = {
        id, title, content, tags, hidden, isDraft
    }
    obj.lastModify = Date.now();
    Article.findById(id).exec()
        .catch(err => {
            if (err.name === "CastError") {
                return Promise.reject(new ApiError(400, "id不存在"));
            } else {
                return Promise.reject(new ApiError(500, "内部错误"));
            }
        })
        .then(article => {
            if (!article.isDraft && isDraft) {
                return Promise.reject(new ApiError(400, "修改失败:文章已发布"));
            } else {
                return Article.findByIdAndUpdate(id, { $set: obj }).exec();
            }
        })
        .then(data => {
            if (data) {
                res.json({
                    code: 0,
                    msg: "success"
                });
            } else {
                return Promise.reject(new ApiError(400, "id不存在"));
            }
        })
        .catch(err => {
            res.json({
                code: err.code,
                msg: err.message
            });
        });
});

module.exports = router;