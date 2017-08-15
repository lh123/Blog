var mysql =require("mysql");
var config =  require("./config/index");

var pool = mysql.createPool(config.mysql);

module.exports = pool;