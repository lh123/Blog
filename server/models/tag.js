var mongoose = require("mongoose");

var tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("tag", tagSchema);