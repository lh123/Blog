"use strict"

var express = require("express");
var Article = require("../../models/article");
var Draft = require("../../models/draft");
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
// article: { type: mongoose.Types.ObjectId, ref: "article" },
// isPublish: { type: Boolean }

router.post("/publish", tokenVerify, function (req, res) {
    const draftId = req.query.draftId;
    Draft.findOne({ _id: draftId }).exec().catch(err => Promise.reject(utils.ApiError(500, "内部错误")))
        .then(draft => {
            if (draft) {
                return Promise.resolve(draft);
            } else {
                return Promise.reject(utils.ApiError(400, "草稿不存在"));
            }
        })
        .then(draft => {
            if (!draft.title) {
                return Promise.reject(utils.ApiError(400, "标题不能为空"));
            }
            if (!draft.content) {
                return Promise.reject(utils.ApiError(400, "内容不能为空"));
            }
            if (!draft.summary) {
                return Promise.reject(utils.ApiError(400, "文章摘要不能为空,请在文章中插入'<!-- more -->'以分隔摘要和正文"));
            }
            return Promise.resolve(draft);
        })
        .then(draft => {
            if (draft.article) {
                draft.isPublish = true;
                draft.lastModify = Date.now();
                const articleOption = {
                    title: draft.title,
                    user: draft.user,
                    content: draft.content,
                    summary: draft.summary,
                    tags: draft.tags
                };
                var article = {};
                return new Promise(function (resolve, reject) {
                    Promise.all([
                        draft.save().catch(err => Promise.reject(utils.ApiError(500, "内部错误"))),
                        Article.findByIdAndUpdate(draft.article, { "$set": articleOption }, { new: true }).populate("tags").exec()
                            .catch(err => Promise.reject(utils.ApiError(500, "内部错误")))
                            .then(result => {
                                article = result
                            })
                    ]).catch(err => reject(err)).then(() => resolve(article));
                });
            } else {
                draft.isPublish = true;
                draft.lastModify = Date.now();
                const articleOption = {
                    title: draft.title,
                    user: draft.user,
                    content: draft.content,
                    summary: draft.summary,
                    tags: draft.tags,
                    hidden: false,
                    visits: 0,
                };
                var article = new Article(articleOption);
                return article.save().catch(err => Promise.reject(utils.ApiError(500, "内部错误")))
                    .then(result => {
                        article = result;
                        draft.article = result._id;
                        return draft.save().catch(err => Promise.reject(utils.ApiError(500, "内部错误")));
                    })
                    .then(() => Promise.resolve(article));
            }
        })
        .then(article => utils.sendSuccess(res, article))
        .catch(err => utils.sendError(res, err));
});

module.exports = router;