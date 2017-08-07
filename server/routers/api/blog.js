var express = require("express");
var BlogInfo = require("../../models/blog");
var ApiError = require("../apierror");
var tokenVerify = require("../../middleware/tokenVerify");

var router = express.Router();

router.get("/blogInfo", function (req, res) {
    BlogInfo.findOne()
        .catch(err => Promise.reject(new ApiError(500, "内部错误")))
        .then(blog => {
            if (blog) {
                return Promise.resolve(blog.toObject());
            } else {
                var info = new BlogInfo();
                return info.save()
                    .catch(err => Promise.reject(new ApiError(500, "内部错误")))
                    .then(data => Promise.resolve(data.toObject()));
            }
        })
        .then(data => {
            res.json({ code: 0, msg: "success", data });
        })
        .catch(err => res.json({ code: err.code, msg: err.message }));
});

router.post("/saveBlogInfo", tokenVerify, function (req, res) {
    var title = req.body.title;
    var describe = req.body.describe;
    BlogInfo.findOneAndUpdate({}, { $set: { title, describe } }, { upsert: true, new: true })
        .then(data => {
            res.json({ code: 0, msg: "success" });
        })
        .catch(err => {
            res.json({ code: 500, msg: "内部错误" });
        })
})

module.exports = router;