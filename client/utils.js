const path = require("path");

module.exports = {
    assetsRoot: path.join(__dirname, "dist"),
    assetsSubDir: "static",
    publicPath: "/",
    assetsPath: function (_dir) {
        return path.posix.join(this.assetsSubDir, _dir);
    },
    resolvePath: function (_dir) {
        return path.join(__dirname, _dir);
    }
}