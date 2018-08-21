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
    if(resourceArr) {
        for (var i = 0; i < resourceArr.length; i++) {
            if (resourceArr[i] == 'addBug') {
                $('.addShow').show();
            }
            if (resourceArr[i] == 'delBug') {
                $('.delShow').show();
            }
            if (resourceArr[i] == 'updateBug') {
                isUpdate = true;
            }
        }
    }


    //数据表格渲染
    tableInit(table, 'systemCenter/getDefactList', [[
        {type: "checkbox", fixed: "left", width: 50},
        {
            field: '', title: '序号', align: 'center', templet: function (d) {
                return d.LAY_INDEX;
            }
        },
        {field: 'defName', title: '缺陷等级', align: 'center'},
        {field: 'defText', title: '备注', align: 'center'},
        {
            title: '操作', minWidth: 175, fixed: "right", align: "center", templet: function (d) {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">编辑</a>'
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看</a>'
                }
            }
        }
    ]]);

    //搜索
    $(".search_btn").on("click", function () {
        search($, table, {
            defName: $(".defName").val()
        });
    });

    $(".add_btn").click(function () {
        addOrEdit("html/system_setup/bug_manage/bugAdd.html","添加缺陷等级");
    });

    //添加和编辑
    function addOrEdit(url, title, edit) {     //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        var index = layer.open({
            title: title,
            type: 2,
            area: ["750px", "450px"],
            content: url,
            resize: false,
            success: function (layero, index) {
                var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                if (edit) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find("input[name='defName']").val(edit.defName);
                    body.find("textarea[name='defText']").text(edit.defText);
                    form.render();
                }
            }
        })
    }

    //删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];

        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            layer.confirm('确定删除选中的缺陷等級？', {icon: 3, title: '提示信息'}, function (index) {
                param.url = 'systemCenter/deleteDefact';
                ajaxJS(param, {defIds: idArr.join(",")}, function (d) {
                    tableIns.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg("请选择需要删除的缺陷等級");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit('html/system_setup/bug_manage/bugAdd.html','编辑缺陷等级', data);
        } else if ((layEvent === 'see')) {
            addOrEdit('html/system_setup/bug_manage/bugSee.html','查看缺陷等级', data);
        }
    });
});

function goLogin() {
    parent.goLogin()

}