layui.use(['form', 'layer', 'laydate', 'table', 'laytpl'], function () {
    var form = layui.form, $ = layui.jquery, layer = parent.layer === undefined ? layui.layer : top.layer;

    var param = {jquery: $, layer: layer, url: 'centerBackend/updatePassword'};


    //修改密码
    form.on("submit(changePwd)", function (data) {
        if($("#oldPwd").val() != $("#confirmPwd").val()){
            layer.msg('两次密码输入不一致')
            return false;
        }
		//判断新密码6-20位
		if($("#oldPwd").val().length<6||$("#oldPwd").val().length>20){
			layer.msg('新密码请设为6-20位')
            return false;
		}

        param.url = 'centerBackend/updatePassword';
        data = {
            oldPassword: $(".oldPassword").val(),
            newPassword: $(".newPassword").val()
        };
        ajaxJS(param, data, function (d) {
            layer.msg(d.desc);
            setTimeout(function () {
                parent.location.href = 'index.html';
            },500)
        });

        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })


    //控制表格编辑时文本的位置【跟随渲染时的位置】
    $("body").on("click", ".layui-table-body.layui-table-main tbody tr td", function () {
        $(this).find(".layui-table-edit").addClass("layui-" + $(this).attr("align"));
    });

})