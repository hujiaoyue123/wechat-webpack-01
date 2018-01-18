const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let base= {
    entry:{
        column:'./page/column.js',
        columnList:'./page/columnList.js',
        home:'./page/home.js',
        higherCourse:'./page/higherCourse.js',
        columnVideo:'./page/columnVideo.js',
        liveCourse:'./page/liveCourse.js',
        phoneVideoHis:'./page/phoneVideoHis.js',
        phoneVideoReview:'./page/phoneVideoReview.js',
        login:'./page/login.js',
        aboutUs:'./page/aboutUs.js',
        zixun:'./page/zixun.js',
        InformationDetails:'./page/InformationDetails.js',
        userCenter:'./page/userCenter.js',
        selfCourses: './page/selfCourses.js',
        CoursesShow: './page/CoursesShow.js',
        CoursesVideo: './page/CoursesVideo.js',
        messageTips: './page/messageTips.js'
    },
    plugins:[
		new CleanWebpackPlugin(
			['dist/*.js','dist/*.html',],　 //匹配删除的文件
			{
				root: __dirname,       　　　　　　　　　　//根目录
				verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
				dry:      false        　　　　　　　　　　//启用删除文件
			}
		),
        new webpack.optimize.CommonsChunkPlugin({
            name:'vendors'
        }),
        new HtmlWebpackPlugin({
            filename:"./column.html",
            template:"./tpl/column.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['column','vendors']
        }), new HtmlWebpackPlugin({
            filename:"./columnVideo.html",
            template:"./tpl/columnVideo.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['columnVideo','vendors']
        }),
        new HtmlWebpackPlugin({
            filename:"./zixun.html",
            template:"./tpl/zixun.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['zixun','vendors']
        }),
        new HtmlWebpackPlugin({
            filename:"./InformationDetails.html",
            template:"./tpl/InformationDetails.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['InformationDetails','vendors']
        }),
        new HtmlWebpackPlugin({
            filename:"./login.html",
            template:"./tpl/login.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['login','vendors']
        }), new HtmlWebpackPlugin({
            filename:"./aboutUs.html",
            template:"./tpl/aboutUs.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['aboutUs','vendors']
        }),new HtmlWebpackPlugin({
            filename:"./phoneVideoReview.html",
            template:"./tpl/phoneVideoReview.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['phoneVideoReview','vendors']
        }), new HtmlWebpackPlugin({
            filename:"./phoneVideoHis.html",
            template:"./tpl/phoneVideoHis.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['phoneVideoHis','vendors']
        }), new HtmlWebpackPlugin({
            filename:"./liveCourse.html",
            template:"./tpl/liveCourse.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['liveCourse','vendors']
        }),
        new HtmlWebpackPlugin({
            filename:"./columnList.html",
            template:"./tpl/columnList.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['columnList','vendors']
        }),
        new HtmlWebpackPlugin({
            filename:"./higherCourse.html",
            template:"./tpl/higherCourse.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['higherCourse','vendors']
        }),
        new HtmlWebpackPlugin({
            filename:"./home.html",
            template:"./tpl/home.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['home','vendors']
        }),
        new HtmlWebpackPlugin({
            filename:"./selfCourses.html",
            template:"./tpl/selfCourses.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['selfCourses','vendors']
        }),
        new HtmlWebpackPlugin({
            filename:"./CoursesShow.html",
            template:"./tpl/CoursesShow.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['CoursesShow','vendors']
        }),
        new HtmlWebpackPlugin({
            filename:"./CoursesVideo.html",
            template:"./tpl/CoursesVideo.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['CoursesVideo','vendors']
        }),
         new HtmlWebpackPlugin({
            filename:"./userCenter.html",
            template:"./tpl/userCenter.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['userCenter','vendors']
        }),
        new HtmlWebpackPlugin({
            filename:"./messageTips.html",
            template:"./tpl/messageTips.html",
            inject:true,
            cached:true,
            hash:true,
            chunks:['messageTips','vendors']
        }),
        new CleanWebpackPlugin(
            ['dist/*.js','dist/*.html','dist/*.map',],　 //匹配删除的文件
            {
                root: __dirname,       　　　　　　　　　　//根目录
                verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
                dry:      false        　　　　　　　　　　//启用删除文件
            }
        )
    ]
};

function expendConfig(tagConfig) {
    for(let e in base.entry){
        tagConfig.entry[e] = base.entry[e]
    }

    for(let p of base.plugins){
        tagConfig.plugins.push(p);
    }


    for(let x in base.externals){
        tagConfig.externals[x] = base.externals[x];
    }
    // for(let ex of base.externals){
    //     tagConfig.plugins[ex] = base.externals[ex];
    // }
}
module.exports.expendConfig = expendConfig;
module.exports.config = base;