layui.use(['form', 'layer', "jquery"], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: ''};


    param.url = 'systemCenter/getParteDataType';
    ajaxJS(param, {power: 0}, function (d) {
        var data = d.data;
        for (var i = 0;i < data.length;i++){
            if(data[i].pid == '0'){
                var str = ' <option value="'+data[i].id+'">'+data[i].dataTypeName+'</option>';
                $('.pid').append(str)
            }
        }
        $('.pid').val($('.pid').attr('val'));
        form.render();
    });



    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        if (field.pid) {
            data = {
                dataTypeName: field.dataTypeName,
                pid: field.pid
            };
        } else {
            data = {
                dataTypeName: field.dataTypeName,
                pid: "0"
            };
        }

        if ($(".sign").val() == "edit") {  //编辑
            data.dataTypeId = $(".sign").attr("signid");
            param.url = '/systemCenter/updateDataType';
        } else {  //新增
            param.url = 'systemCenter/addDataType';
        }
        ajaxJS(param, data, function (d) {
            top.layer.close(index);
            top.layer.msg(d.desc);
            layer.closeAll("iframe");
            //刷新父页面
            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
        })
        return false;
    });

    $('.cancel').click(function () {
        layer.closeAll()
    });
});
