layui.use(['form', 'layer', "jquery"], function () {
    var form = layui.form, $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: 'systemCenter/getAreaForEdit'};

    if ($('.sign').val() == 'edit') {
        setTimeout(function () {
            ajaxJS(param, {areaId: $('.sign').attr('areaid')}, function (d) {
                var fId = d.data.fId;
                $('.areaName').val(d.data.areaName)

                form.on("submit(addOrEdit)", function (data) {
                    var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
                    param.url = 'systemCenter/updateArea';
                    ajaxJS(param, {
                        areaId: $('.sign').attr('areaid'),
                        fId: fId,
                        areaName: data.field.areaName
                    }, function (d) {
                        top.layer.close(index);
                        top.layer.msg(d.desc);
                        layer.closeAll("iframe");
                        $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                    });
                    return false;
                })
            })
        }, 500);
    } else {
        form.on("submit(addOrEdit)", function (data) {
            var field = data.field;
            var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

            param.url = 'systemCenter/addArea';
            ajaxJS(param, {areaName: field.areaName, fId: $('.sign').attr('areaid')}, function (d) {

                top.layer.msg(d.desc);
                top.layer.close(index);
                layer.closeAll("iframe");
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            });
            return false;
        });
    }


});
