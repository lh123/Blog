const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./src/main.js",
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/dist/",
        filename: "build.js"
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
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'img/[name].[ext]?[hash]'
                }
            }
        ]
    },
    externals:{
        highlight:"hljs"
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        inline: true
    },
};