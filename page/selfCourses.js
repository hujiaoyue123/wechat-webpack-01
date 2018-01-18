require('../css/common-mobile.less');
require('../css/selfCourses.less');
require('../lib/userOpenid.js');
require('../lib/zepto.min.js');
require('../lib/common.js');
require('../lib/initFont.js');
require('../font/iconfont.css');

require('../tpl/selfCourses.html');

$('.top-item').on('click',function(){
    $('.top-item').removeClass('choosed');
    $(this).addClass('choosed');
});

$('.all').on('click',function () {
    $('.c-btn').html('立即查看');
});
$('.had').on('click',function () {
    $('.c-btn').html('立即观看');
});
$('body').delegate('.c-btn','click',function () {
    const value = $(this).attr('data');
    const urlParam = `?courseID=${value}`;
    window.location.href = '/dist/CoursesShow.html'+urlParam;
});

const testItem = {
    imgUrl: '',
    coursesName : '龙回头战法',
    coursesTeacher: '主讲老师： 乔立方',
    people: '10000+'
};

const createItem = data => {
    const tpl = `
        <div class="courses-item">
            <div class="left"><img src="${data.imgUrl}" alt="课程介绍"></div>
            <div class="right">
                <div class="c-name">${data.coursesName}</div>
                <div class="c-teacher">${data.coursesTeacher}</div>
                <button class="c-btn" data="${data.id}">立即查看</button>
                <div class="c-bottom">
                    <div class="people">
                        <i class="wechafont icon-zhongren"></i><span class="c-count">${data.people}</span>
                    </div>
                    <span class="hx">弘学教育</span>
                </div>
            </div>
        </div>
        <div class="bar"></div>
    `;
    return tpl;
}
// $('.courses-list').append(createItem(testItem));

const param = {
    startPage: 1,
    ageSize: 99
};

$.get(baseURL+'/course/getCourses.do',param,(result) => {
    const json = JSON.parse(result);
    console.log(json);
    for (let data of json.data) {
        const dmt = {
            coursesName : data.generalCourseName,
            coursesTeacher: "乔立方/范坚强/王伟",
            people: '10000+',
            imgUrl: baseURL + data.courseUrl,
            id: data.id
        };
        $('.courses-list').append(createItem(dmt));
    }
});