layui.use(['form', 'layer', 'jquery', 'upload'], function () {
    var form = layui.form, $ = layui.jquery, upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: '', async: false};

    if (sessionStorage.getItem('roleType') == '1') {
        param.url = 'systemCenter/companySubDrop';
        ajaxJS(param, {companyId: sessionStorage.getItem('companyId')}, function (d) {
            var data = d.data;
            $('.partyB').empty();
            $('.partyB').append('<option value="">请选择</option>');
            for (var i = 0; i < data.length; i++) {
                $('.partyB').append('<option value="' + data[i].id + '">' + data[i].companyName + '</option>')
            }
            form.render();
        });
    }


    //获取业主公司
    param.url = 'systemCenter/companyDrop';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        $('.owner').empty();
        $('.owner').append('<option value="">请选择</option>');
        for (var i = 0; i < data.length; i++) {
            $('.owner').append('<option value="' + data[i].id + '">' + data[i].companyName + '</option>')
        }
        if (sessionStorage.getItem('roleType') == '1') {
            $('.owner').val(sessionStorage.getItem('companyId')).attr('disabled', true);
        }
        form.render();
    });

    if (sessionStorage.getItem('roleType') == '1') {
        getRole(2);
    } else {
        getRole(1);
    }


    form.on('select(owner)', function (data) {
        var d = data.value;

        //获得乙方公司
        param.url = 'systemCenter/companySubDrop';
        ajaxJS(param, {companyId: d}, function (d) {
            var data = d.data;
            $('.partyB').empty();
            $('.partyB').append('<option value="">请选择</option>');
            for (var i = 0; i < data.length; i++) {
                $('.partyB').append('<option value="' + data[i].id + '">' + data[i].companyName + '</option>')
            }
            form.render();
        });

        if (d == '') {
            getRole(1)
        } else {
            getRole(2)
        }
    });

    form.on('select(role)', function (data) {
        var d = data.value;
        var roleId = d.split(',')[0];
        var roleStatus = d.split(',')[1];

        if (roleStatus == 0) {
            $('.layui-upload').hide();
        } else {
            $('.layui-upload').show()
        }
    });

    form.on('select(partyB)', function (data) {
        var d = data.value;

        if (d == '') {
            getRole(2)
        } else {
            getRole(3)
        }
    });

    //多文件列表示例
    var demoListView = $('#demoList'),uploadArr = [],
        uploadListIns = upload.render({
            elem: '#test8',
            url: sessionStorage.getItem("imgUrl") + "picture-console/common/file/upload",
            accept: 'file',
            choose: function (obj) {
                var files = this.files = obj.pushFile(), num = 0;
                for (var k in files) {
                    num++;
                }
                if (num > 1) {
                    return;
                }
                //读取本地文件
                obj.preview(function (index, file, result) {
                    var tr = $(['<tr id="upload-' + index + '">',
                        '<td>' + file.name + '</td>',
                        '<td>等待上传</td>', '<td>',
                        '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>',
                        '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>',
                        '</td>',
                        '</tr>'].join(''));

                    //单个重传
                    tr.find('.demo-reload').on('click', function () {
                        obj.upload(index, file);
                    });

                    //删除
                    tr.find('.demo-delete').on('click', function () {
                        delete files[index]; //删除对应的文件
                        tr.remove();
                        uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                    });
                    demoListView.html(tr);
                });
            },
            done: function (res, index, upload) {
                if (res.code == 200) { //上传成功
                    uploadArr = res.data;
                    var tr = demoListView.find('tr#upload-' + index),
                        tds = tr.children();
                    tds.eq(1).html('<span style="color: #5FB878;">上传成功</span>');
                    return delete this.files[index]; //删除文件队列已经上传成功的文件
                }
                this.error(index, upload);
            },
            error: function (index, upload) {
                var tr = demoListView.find('tr#upload-' + index)
                    , tds = tr.children();
                tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
                tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
            }
        });


    form.on('submit(putin)', function (data) {
        var field = data.field;
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        var roleId = field.role.split(',')[0];
        var roleStatus = field.role.split(',')[1];
        if (roleStatus == 1 && uploadArr.length == 0) {
            layer.msg('请上传文件');
            return false;
        }
        if (uploadArr[0]) {
            var qualify = uploadArr[0].fileUrl;
            var fileName = uploadArr[0].fileName;
        } else {
            var qualify = '';
            var fileName = '';
        }

        var data = {
            roleIds: roleId,
            empAccount: field.empAccount,
            empName: field.empName,
            qualify: qualify,
            fileName: fileName,
            phone: field.phone,
            email: field.email,
            ownerCompanyId: field.owner,
            subCompanyId: field.partyB
        };

        param.url = 'systemCenter/addEmp';
        ajaxJS(param, data, function (d) {
            top.layer.msg(d.desc);
            top.layer.close(index);
            layer.closeAll("iframe");
            //刷新父页面
            $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
        });

        return false;
    });


    function getRole(type) {
        param.url = 'systemCenter/roleDrop';
        ajaxJS(param, {type: type}, function (d) {
            var data = d.data;
            $('.role').empty();
            $('.role').append('<option value="">请选择</option>');
            for (var i = 0; i < data.length; i++) {
                $('.role').append('<option value="' + data[i].id + ',' + data[i].roleStatus + '">' + data[i].roleName + '</option>')
            }
            form.render();
        });
    }
});
