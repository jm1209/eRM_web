layui.use(['form', 'layer', "jquery"], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: '', type: 'post'};

    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var data = {
            defName: field.defName,
            defText: field.defText
        };

        if ($(".sign").val() == "edit") {  //编辑
            data.defId = $(".sign").attr("signid");
            param.url = 'systemCenter/updateDefact';
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                top.layer.msg(d.desc);
                layer.closeAll("iframe");
                //刷新父页面
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            })
        } else {  //新增
            param.url = 'systemCenter/addDefact';
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                top.layer.msg(d.desc);
                layer.closeAll("iframe");
                //刷新父页面
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            })
        }
        return false;
    });

    $('.cancel').click(function () {
        layer.closeAll("iframe");
    });
});
