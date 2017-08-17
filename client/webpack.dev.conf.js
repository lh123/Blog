const path = require("path");
const webpack = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");

var publicPath = "/";
var assetsSubPath = "static";

module.exports = {
    entry: "./src/main.js",
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath,
        filename: path.join(assetsSubPath, "js/[name].[hash].js"),
        chunkFilename: path.join(assetsSubPath, "js/[id].[hash].js")
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: path.resolve(__dirname, "src")
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: path.join(assetsSubPath, "fonts/[name].[hash].[ext]")
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: path.join(assetsSubPath, "imgs/[name].[hash].[ext]")
                }
            }
        ]
    },
    externals: {
        highlight: "hljs"
    },
    plugins: [
        new HtmlPlugin({
            filename: path.resolve(__dirname, "dist/index.html"),
            template: path.resolve(__dirname, "index.html"),
            inject: true
        })
    ],
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        inline: true
    },
};