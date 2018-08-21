layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: ''};

    var resourceArr = JSON.parse(sessionStorage.getItem('resourceArr'));
    var isUpdate = false;
    $('.addShow,.delShow').hide();
    if (resourceArr) {
        for (var i = 0; i < resourceArr.length; i++) {
            if (resourceArr[i] == 'addProject') {
                $('.addShow').show();
            }
            if (resourceArr[i] == 'deleteProject') {
                $('.delShow').show();
            }
            if (resourceArr[i] == 'updateProject') {
                isUpdate = true;
            }
        }
    }


    //数据表格渲染
    tableInit(table, 'projectBackend/getProjectList', [[
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
                } else {
                    return ""
                }
            }
        },
        {
            title: '项目状态', align: 'center', templet: function (d) {
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
                        return "项目暂停";

                }
            }
        },
        {
            title: '操作', width: 100, align: 'center', templet: function (d) {

                if (d.projectStatus == 8 && isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">编辑</a>'
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看</a>'
                }
            }
        }
    ]]);

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
        addOrEdit("project_startAdd.html", "添加项目", {id: ''});
    });

    //添加和编辑
    function addOrEdit(url, title, data) {
        var index = layui.layer.open({
            title: title,
            type: 2,
            content: url,
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                body.find(".sign").attr("signid", data.id);
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
            layer.confirm('确定删除选中的项目？', {icon: 3, title: '提示信息'}, function (index) {
                param.url = 'projectBackend/deleteProject';
                ajaxJS(param, {projectIds: idArr.join(",")}, function (d) {
                    tableIns.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg("请选择需要删除的项目");
        }
    });

    //暂停项目
    $(".pause_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];

        if (data.length == 1) {
            if (data[0].projectStatus <= 2) {
                layer.msg('项目未提交,无法暂停');
            } else if (data[0].projectStatus == 8) {
                layer.msg('项目未提交,无法暂停');
            } else if (data[0].projectStatus == 9) {
                layer.msg('该项目已经暂停');
            } else {
                for (var i in data) {
                    idArr.push(data[i].id);
                }
                layer.confirm('确定暂停选中的项目？', {icon: 3, title: '提示信息'}, function (index) {
                    param.url = 'projectBackend/stopProject';
                    ajaxJS(param, {projectId: idArr.join(",")}, function (d) {
                        layer.msg(d.desc);
                        tableIns.reload();
                        layer.close(index);
                    })
                })
            }
        } else {
            layer.msg("请选择一个需要暂停的项目");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit('project_start_update.html', '编辑项目', data);
        } else if (layEvent === 'see') {
            addOrEdit('start_see.html', '查看项目', data);
        }
    });
});

function goLogin() {
    parent.goLogin()

}