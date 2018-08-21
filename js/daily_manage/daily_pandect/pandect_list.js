layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form, table = layui.table, $ = layui.jquery, laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: ''};


    setTimeout(function () {
        //数据表格渲染
        tableInit(table, 'routineBackend/getDailyWorkListByProject', [[
            {
                field: '', title: '序号', align: 'center', templet: function (d) {
                    return d.LAY_INDEX;
                }
            },
            {field: 'projectNo', title: '项目编号', align: 'center'},
            {field: 'projectName', title: '项目名', align: 'center'},
            {field: 'workName', title: '工作名称', align: 'center'},
            {
                field: 'workStatus', title: '状态', align: 'center', templet: function (d) {
                    switch (d.workStatus) {
                        case '0':
                            return '待处理';
                        case '1':
                            return '已处理';
                        case '2' :
                            return '已审核';
                        case '3':
                            return '已复审';
                    }
                }
            },
            {field: 'remindTime', title: '工作接收时间', align: 'center'},
            {field: 'dealTime', title: '工作处理时间', align: 'center'},
            {field: 'dealUser', title: '已处理人', align: 'center'},
            {field: 'toDealUser', title: '待处理人', align: 'center'},
            {
                title: '操作', width: 100, align: 'center', templet: function (d) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看</a>'
                }
            }
        ]], {projectId: $('.sign').attr('projectid')});
    }, 500);


    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        var index = layui.layer.open({
            title: '查看',
            type: 2,
            content: "daily_pandectSee.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                body.find(".sign").attr('projectId', data.workId);

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
    });
});

function goLogin() {
    parent.goLogin()

}
