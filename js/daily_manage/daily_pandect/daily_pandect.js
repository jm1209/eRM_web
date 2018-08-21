layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form, table = layui.table, $ = layui.jquery, laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: ''};


    //数据表格渲染
    tableInit(table, 'routineBackend/getDailyWorkSummaryList', [[
        {type: "checkbox", fixed: "left", width: 50},
        {
            title: '序号', align: 'center', templet: function (d) {
                return d.LAY_INDEX
            }
        },
        {field: 'projectNo', title: '项目编号', align: 'center'},
        {field: 'projectName', title: '项目名称', align: 'center'},
        {field: 'areaName', title: '所属区域', align: 'center'},
        {
            title: '项目类型', align: 'center', templet: function (d) {
                if (d.projectType == 1) {
                    return "分布式低压"
                } else if (d.projectType == 2) {
                    return "分布式高压"
                } else if (d.projectType == 3) {
                    return "地面集中式"
                } else if (d.projectType == 4) {
                    return "风电"
                } else {
                    return ""
                }
            }
        },
        {
            title: '项目状态', align: 'center', templet: function (d) {
                switch (d.projectStatus) {
                    case "1":
                        return "启动中";
                    case "2":
                        return "建设中";
                    case "3":
                        return "部分并网";
                    case "4":
                        return "试运行";
                    case "5":
                        return "正式移交";
                }
            }
        },
        {field: 'startDate', title: '计划开始时间', align: 'center'},
        {field: 'endDate', title: '计划结束时间', align: 'center'},
        {
            title: '计划进度', align: 'center', templet: function (d) {
                return d.planRate + '%';
            }
        },
        {
            title: '实际进度', align: 'center', templet: function (d) {
                return d.realRate + '%';
            }
        },
        {
            title: '操作', templet: function (d) {
                if (d.projectStatus == '1') {
                    return '<a disabled class="layui-btn layui-btn-xs layui-btn-primary layui-btn-disabled" lay-event="see">查看</a>'
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看</a>'
                }

            }
        }
    ]]);

    //选择区域
    $('.area').click(function () {
        var self = this;
        layer.open({
            title: '选择城市',
            type: 2,
            area: ["350px", "350px"],
            content: "html/project_setup/project_start/linkage.html",
            btn: ['确定'],
            yes: function (index, layero) {
                var body = layer.getChildFrame('body', index);

                var province = body.find('#province').val();
                var city = body.find('#city').val();
                var town = body.find('#town').val();
                if (province == '请选择') {
                    $(self).val('');
                } else if (city == '请选择' || city == '') {
                    var adress = province
                } else if (town == '请选择' || town == '') {
                    var adress = province + ',' + city;
                } else {
                    var adress = province + ',' + city + ',' + town;
                }
                $(self).val(adress);
                layer.close(index);
            }
        })

    });


    var projectType, projectStatus;
    form.on('select(projectType)', function (data) {
        projectType = data.value;
    });
    form.on('select(projectStatus)', function (data) {
        projectStatus = data.value;
    });
    //搜索
    $(".search_btn").on("click", function () {
        search($, table, {
            area: $('.area').val(),
            projectType: projectType,
            projectStatus: projectStatus,
            projectName: $(".projectName").val()
        });
    });

    //导出
    $('.export').click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];
        for (var i in data) {
            idArr.push(data[i].id);
        }
        if (idArr.length == 0) {
            layer.msg('请选择要导出的项目');
            return;
        }
        window.location.href = interfaceUrl + 'routineBackend/exportDailyWorkListNode?token=' + sessionStorage.getItem("token") + '&projectIdList=' + idArr.join(',')
    });


    $(".add_btn").click(function () {
        addOrEdit("添加公司");
    });

    $("#gantt").click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];
        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            if (idArr.length > 1) {
                layer.msg('请选择一个项目');
                return;
            }
            var index = layui.layer.open({
                title: '甘特图',
                type: 2,
                content: "../../gantt.html?projectId=" + idArr[0],
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);

                    setTimeout(function () {
                        layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500)
                }
            });
        } else {
            layer.msg('请选中要展示的项目')
        }
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    });

    //添加和编辑
    function addOrEdit(title, edit, see) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layui.layer.open({
            title: title,
            type: 2,
            content: "daily_pandectSee.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);

                body.find(".sign").val("edit").attr("signid", edit.id);
                body.find(".infTypeId").attr('val', edit.infTypeId);
                body.find(".infTitle").val(edit.infTitle);
                body.find(".infDescription").val(edit.infDescription);
                body.find("#infDetail").attr('val', edit.infDetail);
                if (see) {
                    body.find(".see").hide()
                }
                form.render();

                setTimeout(function () {
                    layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })

    }

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'see') {
            if (data.projectStatus == '1') {
                layer.msg('该项目无日常工作，暂时无法查看');
                return;
            }
            var index = layui.layer.open({
                title: '总览',
                type: 2,
                content: "pandect_list.html",
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    body.find('.sign').attr('projectId', data.id);

                    setTimeout(function () {
                        layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500)
                }
            });
            layui.layer.full(index);
            //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
            $(window).on("resize", function () {
                layui.layer.full(index);
            })
        }
    });

});

function goLogin() {
    parent.goLogin()

}
