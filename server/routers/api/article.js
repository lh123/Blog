"use strict"

var express = require("express");
var Article = require("../../models/article");
var utils = require("../../utils/index");
var tokenVerify = require("../../middleware/tokenVerify");

var router = express.Router();

// title: { type: String, required: true },
// user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
// content: { type: String },
// summary: { type: String },
// tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag" }],
// createTime: { type: Date, default: Date.now() },
// lastModify: { type: Date, default: Date.now() },
// hidden: { type: Boolean, default: false },
// visits: { type: Number, default: 0 },

router.post("/createArticle", tokenVerify, function (req, res) {
    var title = req.body.title;
    var user = req.body.user._id;
    var content = req.body.content;
    var summary = req.body.summary;
    var tags = [];
    if (req.body.tags) {
        req.body.tags.forEach(value => tags.push(value));
    }
    var createTime = Date.now();
    var lastModify = Date.now();
    var hidden = req.body.hidden;
    var visits = 0;
    if (!title) {
        utils.sendError(res, 400, "标题不能为空");
    }
    if (!(hidden === true || hidden === false)) {
        utils.sendError(res, 400, "hidden字段错误");
    }
    if (!content) {
        utils.sendError(res, 400, "文章内容不能为空");
    }
    const article = new Article({
        title,
        user,
        content,
        summary,
        tags,
        createTime,
        lastModify,
        hidden,
        visits
    });
    article.save().catch(err => utils.sendError(500, "内部错误"))
        .then(result => utils.sendSuccess(res, { id: result._id }));
});

router.get("/articleList", function (req, res) {
    var tag = req.query.tag;
    if (undefined !== tag) {
        Article.find({
            hidden: false,
            tags: { "$all": [tag] }
        }).select("title summary tags createTime lastModify visits")
            .populate("tags")
            .sort({ createTime: -1 })
            .exec().catch(err => utils.sendError(res, 500, "内部错误"))
            .then(arrs => {
                let articleArr = [];
                if (arrs.length > 0) {
                    arrs.forEach(value => articleArr.push(value.toObject()));
                    utils.sendSuccess(res, articleArr);
                }
            });
    } else {
        const limit = parseInt(req.query.limit || 10);
        const page = req.query.page || 0;
        let skip = page * limit;
        let articleArr = [];
        Article.find({ hidden: false }).select("title summary tags createTime lastModify visits")
            .populate("tags")
            .sort({ createTime: -1 })
            .limit(limit).skip(skip).exec().catch(err => Promise.reject(utils.ApiError(500, "内部错误")))
            .then(articles => {
                articles.forEach(value => articleArr.push(value.toObject()));
                return Article.count().exec().catch(err => Promise.reject(utils.ApiError(500, "内部错误")));
            })
            .then(num => {
                utils.sendSuccess(res, { articles: articleArr, total: num });
            })
            .catch(err => {
                utils.sendError(res, err);
            });
    }
});

router.get("/articleDetail", function (req, res) {
    const id = req.query.id;
    // if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    //     return utils.sendError(res, 400, "id字段错误");
    // }
    Article.findOne({ _id: id, hidden: false })
        .select("title content summary tags createTime lastModify visits")
        .populate("tags").exec().catch(err => Promise.reject(utils.ApiError(500, "内部错误")))
        .then(article => {
            if (article) {
                article = article.toObject();
                var nextArticle;
                var preArticle;
                return new Promise(function (resolve, reject) {
                    Promise.all([
                        Article.findOne({ _id: { "$gt": article._id }, hidden: false }).select("title _id")
                            .catch(err => {
                                Promise.reject(utils.ApiError(500, "内部错误"))
                            })
                            .then(next => {
                                preArticle = next ? next.toObject() : null;
                            }),
                        Article.findOne({ _id: { "$lt": article._id }, hidden: false }).sort({ _id: -1 }).select("title _id")
                            .catch(err => {
                                Promise.reject(utils.ApiError(500, "内部错误"))
                            })
                            .then(pre => {
                                nextArticle = pre ? pre.toObject() : null;
                            }),
                    ]).catch(err => reject(err))
                        .then(() => {
                            var articleDetail = {
                                article,
                                nextArticle,
                                preArticle
                            }
                            resolve(articleDetail);
                        });
                });
            }
        })
        .then(articleDetail => utils.sendSuccess(res, articleDetail))
        .catch(err => utils.sendError(res, err));
});

router.post("/modifyArticle", tokenVerify, function (req, res) {
    const id = req.query.id;
    var title = req.body.title;
    var content = req.body.content;
    var summary = req.body.summary;
    var tags = [];
    if (req.body.tags) {
        req.body.tags.forEach(value => tags.push(value));
    }
    var lastModify = Date.now();
    var hidden = req.body.hidden;
    var modifyOpt = {
        "$set": {
            title, content, summary, tags, lastModify, hidden
        }
    }
    for (key in modifyOpt["$set"]) {
        if (modifyOpt["$set"][key] === undefined) {
            delete modifyOpt["$set"][key];
        }
    }
    Article.findOneAndUpdate({ _id: id }, modifyOpt, { new: true }).exec()
        .catch(err => {
            if (err.name === "CastError") {
                return Promise.reject(utils.ApiError(400, "id不存在"));
            } else {
                return Promise.reject(utils.ApiError(500, "内部错误"));
            }
        })
        .then(article => {
            article = article.toObject();
            utils.sendSuccess(res, article);
        })
        .catch(err => utils.sendError(res, err));
});

router.get("/hiddenArticleList", tokenVerify, function (req, res) {
    const limit = req.query.limit || 10;
    const page = req.query.page || 0;
    let skip = page * limit;
    let articleArr = [];
    Article.find({ hidden: true }).select("title summary tags createTime lastModify visits")
        .populate("tags")
        .sort({ createTime: -1 })
        .limit(limit).skip(skip).exec().catch(err => Promise.reject(utils.ApiError(500, "内部错误")))
        .then(articles => {
            articles.forEach(value => articleArr.push(value.toObject()));
            return Article.count().exec().catch(err => Promise.reject(utils.ApiError(500, "内部错误")));
        })
        .then(num => {
            utils.sendSuccess(res, { articles: articleArr, total: num });
        })
        .catch(err => {
            utils.sendError(res, err);
        });
});

router.get("/hiddenArticleDetail", tokenVerify, function (req, res) {
    const id = req.query.id;
    Article.findOne({ _id: id, hidden: true })
        .select("title content summary tags createTime lastModify visits")
        .populate("tags").exec().catch(err => Promise.reject(utils.ApiError(500, "内部错误")))
        .then(article => {
            if (article) {
                return Promise.resolve(article.toObject());
            } else {
                return Promise.reject(utils.ApiError(400, "id不存在"));
            }
        })
        .then(articleDetail => utils.sendSuccess(res, articleDetail))
        .catch(err => utils.sendError(res, err));
});

module.exports = router;