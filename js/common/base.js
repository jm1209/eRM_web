//获取链接参数
UrlParm = function () {
    var b, a;
    (function c() {
        b = [];
        a = {};
        var e = window.location.search.substr(1);
        if (e != "") {
            e = e.replace("*", "&");
            var g = decodeURIComponent(e).split("&");
            for (var f = 0, d = g.length; f < d; f++) {
                if (g[f] != "") {
                    var h = g[f].split("=");
                    if (h.length == 1 || (h.length == 2 && h[1] == "")) {
                        b.push([""]);
                        a[h[0]] = b.length - 1
                    } else {
                        if (typeof(h[0]) == "undefined" || h[0] == "") {
                            b[0] = [h[1]]
                        } else {
                            if (typeof(a[h[0]]) == "undefined") {
                                b.push([h[1]]);
                                a[h[0]] = b.length - 1
                            } else {
                                b[a[h[0]]].push(h[1])
                            }
                        }
                    }
                }
            }
        }
    })();
    return {
        parm: function (f) {
            try {
                return (typeof(f) == "number" ? b[f][0] : b[a[f]][0])
            } catch (d) {
            }
        }, parmValues: function (f) {
            try {
                return (typeof(f) == "number" ? b[f] : b[a[f]])
            } catch (d) {
            }
        }, hasParm: function (d) {
            return typeof(d) == "string" ? typeof(a[d]) != "undefined" : false
        }, parmMap: function () {
            var g = {};
            try {
                for (var f in a) {
                    g[f] = b[a[f]]
                }
            } catch (d) {
            }
            return g
        }
    }
}();


//全局的ajax调用
// var interfaceUrl = "http://172.16.0.241:8087/";
// var interfaceUrl = "http://172.16.0.188:8080/";
var interfaceUrl = "http://54.222.224.97:8087/";

var imgUrl = 'http://172.16.0.241:8082/';

sessionStorage.setItem("imgUrl", imgUrl);

var ajaxJS = function (param, data, callback) {
    var $ = param.jquery;
    var layer = param.layer;
    var url = param.url;
    var type = param.type;
    var async = param.async || true;
    data = (data == null || data == "" || typeof(data) == "undefined") ? "" : data;
    data.token = sessionStorage.getItem('token');

    $.ajax({
        url: interfaceUrl + url,
        type: "post",
        data: data,
        dataType: "json",
        async: async,
        success: function (d) {
            if (d.code == "200") {
                callback(d)
            } else if (d.code == "403") {
                layer.closeAll('msg')
                layer.msg(d.desc)
            } else if (d.code == "401") {
                setTimeout(function () {
                    parent.goLogin();
                }, 500);
                layer.msg(d.desc)
            } else if (d.code == '500') {
                layer.closeAll('msg');
                layer.msg(d.desc);
            }
        }
    });
};

//封装全局数据表格渲染
var tableIns;
var tableInit = function (table, url, colArr, data) {
    var where;
    if (data) {
        where = data;
        where.token = sessionStorage.getItem('token');
    } else {
        where = {
            token: sessionStorage.getItem('token')
        }
    }
    tableIns = table.render({
        elem: '#tableList',
        url: interfaceUrl + url,
        method: 'post',
        page: {
            layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
            curr: 1,//设定初始在第 5 页
            groups: 10//只显示 1 个连续页码
        },
        limit: 10,
        limits: ['10', '50', '100', '200'],
        id: "tableList",
        cols: colArr,
        request: {
            pageName: 'pageIndex', //页码的参数名称，默认：page
            limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        response: {
            countName: 'total',
            dataName: 'list',
            statusCode: 200
        },
        where: where
    });
};
var isDown = true;

//封装搜索方法
function search($, table, whereList) {
    table.reload("tableList", {
        page: {
            curr: 1 //重新从第 1 页开始
        },
        where: whereList
    });
    $('.screen-wrapper').stop().slideUp();
    isDown = true;
    $('.screen span').html('筛选')
}

//时间戳转换成时间字符串
function formatDate(now) {
    now = new Date(now);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    return year + "/" + month + "/" + date;
}

layui.use(['table', 'jquery', 'form'], function () {
    var $ = layui.jquery, table = layui.table, form = layui.form;


    $('.screen').click(function () {
        form.render();
        if (isDown) {
            $('.screen-wrapper').stop().slideDown();
            isDown = !isDown;
            $('.screen span').html('收起')
        } else {
            $('.screen-wrapper').stop().slideUp();
            isDown = !isDown;
            $('.screen span').html('筛选')
        }
    });

    //重置
    $('.reset').click(function () {
        $('input').val('');
        $('select').val('');
        table.reload("tableList", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {}
        });
        $('.screen-wrapper').stop().slideUp();
        isDown = true;
        $('.screen span').html('筛选')
    });

    //预览图片
    $(document).click(function (e) {
        if (e.target.className === 'preview') {
            parent.showImg(e.target.src);
        }
    });

    $('.closeImg').click(function (e) {
        var e = e || event;
        e.cancelBubble = true;
        e.stopPropagation();

        $('.upload-wrapper').show();
        $('.showImg').hide();
    });

});