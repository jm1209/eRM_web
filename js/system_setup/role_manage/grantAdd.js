layui.use(['layer', 'jquery'], function () {
    var $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var roleId = UrlParm.parm("roleId");//从链接地址获取roleId

    var param = {jquery: $, layer: layer, url: '', type: 'post'};

    var setting = {
        async: {
            enable: true,
            type: "post",
            url: interfaceUrl + "systemCenter/getRoleResource",
            otherParam: {
                roleId: roleId,
                token: sessionStorage.getItem("token")
            },
            dataType: 'json'
        },
        check: {
            enable: true,
            chkboxType: { "Y": "s", "N": "s" }
        },
        data: {
            key: {
                children: "nodes",
                name: "resName"
            }
        }
    };
    $.fn.zTree.init($("#tree"), setting);

    $("#grantBtn").click(function () {
        var treeObj = $.fn.zTree.getZTreeObj("tree");
        var nodes = treeObj.getCheckedNodes(true);
        var values = [];
        for (var i = 0; i < nodes.length; i++) {
            values.push(nodes[i].id);
        }
        param.url = 'systemCenter/updateRolePower';
        ajaxJS(param, {roleId: roleId, resourceIds: values.join(',')}, function (d) {
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


