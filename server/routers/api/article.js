"use strict"

var express = require("express");
var tokenVerify = require("../../middleware/tokenVerify");

var articledao = require("../../db/articledao");
var utils = require("../../utils/index");

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
    var tagId = req.query.tag;
    if (tagId) {
        articledao.findArticleByTag(tagId)
            .then(articles => {
                utils.sendSuccess(res, articles);
            })
            .catch(err => utils.sendError(res, err));
    } else {
        var page = parseInt(req.query.page || 0);
        var limit = parseInt(req.query.limit || 10);
        var skip = page * limit;
        articledao.findAllArticle(-1, skip, limit)
            .then(articles => {
                utils.sendSuccess(res, articles);
            })
            .catch(err => utils.sendError(res, err));
    }
});

router.get("/articleDetail", function (req, res) {
    const id = req.query.id;
    articledao.findArticleById(id)
        .then(article => {
            utils.sendSuccess(res, article)
        })
        .catch(err => utils.sendError(res, err));
});

// router.post("/modifyArticle", tokenVerify, function (req, res) {
//     const id = req.query.id;
//     var title = req.body.title;
//     var content = req.body.content;
//     var summary = req.body.summary;
//     var tags = [];
//     if (req.body.tags) {
//         req.body.tags.forEach(value => tags.push(value));
//     }
//     var lastModify = Date.now();
//     var hidden = req.body.hidden;
//     var modifyOpt = {
//         "$set": {
//             title, content, summary, tags, lastModify, hidden
//         }
//     }
//     for (key in modifyOpt["$set"]) {
//         if (modifyOpt["$set"][key] === undefined) {
//             delete modifyOpt["$set"][key];
//         }
//     }
//     Article.findOneAndUpdate({ _id: id }, modifyOpt, { new: true }).exec()
//         .catch(err => {
//             if (err.name === "CastError") {
//                 return Promise.reject(utils.ApiError(400, "id不存在"));
//             } else {
//                 return Promise.reject(utils.ApiError(500, "内部错误"));
//             }
//         })
//         .then(article => {
//             article = article.toObject();
//             utils.sendSuccess(res, article);
//         })
//         .catch(err => utils.sendError(res, err));
// });

// router.get("/hiddenArticleList", tokenVerify, function (req, res) {
//     const limit = req.query.limit || 10;
//     const page = req.query.page || 0;
//     let skip = page * limit;
//     let articleArr = [];
//     Article.find({ hidden: true }).select("title summary tags createTime lastModify visits")
//         .populate("tags")
//         .sort({ createTime: -1 })
//         .limit(limit).skip(skip).exec().catch(err => Promise.reject(utils.ApiError(500, "内部错误")))
//         .then(articles => {
//             articles.forEach(value => articleArr.push(value.toObject()));
//             return Article.count().exec().catch(err => Promise.reject(utils.ApiError(500, "内部错误")));
//         })
//         .then(num => {
//             utils.sendSuccess(res, { articles: articleArr, total: num });
//         })
//         .catch(err => {
//             utils.sendError(res, err);
//         });
// });

// router.get("/hiddenArticleDetail", tokenVerify, function (req, res) {
//     const id = req.query.id;
//     Article.findOne({ _id: id, hidden: true })
//         .select("title content summary tags createTime lastModify visits")
//         .populate("tags").exec().catch(err => Promise.reject(utils.ApiError(500, "内部错误")))
//         .then(article => {
//             if (article) {
//                 return Promise.resolve(article.toObject());
//             } else {
//                 return Promise.reject(utils.ApiError(400, "id不存在"));
//             }
//         })
//         .then(articleDetail => utils.sendSuccess(res, articleDetail))
//         .catch(err => utils.sendError(res, err));
// });

module.exports = router;