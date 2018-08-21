layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form, table = layui.table, $ = layui.jquery, laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: ''};

    var resourceArr = JSON.parse(sessionStorage.getItem('resourceArr'));
    var isDraft = false;
    var isUpdate = false;
    if (resourceArr) {
        for (var i = 0; i < resourceArr.length; i++) {
            if (resourceArr[i] == 'addPlan') {
                isDraft = true;
            }
            if (resourceArr[i] == 'updatePlan') {
                isUpdate = true;
            }
        }
    }


    //数据表格渲染
    tableInit(table, 'projectBackend/getPlanProjectList', [[
        {type: "checkbox", fixed: "left", width: 50},
        {
            title: '序号', align: 'center', templet: function (d) {
                return d.LAY_INDEX
            }
        },
        {field: 'projectNo', title: '项目编号', align: 'center'},
        {field: 'projectName', title: '项目名称', align: 'center'},
        {
            field: 'projectType', title: '项目类型', align: 'center', templet: function (d) {
                switch (d.projectType) {
                    case "1":
                        return "分布式低压";
                    case "2":
                        return "分布式高压";
                    case "3":
                        return "地面集中式";
                    case "4":
                        return "风电";

                }
            }
        },
        {field: 'company1', title: '业主公司', align: 'center'},
        {field: 'company2', title: '参建单位', align: 'center'},
        {
            title: '计划状态', align: 'center', templet: function (d) {
                switch (d.projectStatus) {
                    case "0":
                        return "项目启动";
                    case "1":
                        return "完善信息";
                    case "2":
                        return "制定计划中";
                    case "3":
                        return "计划提交";
                    case "4":
                        return "审批通过";
                    case "5":
                        return "审批拒绝";
                    case "6":
                        return "复审通过";
                    case "7":
                        return "复审拒绝";
                    case "9":
                        return "项目暂停"

                }
            }
        },
        {field: 'managerEpcName', title: '编制人', align: 'center'},
        {field: 'managerSupervisorName', title: '审核人', align: 'center'},
        {
            title: '操作', width: 150, align: "center", templet: function (d) {
                if (d.projectStatus == "" && isDraft) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="add">制定计划</a>'
                } else if (d.projectStatus == "0" && isDraft) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="add">制定计划</a>'
                } else if (d.projectStatus == "1" && isDraft) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="add">制定计划</a>'
                } else if (d.projectStatus == "2" && isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">编辑计划</a>'
                } else if (d.projectStatus == "3") {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看计划</a>'
                } else if (d.projectStatus == "4") {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看计划</a>'
                } else if (d.projectStatus == "5" && isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">编辑计划</a>'
                } else if (d.projectStatus == "6") {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看计划</a>'
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看计划</a>'
                }
            }
        }
    ]]);


    $("#gantt").click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];
        if (data.length > 0) {
            if (data[0].projectStatus == 0) {
                layer.msg('项目在启动中，无法查看甘特图');
            } else if (data[0].projectStatus == 1) {
                layer.msg('项目在完善信息中，无法查看甘特图');
            } else if (data[0].projectStatus == 2) {
                layer.msg('项目在制定中，无法查看甘特图');
            } else if (data[0].projectStatus == 8) {
                layer.msg('项目未启动，无法查看甘特图');
            } else {
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
            }

        } else {
            layer.msg('请选中要展示的项目')
        }
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    });

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


    //导出
    $('.export').click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];
        for (var i in data) {
            idArr.push(data[i].id);
        }
        if (idArr.length == 0) {
            layer.msg('请选择要导出的文件');
            return;
        }
        window.location.href = interfaceUrl + 'projectBackend/exportPlanProjectDetailList?token=' + sessionStorage.getItem("token") + '&projectIds=' + idArr.join(',')
    });


    //搜索
    $(".search_btn").on("click", function () {
        search($, table, {
            area: $('.area').val(),
            projectType: projectType,
            projectStatus: projectStatus,
            projectName: $(".projectName").val(),
            projectNo: $(".projectNo").val()
        });
    });

    function addOrEdit(title, url, data) {
        var index = layui.layer.open({
            title: title,
            type: 2,
            content: url,
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                body.find('.sign').attr('signid', data.id).attr('leader', data.managerEpc).attr('leaderName', data.managerEpcName);

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


    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit('编辑计划', 'plan_update.html', data);
        } else if (layEvent === 'see') {
            addOrEdit('查看计划', 'plan_see.html', data);
        } else if (layEvent === 'add') {
            if (data.projectType == 1) {
                addOrEdit('制定计划', 'project_planAdd.html', data);
            } else if (data.projectType == 2) {
                addOrEdit('制定计划', 'high_plan.html', data);
            } else if (data.projectType == 3) {
                addOrEdit('制定计划', 'floor_plan.html', data);
            } else if (data.projectType == 4) {
                addOrEdit('制定计划', 'wind_plan.html', data);
            }
        }
    });
});

function goLogin() {
    parent.goLogin()
}