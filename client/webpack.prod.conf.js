const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { config, utils } = require("./webpack-helper")

module.exports = {
    entry: {
        app: "./src/main.js",
        vendor: ["vue", "vue-router", "axios", "marked"]
    },
    devtool: "source-map",
    output: {
        path: config.build.assetsRoot,
        publicPath: config.build.publicPath,
        filename: utils.assetsPath("js/[name].[chunkhash].js"),
        chunkFilename: utils.assetsPath("js/[id].[chunkhash].js")
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: utils.resolvePath("src")
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    use: "css-loader",
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: utils.assetsPath("fonts/[name].[hash].[ext]")
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: utils.assetsPath("imgs/[name].[hash].[ext]")
                }
            }
        ]
    },
    externals: {
        highlight: "hljs"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            chunks: ["vendor"]
        }),
        new CopyPlugin([{
            from: utils.resolvePath("static"),
            to: utils.resolvePath("dist/static")
        }]),
        new ExtractTextPlugin({
            filename: utils.assetsPath("css/[name].[chunkhash].css")
        }),
        new HtmlPlugin({
            filename: utils.resolvePath("dist/index.html"),
            template: utils.resolvePath("index.html"),
            inject: true
        })
    ]
};