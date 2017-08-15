var express = require("express");
var tokenVerify = require("../../middleware/tokenVerify");

var router = express.Router();

router.get("/blogInfo", function (req, res) {
    
});

router.post("/saveBlogInfo", tokenVerify, function (req, res) {

})

module.exports = router;