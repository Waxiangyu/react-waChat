const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");//生成新的html文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');//分离css和js
const CleanWebpackPlugin = require('clean-webpack-plugin');//清缓存

const srcDir = __dirname + "/src";
const distDir = __dirname + "/dist";

module.exports = {
    entry: [
        srcDir + "/index.jsx"
    ],
    output: {
        path: distDir,//打包后的文件存放地方
        filename: 'index.[hash:7].js'//打包后输出的文件名
    },
    devtool: 'source-map',
    devServer: {
        contentBase: './public',//本地服务器所加载的页面的目录
        historyApiFallback: true,//不跳转
        inline: true,//实时刷新
        port: 8090,
        hot: true
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            'env', 'react'
                        ]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,//启用css modules
                            localIdentName: '[name__[local]--[hash:base64:5]]'//指定css的类名格式，避免全局污染
                        }
                    },
                    {
                        loader: "postcss-loader"
                    }
                ]
            },
            // {
            //     test: /\.scss$|\.less$/,
            //     loader: "css-loader!style-loader!less-loader!sass-loader?sourceMap!postcss-loader"
            // },
            {
                test:/\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders:2
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins:[
                                require('autoprefixer')({
                                    browsers:['last 5 version']
                                })
                            ]
                        }

                    },
                    {
                        loader: "less-loader"
                    }
                ]
            },
            {
                test:/\.scss$/,
                use:[
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoader:1,
                        }
                    },
                    {
                        loader: "sass-loader"
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins:[
                                require('autoprefixer')({
                                    browsers:['last 5 version']
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|woff|svg|eot|woff2|tff)$/,
                use: 'url-loader?limit=8129',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        require('autoprefixer'),
        new HtmlWebpackPlugin({//根据模板引入css,js最终生成的html文件
            filename: 'index.html',//生成文件存放路径
            template: './public/index.html',//html模板路径
        }),
        new webpack.HotModuleReplacementPlugin(),//热加载插件
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),//压缩
        // new ExtractTextPlugin('style.css'),
        new CleanWebpackPlugin('dist/*.*', {
            root: __dirname,
            verbose: true,
            dry: false
        })
    ]
};