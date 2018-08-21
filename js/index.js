var tab;
var addTab;
layui.config({
    base: "js/common/"
}).use(['bodyTab', 'form', 'element', 'layer', 'jquery', 'laydate'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery, element = layui.element;

    var param = {jquery: $, layer: layer, url: '', type: 'post'};

    var loginName = sessionStorage.getItem("loginName");

    $(".userName").html(loginName || '用户名');


    if (sessionStorage.getItem('companyName') != '') {
        $('.logo-txt').html(sessionStorage.getItem('companyName') + '欢迎你');
    } else {
        $('.logo-txt').html('eRM项目管理平台欢迎你');
    }


    //实例化城市查询类
    var citysearch = new AMap.CitySearch();
    //自动获取用户IP，返回当前城市
    citysearch.getLocalCity(function (status, result) {
        sessionStorage.setItem('cityName', result.city)
    });


    //点击退出
    $(".signOut").click(function () {
        param.url = 'centerBackend/logout';
        ajaxJS(param, '', function (d) {
            sessionStorage.clear();
            window.location.href = "index.html";
        });

    });


    tab = layui.bodyTab({
        openTabNum: "50",  //最大可打开窗口数量
        url: "centerBackend/getResourceList"
    });

    //隐藏左侧导航
    $(".hideMenu").click(function () {
        setTimeout(function () {
            $('.hideMenu1').show();
            $('.hideMenu').hide();
        },50);

        $(".layui-layout-admin").toggleClass("showMenu");
        //渲染顶部窗口
        tab.tabMove();
    });
    $(".hideMenu1").click(function () {
        $('.hideMenu1').hide();
        $('.hideMenu').show();
        $(".layui-layout-admin").toggleClass("showMenu");
        //渲染顶部窗口
        tab.tabMove();
    });

    //渲染左侧菜单
    tab.render();

    // 添加新窗口
    $("body").on("click", ".layui-nav .layui-nav-item a", function () {
        //如果不存在子级
        if ($(this).siblings().length == 0) {
            addTab($(this));
        }
        $(this).parent("li").siblings().removeClass("layui-nav-itemed");
    });

    //公告层
    function showNotice() {
        layer.open({
            type: 1,
            title: "系统公告",
            closeBtn: false,
            area: '310px',
            shade: 0.8,
            id: 'LAY_layuipro',
            btn: ['火速围观'],
            moveType: 1,
            content: '<div style="padding:15px 20px; text-align:justify; line-height: 22px; text-indent:2em;border-bottom:1px solid #e2e2e2;">系统公告</div>',
            success: function (layero) {
                var btn = layero.find('.layui-layer-btn');
                btn.css('text-align', 'center');
                btn.on("click", function () {
                    window.sessionStorage.setItem("showNotice", "true");
                })
                if ($(window).width() > 432) {  //如果页面宽度不足以显示顶部“系统公告”按钮，则不提示
                    btn.on("click", function () {
                        layer.tips('系统公告躲在了这里', '#showNotice', {
                            tips: 3
                        });
                    })
                }
            }
        });
    }

    $(".showNotice").on("click", function () {
        showNotice();
    });

    skins();

    //更换皮肤
    function skins() {
        var skin = localStorage.getItem("skin");
        if (skin) {  //如果更换过皮肤
            if (localStorage.getItem("skinValue") != "自定义") {
                $("body").addClass(localStorage.getItem("skin"));
            } else {
                $(".layui-layout-admin .layui-header").css("background-color", skin.split(',')[0]);
                $(".layui-bg-black").css("background-color", skin.split(',')[1]);
                $(".hideMenu").css("background-color", skin.split(',')[2]);
            }
        }
    }

    $(".changeSkin").click(function () {
        layer.open({
            title: "更换皮肤",
            area: ["500px", "300px"],
            type: "1",
            content: '<div class="skins_box">' +
            '<form class="layui-form">' +
            '<div class="layui-form-item">' +
            '<input type="radio" name="skin" value="默认" title="默认" lay-filter="default" checked="">' +
            '<input type="radio" name="skin" value="橙色" title="橙色" lay-filter="orange">' +
            '<input type="radio" name="skin" value="蓝色" title="蓝色" lay-filter="blue">' +
            '<input type="radio" name="skin" value="自定义" title="自定义" lay-filter="custom">' +
            '<div class="skinCustom">' +
            '<input type="text" class="layui-input topColor" name="topSkin" placeholder="顶部颜色" />' +
            '<input type="text" class="layui-input leftColor" name="leftSkin" placeholder="左侧颜色" />' +
            '<input type="text" class="layui-input menuColor" name="btnSkin" placeholder="顶部菜单按钮" />' +
            '</div>' +
            '</div>' +
            '<div class="layui-form-item skinBtn">' +
            '<a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit="" lay-filter="changeSkin">确定更换</a>' +
            '<a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-primary" lay-submit="" lay-filter="noChangeSkin">我再想想</a>' +
            '</div>' +
            '</form>' +
            '</div>',
            success: function (index, layero) {
                var skin = localStorage.getItem("skin");
                if (localStorage.getItem("skinValue")) {
                    $(".skins_box input[value=" + localStorage.getItem("skinValue") + "]").attr("checked", "checked");
                }
                ;
                if ($(".skins_box input[value=自定义]").attr("checked")) {
                    $(".skinCustom").css("visibility", "inherit");
                    $(".topColor").val(skin.split(',')[0]);
                    $(".leftColor").val(skin.split(',')[1]);
                    $(".menuColor").val(skin.split(',')[2]);
                }
                ;
                form.render();
                $(".skins_box").removeClass("layui-hide");
                $(".skins_box .layui-form-radio").on("click", function () {
                    var skinColor;
                    if ($(this).find("div").text() == "橙色") {
                        skinColor = "orange";
                    } else if ($(this).find("div").text() == "蓝色") {
                        skinColor = "blue";
                    } else if ($(this).find("div").text() == "默认") {
                        skinColor = "";
                    }
                    if ($(this).find("div").text() != "自定义") {
                        $(".topColor,.leftColor,.menuColor").val('');
                        $("body").removeAttr("class").addClass("main_body " + skinColor + "");
                        $(".skinCustom").removeAttr("style");
                        $(".layui-bg-black,.hideMenu,.layui-layout-admin .layui-header").removeAttr("style");
                    } else {
                        $(".skinCustom").css("visibility", "inherit");
                    }
                });
                var skinStr, skinColor;
                $(".topColor").blur(function () {
                    $(".layui-layout-admin .layui-header").css("background-color", $(this).val() + " !important");
                });
                $(".leftColor").blur(function () {
                    $(".layui-bg-black").css("background-color", $(this).val() + " !important");
                });
                $(".menuColor").blur(function () {
                    $(".hideMenu").css("background-color", $(this).val() + " !important");
                });

                form.on("submit(changeSkin)", function (data) {
                    if (data.field.skin != "自定义") {
                        if (data.field.skin == "橙色") {
                            skinColor = "orange";
                        } else if (data.field.skin == "蓝色") {
                            skinColor = "blue";
                        } else if (data.field.skin == "默认") {
                            skinColor = "";
                        }
                        localStorage.setItem("skin", skinColor);

                    } else {
                        skinStr = $(".topColor").val() + ',' + $(".leftColor").val() + ',' + $(".menuColor").val();
                        localStorage.setItem("skin", skinStr);
                        $("body").removeAttr("class").addClass("main_body");
                    }
                    localStorage.setItem("skinValue", data.field.skin);
                    layer.closeAll("page");
                    window.location.reload()
                });
                form.on("submit(noChangeSkin)", function () {
                    $("body").removeAttr("class").addClass("main_body " + localStorage.getItem("skin") + "");
                    $(".layui-bg-black,.hideMenu,.layui-layout-admin .layui-header").removeAttr("style");
                    skins();
                    layer.closeAll("page");
                });

                $('.layui-input').each(function () {
                    $(this).minicolors({
                        control: $(this).attr('data-control') || 'hue',
                        defaultValue: $(this).attr('data-defaultValue') || '',
                        inline: $(this).attr('data-inline') === 'true',
                        letterCase: $(this).attr('data-letterCase') || 'lowercase',
                        opacity: $(this).attr('data-opacity'),
                        position: $(this).attr('data-position') || 'bottom left',
                        change: function (hex, opacity) {
                            if (!hex)
                                return;
                            if (opacity)
                                hex += ', ' + opacity;
                            try {

                            } catch (e) {
                            }
                        },
                        // theme: 'bootstrap'
                    });

                });
            },
            cancel: function () {
                $("body").removeAttr("class").addClass("main_body " + localStorage.getItem("skin") + "");
                $(".layui-bg-black,.hideMenu,.layui-layout-admin .layui-header").removeAttr("style");
                skins();
            }
        })
    });

    //刷新当前
    $(".refresh").on("click", function () {  //此处添加禁止连续点击刷新一是为了降低服务器压力，另外一个就是为了防止超快点击造成chrome本身的一些js文件的报错(不过貌似这个问题还是存在，不过概率小了很多)
        if ($(this).hasClass("refreshThis")) {
            $(this).removeClass("refreshThis");
            $(".clildFrame .layui-tab-item.layui-show").find("iframe")[0].contentWindow.location.reload(true);
            setTimeout(function () {
                $(".refresh").addClass("refreshThis");
            }, 2000)
        } else {
            layer.msg("您点击的速度超过了服务器的响应速度，还是等两秒再刷新吧！");
        }
    });

    //关闭其他
    $(".closePageOther").on("click", function () {
        if ($("#top_tabs li").length > 2 && $("#top_tabs li.layui-this cite").text() != "首页") {
            $("#top_tabs li").each(function () {
                if ($(this).attr("lay-id") != '' && !$(this).hasClass("layui-this")) {
                    element.tabDelete("bodyTab", $(this).attr("lay-id")).init();
                }
            })
        } else if ($("#top_tabs li.layui-this cite").text() == "首页" && $("#top_tabs li").length > 1) {
            $("#top_tabs li").each(function () {
                if ($(this).attr("lay-id") != '' && !$(this).hasClass("layui-this")) {
                    element.tabDelete("bodyTab", $(this).attr("lay-id")).init();
                }
            })
        } else {
            layer.msg("没有可以关闭的窗口了");
        }
        //渲染顶部窗口
        tab.tabMove();
    });

    //关闭全部
    $(".closePageAll").on("click", function () {
        if ($("#top_tabs li").length > 1) {
            $("#top_tabs li").each(function () {
                if ($(this).attr("lay-id") != '') {
                    element.tabDelete("bodyTab", $(this).attr("lay-id")).init();
                }
            })
        } else {
            layer.msg("没有可以关闭的窗口了");
        }
        //渲染顶部窗口
        tab.tabMove();
    });


//打开新窗口
    addTab = function (_this) {
        tab.tabAdd(_this);
    };

    function showImg(url) {
        $('#layerPic img').attr('src', url);
        setTimeout(function () {
            $('#layerPic').fadeIn()
        }, 20)
    }

    $('.layer-bg').click(function () {
        $('#layerPic').fadeOut()
    });

});

//左边导航栏渲染
function navBar(d) {
    var data = d.data;


    var ulHtml = '<ul class="layui-nav layui-nav-tree">' +
        '<li class="layui-nav-item">' +
        '<a data-url="html/main.html">' +
        '<i class="iconfont icon-shouye" data-icon="icon-shouye"></i>' +
        '<cite>首页</cite>' +
        '</a>' +
        '</li>';

    for (var i = 0; i < data.length; i++) {
        ulHtml += '<li class="layui-nav-item">';
        if (data[i].nodes != undefined && data[i].nodes.length > 0) {
            ulHtml += '<a href="javascript:;">';
            if (data[i].icon != undefined && data[i].icon != '') {
                if (data[i].icon.indexOf("icon-") != -1) {
                    ulHtml += '<i class="iconfont ' + data[i].icon + '" data-icon="' + data[i].icon + '"></i>';
                } else {
                    ulHtml += '<i class="layui-icon" data-icon="' + data[i].icon + '">' + data[i].icon + '</i>';
                }
            }
            ulHtml += '<cite>' + data[i].resName + '</cite>';
            ulHtml += '<span class="layui-nav-more"></span>';
            ulHtml += '</a>';
            ulHtml += '<dl class="layui-nav-child">';
            for (var j = 0; j < data[i].nodes.length; j++) {
                if (data[i].nodes[j].target == "_blank") {
                    ulHtml += '<dd><a href="javascript:;" data-url="' + data[i].nodes[j].resUrl + '" target="' + data[i].nodes[j].target + '">';
                } else {
                    ulHtml += '<dd><a href="javascript:;" data-url="' + data[i].nodes[j].resUrl + '">';
                }
                if (data[i].nodes[j].icon != undefined && data[i].nodes[j].icon != '') {
                    if (data[i].nodes[j].icon.indexOf("icon-") != -1) {
                        ulHtml += '<i class="iconfont ' + data[i].nodes[j].icon + '" data-icon="' + data[i].nodes[j].icon + '"></i>';
                    } else {
                        ulHtml += '<i class="layui-icon" data-icon="' + data[i].nodes[j].icon + '">' + data[i].nodes[j].icon + '</i>';
                    }
                }
                ulHtml += '<cite>' + data[i].nodes[j].resName + '</cite></a></dd>';
            }
            ulHtml += "</dl>";
        } else {
            if (data[i].target == "_blank") {
                ulHtml += '<a href="javascript:;" data-url="' + data[i].resUrl + '" target="' + data[i].target + '">';
            } else {
                ulHtml += '<a href="javascript:;" data-url="' + data[i].resUrl + '">';
            }
            if (data[i].icon != undefined && data[i].icon != '') {
                if (data[i].icon.indexOf("icon-") != -1) {
                    ulHtml += '<i class="iconfont ' + data[i].icon + '" data-icon="' + data[i].icon + '"></i>';
                } else {
                    ulHtml += '<i class="layui-icon" data-icon="' + data[i].icon + '">' + data[i].icon + '</i>';
                }
            }
            ulHtml += '<cite>' + data[i].resName + '</cite></a>';
        }
        ulHtml += '</li>';
    }
    ulHtml += '</ul>';
    return ulHtml;
}

//预览图片
function showImg(url) {
    $('#layerPic img').attr('src', url);
    setTimeout(function () {
        $('#layerPic').fadeIn()
    }, 20)
}

function goLogin() {
    location.href = '../../../index.html';
}

//添加tab页
function mainJump(_this) {
    addTab(_this)
}