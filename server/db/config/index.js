var str = process.env.MYSQLCONNSTR_localdb;
var reg = str.match(/Database=(.+?);Data Source=(.+?):(.+?);User Id=(.+?);Password=(.+)/);
var database = reg[1];
var host = reg[2];
var port = reg[3];
var user = reg[4];
var password = reg[5];

module.exports = {
    mysql: {
        host,
        user,
        password,
        database,
        port,
    }
}