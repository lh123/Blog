var express = require("express");
var tokenVerify = require("../../middleware/tokenVerify");

var draftdao = require("../../db/draftdao");
var utils = require("../../utils/index");

var router = express.Router();

router.post("/createDrafts", tokenVerify, function (req, res) {
    var title = req.body.title;
    var content = "";
    var summary = "";
    var user = req.body.user.id;
    var tags = [];
    var isPublish = false;
    if (!title) {
        return res.json({ code: 400, msg: "标题不能为空" });
    }
    draftdao.createDraft(title, user, content, summary)
        .then(id => {
            utils.sendSuccess(res, id);
        })
        .catch(err => utils.sendError(res, 500, "内部错误"));
});

router.get("/draftsList", tokenVerify, function (req, res) {
    var tag = req.query.tag;
    if (tag) {
        draftdao.findDraftByTag(tag)
            .then(results => {
                utils.sendSuccess(res, results);
            })
            .catch(err => utils.sendError(res, err));
    } else {
        draftdao.findAllDraft(-1)
            .then(results => {
                utils.sendSuccess(res, results);
            })
            .catch(err => utils.sendError(res, err));
    }
});

router.get("/draftDetail", tokenVerify, function (req, res) {
    const id = req.query.id;
    if (id === undefined) {
        return res.json({ code: 400, msg: "id不能为空" });
    }
    draftdao.findDraftById(id)
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
    var tags = req.body.tags;
    var summary;
    if (content) {
        let contentArr = content.split("<!-- more -->");
        if (contentArr.length > 1) {
            summary = contentArr[0];
        }
    }
    var lastModify = new Date();
    var isPublish = false;
    var modifyOpt = {
        title,
        content,
        summary,
        tags,
        lastModify,
        isPublish
    };
    draftdao.modify(modifyOpt, id)
        .then(results => {
            utils.sendSuccess(res);
        })
        .catch(err => {
            utils.sendError(res, err);
        });
});

router.post("/deleteDraft", tokenVerify, function (req, res) {
    const id = req.query.id;
    draftdao.findDraftById(id)
        .then(draft => {
            if (!draft) {
                return Promise.reject(utils.ApiError(400, "id不存在"));
            }
            if (draft.article) {
                return Promise.reject(utils.ApiError(400, "已发布的草稿无法删除"));
            }
            return draftdao.deleteDraft(id).catch(err => Promise.reject(utils.ApiError(500, "内部错误")));
        })
        .then(() => utils.sendSuccess(res))
        .catch(err => utils.sendError(res, err));
});

module.exports = router;