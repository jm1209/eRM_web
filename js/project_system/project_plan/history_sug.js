layui.use(['form', 'layer', "jquery", 'table', 'laydate', "element", "tree"], function () {
    var form = layui.form, $ = layui.jquery, table = layui.table, laydate = layui.laydate, element = layui.element,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var projectId = UrlParm.parm("projectId");

    //初始化数据表格
    tableInit(table, 'projectBackend/getApproveRemarkHis', [[
        {
            field: '', title: '序号', align: 'center',width:70, templet: function (d) {
                return d.LAY_INDEX;
            }
        },
        {field: 'refuseUser', title: '提意见者', align: 'center',width:150},
        {field: 'remark', title: '意见', align: 'center'},

        {field: 'refuseDate', title: '时间', align: 'center',width:150}
    ]],{projectId:projectId});

});

