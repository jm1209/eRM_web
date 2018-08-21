layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form, table = layui.table, $ = layui.jquery, laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: ''};

    var resourceArr = JSON.parse(sessionStorage.getItem('resourceArr'));
    var isApprove = false;
    if(resourceArr) {
        for (var i = 0; i < resourceArr.length; i++) {
            if (resourceArr[i] == 'approveWork') {
                isApprove = true;
            }
        }
    }


    //数据表格渲染
    tableInit(table, 'routineBackend/getDailyWorkApproveList', [[
        {type: "checkbox", fixed: "left", width: 50},
        {
            field: '', title: '序号', align: 'center', templet: function (d) {
                return d.LAY_INDEX;
            }
        },
        {field: 'projectNo', title: '项目编号', align: 'center'},
        {field: 'projectName', title: '项目名', align: 'center'},
        {field: 'workName', title: '工作名称', align: 'center'},
        {
            field: 'workStatus', title: '处理状态', align: 'center', templet: function (d) {
                switch (d.workStatus) {
                    case '0':
                        return '待处理';
                    case '1':
                        return '待审批';
                    case '2' :
                        return '已审批';
                    case '3':
                        return '已复审';
                }
            }
        },
        {field: 'dealTime', title: '处理时间', align: 'center'},
        {field: 'dealUser', title: '处理人', align: 'center'},
        {
            title: '操作', width: 100, align: 'center', templet: function (d) {
                if ((d.workStatus == "0" || d.workStatus == "1") && isApprove) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="handle">审批</a>';
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
            projectNo: $(".projectNo").val(),
            projectName: $(".projectName").val(),
        });
    });

    $(".add_btn").click(function () {
        addOrEdit('audit.html', '添加工作', {workId: ''});
    });

    //添加和编辑
    function addOrEdit(url, title, edit) {
        var index = layui.layer.open({
            title: title,
            type: 2,
            content: url,
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                body.find(".sign").attr('workid', edit.workId);

                setTimeout(function () {
                    layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        });
        layui.layer.full(index);

        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    }


    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'handle') { //编辑
            addOrEdit('audit.html', '审批', data);
        } else if (layEvent === 'see') { //编辑
            addOrEdit('audit_see.html', '查看', data);
        }
    });

});

function goLogin() {
    parent.goLogin()

}