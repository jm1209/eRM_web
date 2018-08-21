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
            if (resourceArr[i] == 'addUser') {
                $('.addShow').show();
            }
            if (resourceArr[i] == 'delUser') {
                $('.delShow').show();
            }
            if (resourceArr[i] == 'updateUser') {
                isUpdate = true;
            }
        }
    }

    //数据表格渲染
    tableInit(table, 'systemCenter/getEmpList', [[
        {type: "checkbox", fixed: "left", width: 50},
        {
            field: '', title: '序号', align: 'center', templet: function (d) {
                return d.LAY_INDEX;
            }
        },
        {field: 'empName', title: '姓名', align: 'center'},
        {field: 'empAccount', title: '账号', align: 'center'},
        {field: 'roleNames', title: '角色', align: 'center'},
        {
            field: 'status', title: '状态', align: 'center', templet: function (d) {
                var checked;
                if (d.status == '0') {
                    checked = '';
                } else {
                    checked = 'checked';
                }
                return '<input type="checkbox" memberId="' + d.id + '" name="status" lay-filter="status" lay-skin="switch" lay-text="启用|停用" ' + checked + '>'
            }
        },
        {field: 'phone', title: '电话', align: 'center'},
        {field: 'email', title: '邮件', align: 'center'},
        {
            title: '操作', align: "center", templet: function (d) {
                if (isUpdate) {
                    return '  <a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">编辑</a>';
                } else {
                    return '  <a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看</a>';
                }
            }
        }
    ]]);

    param.url = "systemCenter/roleDrop";
    ajaxJS(param, {}, function (res) {
        var data = res.data;
        for (var i = 0; i < data.length; i++) {
            var option = $('<option value="' + data[i].roleName + '">' + data[i].roleName + '</option>');
            $(".role").append(option)
        }
        $(".role").append(option)
        form.render();
    });

    var role;
    form.on("select(role)", function (data) {
        role = data.value;
    });


    //搜索
    $(".search_btn").on("click", function () {
        search($, table, {
            empAccount: $(".empAccount").val(),
            empName: $(".empName").val(),
            // dept: $(".dept").val(),
            company: $(".company").val(),
            role: role
        });
    });

    $(".add_btn").click(function () {
        var index = layer.open({
            title: '新增用户',
            type: 2,
            area: ["750px", "600px"],
            resize: false,
            content: "html/system_setup/user_manage/userAdd.html"
        })
    });

    //会员状态的启用和禁用
    form.on('switch(status)', function (data) {
        var elem = data.elem;
        var tipText = '确定禁用？';
        if (data.elem.checked) {
            tipText = '确定启用？';
        }
        layer.confirm(tipText, {
            icon: 3,
            title: '系统提示',
            cancel: function (index) {
                data.elem.checked = !data.elem.checked;
                form.render();
                layer.close(index);
            }
        }, function (index) {
            layer.close(index);
            param.url = 'systemCenter/changeEmpStatus';
            var checked = elem.checked ? '1' : '0';
            ajaxJS(param, {empIds: $(elem).attr('memberId'), status: checked}, function (d) {
                form.render();
                layer.close(index);
                layer.msg(d.desc)
            })
        }, function (index) {
            data.elem.checked = !data.elem.checked;
            form.render();
            layer.close(index);
        });
    });


    //删除
    $(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];

        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            layer.confirm('确定删除选中的用户？', {icon: 3, title: '提示信息'}, function (index) {
                param.url = 'systemCenter/deleteEmp';
                ajaxJS(param, {empIds: idArr.join(',')}, function (d) {
                    tableIns.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg("请选择需要删除的用户");
        }
    });

    //数据表格操作按钮
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        var fileName = data.fileName;
        var qualify = data.qualify;
        if (layEvent === 'edit') { //编辑
            var index = layer.open({
                title: '编辑用户',
                type: 2,
                area: ["750px", "600px"],
                resize: false,
                content: "html/system_setup/user_manage/userUpdate.html",
                success: function (layero, index) {
                    var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                    body.find(".sign").attr("signid", data.id);

                }
            })
        } else if (layEvent === 'see') {
            var index = layer.open({
                title: '查看用户',
                type: 2,
                area: ["750px", "600px"],
                resize: false,
                content: "html/system_setup/user_manage/userSee.html",
                success: function (layero, index) {
                    var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                    body.find(".sign").attr("signid", data.id);

                }
            })
        }
    });
});

function goLogin() {
    parent.goLogin()

}