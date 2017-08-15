"use strict"

var express = require("express");
var tokenVerify = require("../../middleware/tokenVerify");

var draftdao = require("../../db/draftdao");
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
// article: { type: mongoose.Types.ObjectId, ref: "article" },
// isPublish: { type: Boolean }

router.post("/publish", tokenVerify, function (req, res) {
    const draftId = req.query.draftId;
    var user = req.body.user;
    draftdao.findDraftById(draftId)
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
                const article = {
                    title: draft.title,
                    user: user.id,
                    content: draft.content,
                    summary: draft.summary,
                    tags: draft.tags
                };
                return articledao.modify(article, draft.article)
                    .then(() => {
                        return draftdao.modify({ isPublish: true, lastModify: new Date() }, draftId);
                    });
            } else {
                const article = {
                    title: draft.title,
                    user: user.id,
                    createTime: new Date(),
                    content: draft.content,
                    summary: draft.summary,
                    tags: draft.tags,
                    hidden: false,
                    visits: 0,
                };
                return articledao.createArticle(article.title, article.user, article.content, article.summary, article.tags)
                    .then(articleId => {
                        return draftdao.modify({ article: articleId, isPublish: true, lastModify: new Date() }, draftId);
                    });
            }
        })
        .then(() => utils.sendSuccess(res))
        .catch(err => utils.sendError(res, err));
});

module.exports = router;