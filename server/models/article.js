var mongoose = require("mongoose");

var articleScheme = new mongoose.Schema({
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    content: { type: String },
    summary: { type: String },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tag" }],
    createTime: { type: Date },
    lastModify: { type: Date, default: Date.now() },
    hidden: { type: Boolean, default: false },
    visits: { type: Number, default: 0 },
});

module.exports = mongoose.model("article", articleScheme);