layui.use(['form', 'layer', 'jquery', 'upload'], function () {
    var form = layui.form,
        $ = layui.jquery,
        upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

//全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: '', type: 'post'};


    if (sessionStorage.getItem("roleType") == "0") {
        $(".yzCompanyBox").show();
        getCompany();
    } else{
        $(".yzCompany").val("");
        $(".yzCompanyBox").hide();
    }
    setTimeout(function () {
        $('.companyType').val($('.companyType').attr('companytype'));
        form.render();
    }, 200)

    function getCompany() {
        param.url = "systemCenter/companyDrop",
            ajaxJS(param, {roleId: sessionStorage.getItem("roleId")}, function (res) {
                var data = res.data;
                $(".yzCompany").html("");
                var option = $("<option value=''>请选择</option>");
                $(".yzCompany").append(option);
                for (var i = 0; i < data.length; i++) {
                    option = $("<option value='"+data[i].id+"'>"+data[i].companyName+"</option>");
                    $(".yzCompany").append(option);
                }

                if (UrlParm.parm('pid')) {
                    $(".yzCompany").val(UrlParm.parm('pid'))
                }

            })
        setTimeout(function () {
            form.render();
        }, 200)

    }

    var yzCompany;
    form.on('select(yzCompany)', function (data) {
        yzCompany = data.value;
    });



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
        if (!field.companyType) {
            layer.msg("请选择公司类型");
            return false;
        }
        if (sessionStorage.getItem("roleType") == "0") {
            if (!field.yzCompany) {
                layer.msg("请选择业主公司")
                return false;
            }
        }
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            // companyNo: $('input[name="companyName"]').attr('companyNo'),
            companyName: field.companyName,
            companyType: field.companyType,
            pid: field.yzCompany,
            logoUrl: $('.showImg img').attr('src')
        };

        if ($(".sign").val() == "edit") {  //编辑
            data.companyId = $(".sign").attr("signid");
            param.url = 'systemCenter/updateCompanySub';
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                top.layer.msg(d.desc);
                layer.closeAll("iframe");
                //刷新父页面
                $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
            })
        } else {  //新增
            param.url = 'systemCenter/addCompanySub';
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
