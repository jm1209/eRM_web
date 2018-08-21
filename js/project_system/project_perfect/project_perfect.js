layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form, table = layui.table, $ = layui.jquery, laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: ''};

    var resourceArr = JSON.parse(sessionStorage.getItem('resourceArr'));
    var isSupply = false;
    if(resourceArr) {
        for (var i = 0; i < resourceArr.length; i++) {
            if (resourceArr[i] == 'perfectProject') {
                isSupply = true;
            }
        }
    }


    //数据表格渲染
    tableInit(table, 'projectBackend/getProjectAddInfoList', [[
        {type: "checkbox", fixed: "left", width: 50},
        {
            title: '序号', align: 'center', templet: function (d) {
                return d.LAY_INDEX
            }
        },
        {field: 'projectNo', title: '项目编号', align: 'center'},
        {
            field: 'projectName', title: '项目名称', align: 'center', templet: function (d) {
                return '<div class="proName">' +
                    '<p class="hover-hook">' + d.projectName + '</p>' +
                    '<div class="eject">' + d.baseInfo + '</div>' +
                    '</div>'
            }
        },
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
                        return "项目暂停"

                }
            }
        },
        {
            title: '操作', width: 150, align: 'center', templet: function (d) {
                if (d.projectStatus == "0" && isSupply) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">补充信息</a>'
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

    $(".search_btn").on("click", function () {
        search($, table, {
            area: $('.area').val(),
            projectType: projectType || '',
            projectStatus: projectStatus || '',
            projectName: $(".projectName").val()
        });
    });


    $(".add_btn").click(function () {
        addOrEdit("资料完善");
    });

    //添加和编辑
    function addOrEdit(title, edit, see) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layui.layer.open({
            title: title,
            type: 2,
            content: "project_perfectAdd.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);

                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find(".projectNo").attr("disabled", "true");
                    body.find(".projectNo").val(edit.projectNo);
                    body.find(".projectName").attr("disabled", "true");
                    body.find(".projectName").val(edit.projectName);
                    // body.find(".projectType").attr("disabled", "true");
                    body.find(".projectType").val(edit.projectType);
                    if (see) {

                        body.find("input").attr("disabled", "true");
                        body.find("select").attr("disabled", "true");
                        body.find(".modleBtn").hide();
                        body.find(".msg_txt").hide();
                        body.find("textarea ").attr("disabled", "true");
                        form.render();
                    }
                    form.render();
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


    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;
        sessionStorage.setItem("pid", data.id);
        if (layEvent === 'edit') { //编辑
            addOrEdit('补充信息', data);

        } else if (layEvent === 'see') {
            addOrEdit('查看信息', data, 'see');
        } else if (layEvent === 'del') { //删除
            layer.confirm('确定删除？', {icon: 3, title: '提示信息'}, function (index) {
                param.url = 'get/complex/information/delete';
                ajaxJS(param, {ids: [data.id]}, function (d) {
                    tableIns.reload();
                    layer.close(index);
                })
            });
        }
    });
});

function goLogin() {
    parent.goLogin()

}