layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: ''};

    //数据表格渲染
    tableInit(table, 'projectBackend/getProjectSummaryList', [[
        {type: "checkbox", fixed: "left", width: 50},
        {
            title: '序号', align: 'center', templet: function (d) {
                return d.LAY_INDEX
            }
        },
        {field: 'projectNo', title: '项目编号', align: 'center'},
        {field: 'projectName', title: '项目名称', align: 'center'},
        {field: 'connectGridTime', title: '并网时间', align: 'center'},
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
                }
            }
        },

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
                    case "8":
                        return "项目未启动";
                    case "9":
                        return "项目暂停"
                }
            }
        },
        {
            title: '操作', templet: function (d) {
                if (d.projectStatus <= "2") {
                    return '<a class="layui-btn layui-btn-xs layui-btn-disabled" lay-event="see">查看</a>'
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看</a>'
                }

            }
        }
    ]]);

    $('.export').click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];
        for (var i in data) {
            idArr.push(data[i].id);
        }
        if (idArr.length == 0) {
            layer.msg('请选择要导出的项目');
            return;
        }
        window.location.href = interfaceUrl + 'projectBackend/exportPlanProjectDetailList?token=' + sessionStorage.getItem("token") + '&projectIds=' + idArr.join(',')
    });

    $("#gantt").click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];
        if (data.length > 0) {
            if (data[0].projectStatus == 0) {
                layer.msg('项目在启动中，无法查看甘特图');
            } else if (data[0].projectStatus == '1') {
                layer.msg('项目在完善信息中，无法查看甘特图');
            } else if (data[0].projectStatus == '2') {
                layer.msg('项目在制定中，无法查看甘特图');
            } else if (data[0].projectStatus == '8') {
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


    //搜索
    $(".search_btn").on("click", function () {
        search($, table, {
            area: $('.area').val(),
            projectType: projectType,
            projectStatus: projectStatus,
            projectName: $(".projectName").val()
        });
    });

    $(".add_btn").click(function () {
        addOrEdit("添加项目");
    });

    //添加和编辑
    function addOrEdit(title, edit, see) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layui.layer.open({
            title: title,
            type: 2,
            content: "plan_plandectSee.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".projectNo").attr("disabled", "true");
                    body.find(".projectNo").val(edit.projectNo);
                    // body.find(".projectName").attr("disabled", "true");
                    body.find(".projectName").val(edit.projectName);
                    body.find(".baseInfo").val(edit.baseInfo);
                    body.find(".accessInfoClassify").val(edit.accessInfoClassify);
                    body.find(".baseInfoClassify").val(edit.baseInfoClassify);
                    body.find(".projectType").val(edit.projectType);
                    body.find(".areaName").val(edit.areaName);
                    body.find(".manager").val(edit.manager);
                    body.find(".mangerRole").val(edit.mangerRole);
                    body.find(".connectGridTime").val(edit.connectGridTime);
                    body.find(".capacity").val(edit.capacity);
                    body.find(".others").val(edit.others);
                    body.find("input").attr("disabled", "true");
                    body.find("select").attr("disabled", "true");
                    body.find("textarea").attr("disabled", "true");
                    body.find("button").attr("disabled", "true");
                    if (see) {
                        body.find(".see").hide()

                    }
                    form.render();
                } else {
                    // body.find(".project_number").attr("disabled", "true");
                }
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

    //删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];

        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            layer.confirm('确定删除选中？', {icon: 3, title: '提示信息'}, function (index) {
                param.url = 'projectBackend/deleteProject';
                ajaxJS(param, {projectIds: idArr.join(",")}, function (d) {
                    tableIns.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg("请选择需要删除的选项");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'see') {
            if (data.projectStatus <= "2") {
                layer.msg('该项目未提交计划，暂时无法查看')
                return;
            }
            addOrEdit('查看', data);
        }
    });
});

function goLogin() {
    parent.goLogin()

}