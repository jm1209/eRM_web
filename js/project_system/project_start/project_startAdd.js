layui.use(['form', 'layer', "jquery", 'laydate', "upload"], function () {
    var form = layui.form, $ = layui.jquery, laydate = layui.laydate, upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var param = {jquery: $, layer: layer, url: ''};

    //获取业主公司
    param.url = 'systemCenter/companyDrop';
    ajaxJS(param, {companyListType: 0}, function (d) {
        var data = d.data;
        for (var i = 0; i < data.length; i++) {
            var str = '<option value="' + data[i].id + '">' + data[i].companyName + '</option>';
            $('.companyId').append(str);
        }
        if (sessionStorage.getItem('companyId') != 'null') {
            $('.companyId').val(sessionStorage.getItem('companyId'));
        }
    });
    if (sessionStorage.getItem('companyId') != 'null') {
        param.url = 'systemCenter/companyProjectDrop';
        ajaxJS(param, {companyId: sessionStorage.getItem('companyId')}, function (d) {
            var data = d.data;
            $('.companyProject').empty();
            $('.companyProject').append('<option value="">请选择</option>');
            for (var i = 0; i < data.length; i++) {
                var str = '<option value="' + data[i].id + '">' + data[i].companyName + '</option>';
                $('.companyProject').append(str);
            }
        });

        //获取项目经理
        param.url = 'systemCenter/getEmpDrop';
        ajaxJS(param, {roleType: 2, companyId: sessionStorage.getItem('companyId')}, function (d) {
            var data = d.data;
            for (var i = 0; i < data.length; i++) {
                var str = '<option value="' + data[i].empId + '">' + data[i].empName + '</option>';
                $('.manager').append(str);
            }
        });
    }

    $('.companyId').change(function () {
        //获取项目公司
        param.url = 'systemCenter/companyProjectDrop';
        ajaxJS(param, {companyId: $(this).val()}, function (d) {
            var data = d.data;
            $('.companyProject').empty();
            $('.companyProject').append('<option value="">请选择</option>');
            for (var i = 0; i < data.length; i++) {
                var str = '<option value="' + data[i].id + '">' + data[i].companyName + '</option>';
                $('.companyProject').append(str);
            }
        });

        //获取项目经理
        param.url = 'systemCenter/getEmpDrop';
        ajaxJS(param, {roleType: 2, companyId: $(this).val()}, function (d) {
            var data = d.data;
            $('.manager').empty();
            $('.manager').append('<option value="">请选择</option>');
            for (var i = 0; i < data.length; i++) {
                var str = '<option value="' + data[i].empId + '">' + data[i].empName + '</option>';
                $('.manager').append(str);
            }
        });
    });


    $('.areaName').click(function () {
        var self = this;
        layer.open({
            title: '选择城市',
            type: 2,
            area: ["350px", "350px"],
            content: "html/project_setup/project_start/linkage.html",
            btn: ['确定'],
            yes: function (index, layero) {
                var body = layer.getChildFrame('body', index);
                var province = body.find('#province').val();
                var city = body.find('#city').val();
                var town = body.find('#town').val();
                if (province == '请选择') {
                    $(self).val('');
                } else if (city == '请选择' || city == '') {
                    var adress = province
                } else if (town == '请选择' || town == '') {
                    var adress = province + ',' + city;
                } else {
                    var adress = province + ',' + city + ',' + town;
                }
                $(self).val(adress);
                layer.close(index);
            }
        })
    });


    //选择并网时间
    laydate.render({
        elem: '.connectGridTime'
    });


    var enrollArr = [];
    var recordArr = [];
    var accessArr = [];
    var scienceArr = [];


    //公司注册信息上传文件
    upload.render({
        elem: '.enroll',
        accept: 'file',
        multiple: true,
        url: sessionStorage.getItem("imgUrl") + "picture-console/common/file/upload",
        done: function (res) {
            if (res.code == '200') {
                enrollArr.push(res.data[0]);
                var d = res.data;
                var tr = '<tr>' +
                    '     <td class="fileName">' + d[0].fileName + '</td>' +
                    '     <td>' + d[0].fileSize + '</td>' +
                    '     <td class="uploadok">上传成功</td>' +
                    '     <td><button class="layui-btn layui-btn-danger layui-btn-sm" onclick="registerDel(this)">删除</button></td>' +
                    '     </tr>';
                $('#enrollBox').append(tr);
            }
        }
    });

    //备案信息上传文件
    upload.render({
        elem: '.record',
        accept: 'file',
        multiple: true,
        url: sessionStorage.getItem("imgUrl") + "picture-console/common/file/upload",
        done: function (res) {
            if (res.code == '200') {
                var d = res.data;
                recordArr.push(res.data[0])
                var tr = '<tr>' +
                    '     <td  class="fileName">' + d[0].fileName + '</td>' +
                    '     <td>' + d[0].fileSize + '</td>' +
                    '     <td class="uploadok">上传成功</td>' +
                    '     <td><button class="layui-btn layui-btn-danger layui-btn-sm" onclick="recordDel(this)">删除</button></td>' +
                    '     </tr>';
                $('#recordBox').append(tr);
            }
        }
    });

    //接入信息及手续办理状态上传文件
    upload.render({
        elem: '.access',
        accept: 'file',
        multiple: true,
        url: sessionStorage.getItem("imgUrl") + "picture-console/common/file/upload",
        done: function (res) {
            if (res.code == '200') {
                accessArr.push(res.data[0]);
                var d = res.data;
                var tr = '<tr>' +
                    '     <td class="fileName">' + d[0].fileName + '</td>' +
                    '     <td>' + d[0].fileSize + '</td>' +
                    '     <td class="uploadok">上传成功</td>' +
                    '     <td><button class="layui-btn layui-btn-danger layui-btn-sm" onclick="accessDel(this)">删除</button></td>' +
                    '     </tr>';
                $('#accessBox').append(tr);
            }
        }
    });

    //科研或初设资料文件
    upload.render({
        elem: '.science',
        accept: 'file',
        multiple: true,
        url: sessionStorage.getItem("imgUrl") + "picture-console/common/file/upload",
        done: function (res) {
            if (res.code == '200') {
                scienceArr.push(res.data[0]);
                var d = res.data;
                var tr = '<tr>' +
                    '     <td class="fileName">' + d[0].fileName + '</td>' +
                    '     <td>' + d[0].fileSize + '</td>' +
                    '     <td class="uploadok">上传成功</td>' +
                    '     <td><button class="layui-btn layui-btn-danger layui-btn-sm" onclick="scienceDel(this)">删除</button></td>' +
                    '     </tr>';
                $('#scienceBox').append(tr);
            }
        }
    });

    //公司注册信息上传文件删除
    registerDel = function (self) {
        var fileName = $(self).parents('tr').find('.fileName').html();
        var num = 0;
        for (var i = 0; i < enrollArr.length; i++) {
            if (enrollArr[i].fileName == fileName) {
                num = i;
                break;
            }
        }
        var arr1 = enrollArr.splice(0, i);
        var arr2 = enrollArr.splice(i + 1, enrollArr.length);
        enrollArr = arr1.concat(arr2);
        $(self).parents('tr').remove();
    }

    //备案信息上传文件删除
    recordDel = function (self) {
        var fileName = $(self).parents('tr').find('.fileName').html();
        var num = 0;
        for (var i = 0; i < recordArr.length; i++) {
            if (recordArr[i].fileName == fileName) {
                num = i;
                break;
            }
        }
        var arr1 = recordArr.splice(0, i);
        var arr2 = recordArr.splice(i + 1, recordArr.length);
        recordArr = arr1.concat(arr2);
        $(self).parents('tr').remove();
    }

    //接入信息及手续办理状态上传文件删除
    accessDel = function (self) {
        var fileName = $(self).parents('tr').find('.fileName').html();
        var num = 0;
        for (var i = 0; i < accessArr.length; i++) {
            if (accessArr[i].fileName == fileName) {
                num = i;
                break;
            }
        }
        var arr1 = accessArr.splice(0, i);
        var arr2 = accessArr.splice(i + 1, accessArr.length);
        accessArr = arr1.concat(arr2);
        $(self).parents('tr').remove();
    }

    //科研或初设资料文件删除
    scienceDel = function (self) {
        var fileName = $(self).parents('tr').find('.fileName').html();
        var num = 0;
        for (var i = 0; i < scienceArr.length; i++) {
            if (scienceArr[i].fileName == fileName) {
                num = i;
                break;
            }
        }
        var arr1 = scienceArr.splice(0, i);
        var arr2 = scienceArr.splice(i + 1, scienceArr.length);
        scienceArr = arr1.concat(arr2);
        $(self).parents('tr').remove();
    }

    $('.keep').click(function () {
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        if ($('.projectNo').val() == '') {
            layer.msg('项目编号不能为空!');
            return;
        }
        var data = getData();

        data.submitType = 0;
        param.url = 'projectBackend/addProject';
        ajaxJS(param, data, function (d) {
            layer.msg(d.desc);
            top.layer.close(index);
            layer.closeAll("iframe");
            parent.location.reload();
        })

    });

    $('.hand').click(function () {
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = noEmpty();
        if (data) {
            data.submitType = 1;
            param.url = 'projectBackend/addProject';
            ajaxJS(param, data, function (d) {
                top.layer.close(index);
                layer.msg(d.desc);
                layer.closeAll("iframe");
                parent.location.reload();
            })
        }
    });

    function getData() {
        var data = {
            projectNo: $('.projectNo').val(),
            projectName: $('.projectName').val(),
            companyId: $('.companyId').val(),
            companyProject: $('.companyProject').val(),
            recordInfo: $('.recordInfo').val(),
            registerDataIds: JSON.stringify(enrollArr),
            accessInfo: $('.accessInfo').val(),
            baseInfo: $('.baseInfo').val(),
            recordIds: JSON.stringify(recordArr),
            accessIds: JSON.stringify(accessArr),
            scienceIds: JSON.stringify(scienceArr),
            projectType: $('.projectType').val(),
            areaName: $('.areaName').val(),
            manager: $('.manager').val(),
            connectGridTime: $('.connectGridTime').val(),
            capacity: $('.capacity').val(),
            others: $('.others').val()
        };
        return data;
    }

    function noEmpty() {
        if ($('.projectNo').val() == '') {
            layer.msg('项目编号不能为空!');
            return false;
        }
        if ($('.projectType').val() == '') {
            layer.msg('项目类型不能为空!');
            return false;
        }
        if ($('.projectName').val() == '') {
            layer.msg('项目名称不能为空!');
            return false;
        }
        if ($('.companyId').val() == '') {
            layer.msg('项目公司不能为空!');
            return false;
        }
        if ($('.areaName').val() == '') {
            layer.msg('区域不能为空!');
            return false;
        }
        if ($('.manager').val() == '') {
            layer.msg('甲方项目经理不能为空!');
            return false;
        }
        if ($('.connectGridTime').val() == '') {
            layer.msg('并网时间不能空!');
            return false;
        }
        if ($('.capacity').val() == '') {
            layer.msg('并网容量不能空!');
            return false;
        }
        if (enrollArr.length == 0) {
            layer.msg('请选择公司注册文件!');
            return false;
        }
        if (recordArr.length == 0) {
            layer.msg('请选择备案文件!');
            return false;
        }
        if (accessArr.length == 0) {
            layer.msg('请选择相关手续文件!');
            return;
        }
        return getData();
    }

});
