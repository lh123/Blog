const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

var publicPath = "/";
var assetsSubPath = "static";

module.exports = {
    entry: {
        app: "./src/main.js",
        vendor: ["vue", "vue-router", "axios", "marked"]
    },
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath,
        filename: path.join(assetsSubPath, "js/[name].[chunkhash].js"),
        chunkFilename: path.join(assetsSubPath, "js/[id].[chunkhash].js")
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            use: "css-loader",
                            fallback: "vue-style-loader"
                        })
                    }
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: path.resolve(__dirname, "src")
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
            from: path.resolve(__dirname, "static"),
            to: path.resolve(__dirname, "dist", assetsSubPath)
        }]),
        new ExtractTextPlugin({
            filename: path.join(assetsSubPath, "css/[name].[chunkhash].css")
        }),
        new HtmlPlugin({
            filename: path.resolve(__dirname, "dist/index.html"),
            template: path.resolve(__dirname, "index.html"),
            inject: true
        })
    ]
};