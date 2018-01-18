//自身配置
const base = require("./webpack.base.js");
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

let devconfig ={
    devtool: 'eval-source-map',
    entry:{
        hot:'webpack-dev-server/client?http://127.0.0.1:8085',
    },
    output: {
        path: path.join(__dirname,'dist'),
        publicPath:'/dist/',
        libraryTarget: "var",
        filename: '[name]-[hash].js'//打包后输出文件的文件名
    },
    devServer: {
        contentBase: "./",
        // contentBase: ["http://192.168.2.223:8080/","./"],
        host: 'localhost',
        port: 8085, //默认8080
        historyApiFallback:true,
        inline:true,
        hot:true,
        disableHostCheck: true
    },
    module:{
        loaders: [{
            test: /\.less$/,
            loader:'style-loader!css-loader!less-loader'
        },{
            test: /\.css$/,
            loader:'style-loader!css-loader'
        } ,{
            test: /\.js$/,
            loader: 'babel-loader'
        },{
            test: /\.html?$/,
            loader: "html-loader?interpolate=require attrs=img:src img:data-src img:this.src"
        }, {
                //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
                //如下配置，将小于8192byte的图片转成base64码
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=./img/[name]-[hash:4].[ext]'
            },
            {
                //文件加载器，处理文件静态资源
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                // loader: 'file-loader?name=./fonts/[name].[ext]'
                loader: 'file-loader?name=./font/[name].[ext]'
            },
        ]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            baseURL:"'http://localhost:8080/'"
        })
    ]
}

base.expendConfig(devconfig);
module.exports = devconfig;
