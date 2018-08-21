layui.use(['form', 'layer', 'jquery', 'upload'], function () {
    var form = layui.form,
        $ = layui.jquery,
        upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;





    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: '', type: 'post'};


    upload.render({
        elem: '#uploadImg',
        url: imgUrl + 'picture-console/common/file/upload',
        field: 'file',
        done: function (res, index, upload) {
            layer.msg('上传成功');
            if (res.code !== 200) {
                return;
            }

            $('.showImg img').attr('src', imgUrl+res.data[0].fileUrl);
            $('.showImg').show();
            $('.upload-wrapper').hide();
        }
    });
    if ($(".sign").val() != "edit") {  //编辑
        param.url = 'systemCenter/getCompanyNo';
        ajaxJS(param, {}, function (d) {
            $('input[name="companyName"]').attr('companyNo', d.data)
        })
    };

    $('.closeImg').click(function (e) {
        var e = e || event;
        e.cancelBubble = true;
        e.stopPropagation();

        $('.upload-wrapper').show();
        $('.showImg img').attr("src", "");
        $('.showImg').hide();
    });

    form.on("submit(addOrEdit)", function (data) {
        var field = data.field;
       
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var data = {
            // companyNo: $('input[name="companyName"]').attr('companyNo'),
            companyName: field.companyName,
            companyType: field.companyType,
            // phone: field.phone,
            // email: field.email,
            logoUrl: $('.showImg img').attr('src')
        };

        if ($(".sign").val() == "edit") {  //编辑
            data.companyId = $(".sign").attr("signid");
            param.url = 'systemCenter/updateCompany';
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                top.layer.msg(d.desc);
                layer.closeAll("iframe");
                //刷新父页面
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            })
        } else {  //新增
            param.url = 'systemCenter/addCpmany';
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
