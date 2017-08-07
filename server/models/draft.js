var mongoose = require("mongoose");

var draftScheme = new mongoose.Schema({
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    content: { type: String },
    summary: { type: String },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag" }],
    createTime: { type: Date, default: Date.now() },
    lastModify: { type: Date, default: Date.now() },
    article: { type: mongoose.Schema.Types.ObjectId, ref: "article" },
    isPublish: { type: Boolean }
});

module.exports = mongoose.model("draft", draftScheme);