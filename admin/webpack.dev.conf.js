const path = require("path");
const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

var assetSubPath = "static";
var publicPath = "/";

module.exports = {
    entry: {
        app: "./src/main.js"
    },
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath,
        filename: path.join(assetSubPath, "js/[name].[hash].js"),
        chunkFilename: path.join(assetSubPath, "js/[id].[hash].js")
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
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: path.join(assetSubPath, 'fonts/[name].[hash].[ext]')
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: path.join(assetSubPath, 'img/[name].[hash].[ext]')
                }
            }
        ]
    },
    externals: {
        highlight: "hljs",
        "SimpleMDE": "SimpleMDE"
    },
    plugins: [
        new HTMLPlugin({
            filename: path.resolve(__dirname,"dist/index.html"),
            template: path.resolve(__dirname,"index.html"),
            inject: true
        })
    ],
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        inline: true
    },
};