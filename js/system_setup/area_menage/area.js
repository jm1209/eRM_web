layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var logToken = sessionStorage.getItem("logToken");//从本地缓存获取token值


    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: ''};

    var resourceArr = JSON.parse(sessionStorage.getItem('resourceArr'));
    $('.addShow,.delShow,.updateShow').hide();
    if(resourceArr) {
        for (var i = 0; i < resourceArr.length; i++) {
            if (resourceArr[i] == 'addArea') {
                $('.addShow').show();
            }
            if (resourceArr[i] == 'delArea') {
                $('.delShow').show();
            }
            if (resourceArr[i] == 'updateArea') {
                $('.updateShow').show();
            }
        }
    }

    treeInit();

    function treeInit() {
        param.url = "systemCenter/getAreaList";
        ajaxJS(param, {}, function (d) {
            $('#treeview').treeview({
                data: d.data,
                levels: 1
            });
        });
    }

    $(".addPage").click(function () {
        addOrEdit()
    });

    $(".editPage").click(function () {
        addOrEdit("edit");
    });

    $(".delPage").click(function () {
        del();
    });

    function addOrEdit(edit) {
        var node = $('#treeview').treeview('getSelected');
        if (edit && node.length < 1) {
            layer.msg('请选择区域');
            return;
        }
        var index = layer.open({
            title: "资源信息",
            type: 2,
            area: ["750px", "580px"],
            content: "html/system_setup/area_menage/areaAdd.html",
            success: function (layero, index) {
                var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);

                if (node[0]) {
                    var areaId = node[0].areaId
                } else {
                    var areaId = 0;
                }
                body.find('.sign').attr('areaId', areaId);
                if (edit) {
                    body.find('.sign').val(edit);
                }
            }
        })

    }

    // 删除操作
    function del() {
        var node = $('#treeview').treeview('getSelected');
        if (node.length == 1) {
            var pid = node[0].pid;
            if (pid == "0" || pid == 0) {
                layer.msg("根节点不允许删除！");
                return false;
            }
            layer.confirm('确定删除选中的节点？', {icon: 3, title: '提示信息'}, function (index) {
                delInfo();
            });
        } else {
            layer.msg("请选择一个节点！");
        }
    }

    // 删除请求
    function delInfo() {
        var node = $('#treeview').treeview('getSelected');
        var id = node[0].areaId;
        param.url = 'systemCenter/deleteArea';
        ajaxJS(param, {areaIds: id}, function (d) {
            layer.closeAll('loading');
            layer.msg(d.desc);
            treeInit();
        })
    }
});

function goLogin() {
    parent.goLogin()

}