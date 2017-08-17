const path = require("path");
const webpack = require("webpack");
const HTMLPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

var assetsSubPath = "static";
var publicPath = "/";

module.exports = {
    entry: {
        app: "./src/main.js",
        vendor: ["vue", "vuex", "axios", "marked"]
    },
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/",
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
                            use: 'css-loader',
                            fallback: 'vue-style-loader' // <- 这是vue-loader的依赖，所以如果使用npm3，则不需要显式安装
                        })
                    }
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: path.join(__dirname, "src")
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({ use: "css-loader", fallback: "style-loader" })
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: path.join(assetsSubPath, 'fonts/[name].[hash].[ext]'),
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: path.join(assetsSubPath, 'img/[name].[hash].[ext]'),
                }
            }
        ]
    },
    externals: {
        highlight: "hljs",
        "SimpleMDE": "SimpleMDE"
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
        new ExtractTextPlugin({
            filename: path.join(assetsSubPath, "css/[name].[chunkhash].css")
        }),
        new CopyPlugin([{
            from: path.resolve(__dirname, "static"),
            to: path.resolve(__dirname, "dist", assetsSubPath)
        }]),
        new HTMLPlugin({
            filename: path.resolve(__dirname, "dist/index.html"),
            template: path.resolve(__dirname, "index.html"),
            inject: true
        })
    ]
};