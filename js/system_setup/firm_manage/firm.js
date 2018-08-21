layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: '', type: 'post'};

    var resourceArr = JSON.parse(sessionStorage.getItem('resourceArr'));
    var isUpdate = false;
    $('.addShow,.delShow').hide();
    if(resourceArr) {
        for (var i = 0; i < resourceArr.length; i++) {
            if (resourceArr[i] == 'addOwner') {
                $('.addShow').show();
            }
            if (resourceArr[i] == 'delOwner') {
                $('.delShow').show();
            }
            if (resourceArr[i] == 'updateOwner') {
                isUpdate = true;
            }
        }
    }

    //数据表格渲染
    tableInit(table, 'systemCenter/getCompanyList', [[
        {type: "checkbox", fixed: "left", width: 50},
        {
            field: '', title: '序号', align: 'center', templet: function (d) {
                return d.LAY_INDEX;
            }
        },
        {field: 'companyNo', title: '公司编号', align: 'center'},
        {field: 'companyName', title: '公司名称', align: 'center'},
        {
            title: '操作', width: 100, fixed: "right", align: "center", templet: function (d) {
                if (isUpdate) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">编辑</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看</a>';
                }
            }
        }
    ]], {companyListType: 0});

    param.url = 'systemCenter/companyDrop';
    param.type = 'get';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        var typeName;
        for (var i = 0; i < data.length; i++) {
            var str = ' <option value="' + data[i].companyType + '">' + data[i].companyType + '</option>';
            $('.companyType').append(str)
        }
        form.render();
    });

    var companyType;
    form.on('select(companyType)', function (data) {
        companyType = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table, {
            companyName: $(".companyName").val(),
            companyType: companyType
        });
    });

    $(".add_btn").click(function () {
        addOrEdit("html/system_setup/firm_manage/firmAdd.html","添加公司");
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
                    body.find("input[name='companyName']").val(edit.companyName).attr('companyNo');
                    body.find(".companyType").val(edit.companyType).attr('disabled', 'true');
                    body.find("input[name='phone']").val(edit.phone);
                    body.find("input[name='email']").val(edit.email);


                    if (edit.logoUrl) {
                        body.find(".showImg").show().find('img').attr('src', edit.logoUrl);
                        body.find(".upload-wrapper").hide();
                    } else {
                        body.find(".upload-wrapper").show();
                        body.find(".showImg").hide();
                    }

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
            layer.confirm('确定删除选中的公司？', {icon: 3, title: '提示信息'}, function (index) {
                param.url = 'systemCenter/deleteCompany';
                ajaxJS(param, {companyIds: idArr.join(',')}, function (d) {
                    tableIns.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg("请选择需要删除的公司");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit('html/system_setup/firm_manage/firmAdd.html', '编辑公司', data);
        } else if (layEvent === 'see') {
            addOrEdit('html/system_setup/firm_manage/firmSee.html', '查看公司', data);
        }
    });
});

function goLogin() {
    parent.goLogin()

}