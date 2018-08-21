layui.use(['form', 'layer', "jquery"], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    localStorage.setItem('loginUrl', location.href);

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: 'centerBackend/login', type: 'post'};

    //当记住密码时
    if (localStorage.getItem('loginData') != '' && localStorage.getItem('loginData') != null) {
        var data = JSON.parse(localStorage.getItem('loginData'));
        $('input[name="loginAccount"]').val(data.loginAccount);
        $('input[name="password"]').val(data.password);
        $('input[name="remember"]').attr('checked', 'true');
        form.render();
    }

    //表单验证
    form.verify({
        loginAccount: function (value, item) {
            if (value == "") {
                return '账号不能为空！';
            }
        },
        password: function (value) {
            if (value == "") {
                return '密码不能为空！';
            }
        }
    });

    //登录按钮
    form.on("submit(login)", function (data) {
        var field = data.field;
        var data = {
            loginAccount: field.loginAccount,
            password: field.password
        };
        login(data);
        return false;
    });

    //键盘回车事件
    $(document).keydown(function (e) {
        var data = {
            loginAccount: $("input[name='loginAccount']").val(),
            password: $("input[name='password']").val()
        };
        if (e.keyCode == 13) {
            if ($("#loginAccount").val() == "") {
                layer.msg('账号不能空！', {icon: 5});
                $(this).addClass("layui-input-focus").find(".layui-input").focus();
                return;
            }
            if ($("#password").val() == "") {
                layer.msg('密码不能空！', {icon: 5});
                $(this).addClass("layui-input-focus").find(".layui-input").focus();
                return;
            }
            login(data)
        }
    });

    //封装登录方法
    function login(data) {
        ajaxJS(param, data, function (d) {
            sessionStorage.setItem("loginName", d.data.loginAccount);
            sessionStorage.setItem("token", d.data.token);
            sessionStorage.setItem("empId", d.data.id);
            sessionStorage.setItem("roleId", d.data.id);
            sessionStorage.setItem("roleType", d.data.roleType);
            sessionStorage.setItem("companyId", d.data.companyId);
            sessionStorage.setItem("companyName", d.data.companyName);
            if (d.data.roleType == "1") {
                sessionStorage.setItem("companyId", d.data.companyId);
            }
            if ($('.layui-unselect').hasClass('layui-form-checked')) {
                localStorage.setItem('loginData', JSON.stringify(data));
            } else {
                localStorage.removeItem('loginData');
            }
            var resourceList = d.data.resourceList;
            var resourceArr = [];
            for (var i = 0; i < resourceList.length; i++) {
                resourceArr.push(resourceList[i].resUrl)
            }
            sessionStorage.setItem('resourceArr', JSON.stringify(resourceArr));
            setTimeout(function () {
                window.location.href = "home.html";
            }, 500);
            layer.msg(d.desc);
        });
    }
});


