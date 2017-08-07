var mongoose = require("mongoose");

var blog = new mongoose.Schema({
    title: { type: String, required: true, default: "MyBlog" },
    describe: { type: String, required: true, default: "No Desc" },
})

module.exports = mongoose.model("blog", blog);