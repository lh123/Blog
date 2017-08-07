var express = require("express");

var router = express.Router();

router.get("/",function(req,res){
    res.json({
        msg:"Welcome to api server",
        version:"1.0.0"
    });
});
// router.use("/api",tokenVerify);
router.use("/oauth",require("./oauth/oauth"));
router.use("/api",require("./api/article"));
router.use("/api",require("./api/tag"));
router.use("/api",require("./api/blog"));


module.exports = router;