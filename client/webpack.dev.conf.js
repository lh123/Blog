const path = require("path");
const webpack = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");
const utils = require("./utils");

module.exports = {
    entry: {
        app: "./src/main.js"
    },
    devtool: "source-map",
    output: {
        path: utils.assetsRoot,
        publicPath: utils.publicPath,
        filename: "[name].js"
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
                include: utils.resolvePath("src")
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: utils.assetsPath("fonts/[name].[ext]")
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: utils.assetsPath("imgs/[name].[ext]")
                }
            }
        ]
    },
    externals: {
        highlight: "hljs"
    },
    plugins: [
        new HtmlPlugin({
            filename: utils.resolvePath("dist/index.html"),
            template: utils.resolvePath("index.html"),
            inject: true
        })
    ]
};