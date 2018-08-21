layui.use(['form', 'layer', "jquery"], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    sessionStorage.setItem('loginUrl', location.href);

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: 'centerBackend/resetPassword'};


    //登录按钮
    form.on("submit(next)", function (data) {
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var field = data.field;
        if (field.account == "") {
            layer.msg('账号不能空！', {icon: 5});
            $(this).addClass("layui-input-focus").find(".layui-input").focus();
            return false;
        }

        if (field.email == "") {
            layer.msg('邮箱不能空！', {icon: 5});
            $(this).addClass("layui-input-focus").find(".layui-input").focus();
            return false;
        }
        if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(field.email)) {
            layer.msg('邮箱不匹配', {icon: 5});
            $(this).addClass("layui-input-focus").find(".layui-input").focus();
            return false;
        }
        var data = {
            account: field.account,
            email: field.email
        };
        ajaxJS(param, data, function (d) {
            if (d.code == '200') {
                top.layer.close(index);
                layer.msg(d.desc)
                setTimeout(function () {
                    location.href = 'index.html';
                }, 500)
            }
        });
        return false;
    });

    /*//键盘回车事件
    $(document).keydown(function (e) {
        var data = {
            account: $("input[name='account']").val(),
            email: $("input[name='email']").val()
        };
        if (e.keyCode == 13) {
            if ($("#loginAccount").val() == "") {
                layer.msg('账号不能空！', {icon: 5});
                $(this).addClass("layui-input-focus").find(".layui-input").focus();
                return;
            }
            if ($("#password").val() == "") {
                layer.msg('邮箱不能空！', {icon: 5});
                $(this).addClass("layui-input-focus").find(".layui-input").focus();
                return;
            }
            login(data)
        }
    });*/

});
