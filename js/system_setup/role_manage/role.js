layui.use(['form', 'layer', 'table', 'jquery'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var param = {jquery: $, layer: layer, url: ''};

    var resourceArr = JSON.parse(sessionStorage.getItem('resourceArr'));
    var isUpdate = false;
    var isGrant = false;
    $('.addShow,.delShow').hide();
    if(resourceArr) {
        for (var i = 0; i < resourceArr.length; i++) {
            if (resourceArr[i] == 'addRole') {
                $('.addShow').show();
            }
            if (resourceArr[i] == 'delRole') {
                $('.delShow').show();
            }
            if (resourceArr[i] == 'updateRole') {
                isUpdate = true;
            }
            if (resourceArr[i] == 'grantRole') {
                isGrant = true;
            }
        }
    }


    //渲染数据表格
    tableInit(table, 'systemCenter/getRoleList', [[
        {type: "checkbox", fixed: "left", width: 50},
        {field: 'roleName', title: '角色名称', align: 'center'},
        {field: 'roleDes', title: '角色描述', align: 'center'},
        {
            field: 'roleStatusLabel', title: '是否需要资质', align: 'center', templet: function (d) {
                if (d.roleStatus == '0') {
                    return '否';
                } else if (d.roleStatus == '1') {
                    return '是';
                }
            }
        },
        {
            title: '操作', width: 150, fixed: "right", align: "center", templet: function (d) {
                if (isUpdate && isGrant) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">编辑</a>' +
                        '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="grant">授权</a>';
                } else if (isUpdate && !isGrant) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">编辑</a>';
                } else if (!isUpdate && isGrant) {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看</a>' +
                        '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="grant">授权</a>';
                } else {
                    return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看</a>';
                }
            }
        }
    ]]);

    var roleStatus;
    form.on('radio(roleStatus)', function (data) {
        roleStatus = data.value;
    });

    //搜索
    $(".search_btn").on("click", function () {
        search($, table, {
            roleName: $(".roleName").val(),
            roleStatus: roleStatus,
        });
    });

    $(".add_btn").click(function () {
        addOrEdit("html/system_setup/role_manage/roleAdd.html","新增角色");
    });

    //添加和编辑角色
    function addOrEdit(url, title, edit, edit1) {  //两个参数，title：弹出框标题。edit：如果有值表示该操作为编辑
        if (edit1) {
            var editId = edit.id;
            var e = 'edit';
            var roleType = edit.roleType, ownerCompanyName = edit.ownerCompanyName,
                subCompanyId = edit.subCompanyId, subCompanyName = edit.subCompanyName,
                ownerCompanyId = edit.ownerCompanyId;
        } else {
            var editId = '';
            var e = '';
            var roleType = '', ownerCompanyName = '',
                subCompanyId = '', subCompanyName = '', ownerCompanyId = '';
        }
        var index = layer.open({
            title: title,
            type: 2,
            area: ["750px", "650px"],
            content: url + "?roleId=" + editId + "&e=" + e + "&selectrole=" + roleType
            + "&ownerCompanyId=" + ownerCompanyId + "&ownerCompanyName="
            + ownerCompanyName + "&subCompanyId=" + subCompanyId + "&subCompanyName=" + subCompanyName,
            resize: false,
            success: function (layero, index) {
                var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                if (edit1) {
                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find("input[name='roleName']").val(edit.roleName);
                    body.find("textarea[name='roleDes']").val(edit.roleDes);
                    body.find(".roleType").val(edit.roleType);
                    if (edit.ownerCompanyId) {
                        // var option1 = $('<option value="'+edit.ownerCompanyId+'">'+edit.ownerCompanyName+'</option>')
                        body.find(".company").attr("ownerCompanyId", edit.ownerCompanyId);
                        body.find(".company").attr("ownerCompanyName", edit.ownerCompanyName);
                    }
                    if (edit.subCompanyId) {
                        // var option2 = $('<option value="'+edit.subCompanyId+'">'+edit.subCompanyName+'</option>')
                        body.find(".companys").attr("subCompanyId", edit.subCompanyId);
                        body.find(".companys").attr("subCompanyName", edit.subCompanyName);
                    }

                    if (edit.roleStatus == 1) {
                        body.find(".roleStatus").val(1)
                        body.find(".roleStatus").attr('checked', true);
                        body.find(".layui-form-checkbox").addClass('layui-form-checked');

                    } else {
                        body.find(".roleStatus input[value=" + edit.roleStatus + "]")
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
            layer.confirm('确定删除选中的角色？', {icon: 3, title: '提示信息'}, function (index) {
                param.url = 'systemCenter/deleteRole';
                ajaxJS(param, {roleIds: idArr.join(',')}, function (d) {
                    tableIns.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg("请选择需要删除的角色");
        }
    });

    //列表操作
    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit('html/system_setup/role_manage/roleAdd.html', '编辑角色', data, 'edit1');
        } else if (layEvent === 'see') {
            addOrEdit('html/system_setup/role_manage/roleSee.html', '查看角色', data, 'edit1');
        } else if (layEvent === 'grant') {
            var index = layer.open({
                title: "角色授权",
                type: 2,
                area: ["750px", "500px"],
                resize: false,
                content: "html/system_setup/role_manage/grantAdd.html?roleId=" + data.id,
                success: function (layero, index) {
                    var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                    body.find(".grant_title span").html(data.roleName);
                }
            })
        }
    });

});

function goLogin() {
    parent.goLogin()

}