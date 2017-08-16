var express = require("express");
var bodyParser = require("body-parser");

var port = process.env.PORT || 7000;
var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "GET,POST,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(require("./routers/index"));

app.use(function (error, req, res, next) {
    if (error) {
        console.error(error);
        res.json({
            code: 500,
            msg: "服务器内部错误"
        });
    }
    next();
});

app.listen(port);
