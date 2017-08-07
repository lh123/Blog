var mongoose = require("mongoose");

var userScheme = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    salt: { type: String },
    createdOn: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("user", userScheme);