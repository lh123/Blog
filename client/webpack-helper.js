const path = require("path");

var config = {
    build: {
        assetsRoot: path.join(__dirname, "dist"),
        assetsSubDir: "static",
        publicPath: "/",
    },
    dev: {
        assetsRoot: path.join(__dirname, "dist"),
        assetsSubDir: "static",
        publicPath: "/",
    }
}

var utils = {
    assetsPath: function (_dir) {
        var assetsSubDir;
        if (process.env.NODE_ENV === "production") {
            assetsSubDir = config.build.assetsSubDir;
        } else {
            assetsSubDir = config.dev.assetsSubDir;
        }
        return path.posix.join(assetsSubDir, _dir);
    },
    resolvePath: function (_dir) {
        return path.join(__dirname, _dir);
    }
}



module.exports = {
    config,
    utils
}