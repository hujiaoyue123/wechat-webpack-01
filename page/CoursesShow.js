require('../css/common-mobile.less');
require('../css/CoursesShow.less');
require('../lib/userOpenid.js');
require('../lib/zepto.min.js');
const COM  = require('../lib/common.js');
require('../lib/initFont.js');
require('../tpl/CoursesShow.html');

const urlParam = COM.getUrlObject();

$.post(baseURL+'/course/getGeneralCourseDetail.do',urlParam,(result) => {
    const json = JSON.parse(result);
    let url = json.data.courseDescUrl;
    url = baseURL + url;
    $('.content').append(`<img src="${url}" alt="介绍" />`)
});


