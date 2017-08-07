var mongoose = require("mongoose");

var oauthScheme = new mongoose.Schema({
    access_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    user_id: { type: String, required: true },
    expires: { type: Date }
});
module.exports = mongoose.model("oauth", oauthScheme);