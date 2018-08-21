    layui.use(['layer', 'jquery', 'form'], function () {
    var $ = layui.jquery, form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer;


    var roleId = UrlParm.parm('roleId');
    var e = UrlParm.parm('e');
    var selectrole = "";
    var roleType;
    var ownerCompanyName = UrlParm.parm('ownerCompanyName'),
        ownerCompanyId = UrlParm.parm('ownerCompanyId'),
        subCompanyName = UrlParm.parm('subCompanyName'),
        subCompanyId = UrlParm.parm('subCompanyId'),
        selectrole = UrlParm.parm('selectrole');
    if (selectrole) {
        roleType = selectrole;
    }
    var param = {jquery: $, layer: layer, url: '', type: 'post'};
    getRole();
    if (roleId) {
        $(".companyBox").hide();
        $(".companysBox").hide();

        if (ownerCompanyId) {
            $(".companyBox").show()
            var option1 = $('<option value="' + ownerCompanyId + '">' + ownerCompanyName + '</option>')
            $(".company").append(option1)
        }
        if (subCompanyId) {
            $(".companysBox").show()
            var option2 = $('<option value="' + subCompanyId + '">' + subCompanyName + '</option>')
            $(".companys").append(option2)
        }


        form.render();
    } else {

    }

    //获取用户权限
    function getRole() {
        var role = sessionStorage.getItem("roleType");
        if (role == 0) {
            $('.roleType').html("");
            var option = $("<option value=''>请选择</option><option value='0'>优得管理员</option><option value='1'>业主方管理员</option><option value='2'>业主方角色管理</option><option value='3'>乙方角色管理</option>");
            $('.roleType').append(option);
        } else if (role == 1) {
            $('.roleType').html("");
            var option = $("<option value=''>请选择</option><option value='2'>业主方角色管理</option><option value='3'>乙方角色管理</option>");
            $('.roleType').append(option);
            /*getCompany('0');
            getCompanys(sessionStorage.getItem("companyId"));*/
            // $(".companys").val()
        }
        if (selectrole) {
            $('.roleType').val(selectrole);
        }
        form.render();
    }


    form.on("select(roleType)", function (data) {
        roleType = data.value;
        if (roleType == 0) {
            $(".company").val("")
            $(".companys").val("")
            $(".companyBox").hide();
            $(".companysBox").hide();
        } else if (roleType == 1) {
            $(".companyBox").show();
            $(".companysBox").hide();
            $(".companys").val("");
            getCompany("0");
        } else {
            $(".companyBox").show();
            $(".companysBox").show();
            getCompany("0");
            getCompany("1");
        }
        form.render();
    });
    var company = ownerCompanyId;
    form.on("select(company)", function (data) {
        company = data.value;
        getCompanys(company);
    });
    var companys = subCompanyId;
    form.on("select(companys)", function (data) {
        companys = data.value;
    });

    function getCompany(id) {
        param.url = "systemCenter/companyDrop",
            ajaxJS(param, {companyListType: id, roleId: sessionStorage.getItem("roleId")}, function (res) {
                var data = res.data;
                $(".company").html("");
                company = data[0].id;
                $('.company').append("<option value=''>请选择</option>")
                for (var i = 0; i < data.length; i++) {
                    var option = $("<option value='" + data[i].id + "'>" + data[i].companyName + "</option>");
                    $(".company").append(option);
                }


            })
        setTimeout(function () {
            if (ownerCompanyId) {
                $(".company").val(ownerCompanyId)
            }
            form.render();
        }, 200)

    }

    function getCompanys(id) {
        param.url = "systemCenter/companySubDrop",
            ajaxJS(param, {companyId: id, roleId: sessionStorage.getItem("roleId")}, function (res) {
                var data = res.data;
                $(".companys").html("");
                companys = data[0].id
                for (var i = 0; i < data.length; i++) {
                    var option = $("<option value='" + data[i].id + "'>" + data[i].companyName + "</option>");
                    $(".companys").append(option);
                }


            })
        setTimeout(function () {
            if (subCompanyId) {
                $(".companys").val(subCompanyId);
            }
            form.render();
        }, 200)
    }


    if (e == 'edit') {
        var setting = {
            async: {
                enable: true,
                type: "post",
                url: interfaceUrl + "systemCenter/getRoleForEdit",
                otherParam: {
                    roleId: roleId,
                    token: sessionStorage.getItem("token"),
                    power: 0
                },
                dataType: 'json'
            },
            check: {
                enable: true
            },
            data: {
                key: {
                    children: "child",
                    name: "dataTypeName"
                }
            }
        };
        $.fn.zTree.init($("#tree"), setting);
    } else {
        var setting = {
            async: {
                enable: true,
                type: "post",
                url: interfaceUrl + "systemCenter/dataTypeDrop",
                otherParam: {
                    roleId: roleId,
                    token: sessionStorage.getItem("token"),
                    power: 0
                },
                dataType: 'json'
            },
            check: {
                enable: true
            },
            data: {
                key: {
                    children: "child",
                    name: "dataTypeName"
                }
            }
        };
        $.fn.zTree.init($("#tree"), setting);
    }


    $("#grantBtn").click(function () {
        var ownerCompanyIds, subCompanyIds;

        ownerCompanyId = company;
        ownerCompanyIds = company;
        subCompanyIds = companys;

        if (!roleType || roleType == '请选择') {
            layer.msg("请选择角色类型");
            return false;
        }
        if (!$(".roleName").val()) {
            layer.msg("请输入角色名称");
            return false;
        }
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var treeObj = $.fn.zTree.getZTreeObj("tree");
        var nodes = treeObj.getCheckedNodes(true);
        var values = [];
        for (var i = 0; i < nodes.length; i++) {
            values.push(nodes[i].id);
        }

        if ($('.layui-unselect').hasClass('layui-form-checked')) {
            var roleStatus = '1'
        } else {
            var roleStatus = '0'
        }
        if (e == 'edit') {
            param.url = 'systemCenter/updateRole';
        } else {
            param.url = 'systemCenter/addRole';
        }
        var data = {
            roleId: roleId,
            roleType: roleType,
            ownerCompanyId: company,
            subCompanyId: companys,
            dataTypeIds: values.join(','),
            roleStatus: roleStatus,
            roleName: $('input[name="roleName"]').val(),
            roleDes: $('textarea[name="roleDes"]').val(),
        };

        ajaxJS(param, data, function (d) {
            top.layer.close(index);
            top.layer.msg(d.desc);
            layer.closeAll("iframe");
            //刷新父页面
            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
        })
    });

    $(".cancel").click(function () {
        layer.closeAll("iframe");
    });


});


