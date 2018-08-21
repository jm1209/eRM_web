layui.use(['form', 'layer', "jquery", 'laydate', "upload"], function () {
    var form = layui.form, $ = layui.jquery, laydate = layui.laydate, upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var param = {jquery: $, layer: layer, url: 'projectBackend/getProjectById'};

    setTimeout(function () {
        ajaxJS(param, {projectId: $('.sign').attr('signid')}, function (d) {
            var d = d.data;
            var companyId = d.companyId;
            var manager = d.manager;
            var companyProject = d.companyProject;
            var scienceList = d.scienceList;
            var registerList = d.registerList;
            var recordList = d.recordList;
            var accessList = d.accessList;


            if (scienceList) {
                //科研或初设资料文件
                for (var i = 0; i < scienceList.length; i++) {
                    var scienceTr = '<tr>' +
                        '            <td class="fileName">' + scienceList[i].fileName + '</td>' +
                        '            <td>' + scienceList[i].fileSize + '</td>' +
                        '            <td class="uploadok">上传成功</td>' +
                        '            <td><button class="layui-btn layui-btn-danger layui-btn-sm" onclick="scienceDel(this)">删除</button></td>' +
                        '            </tr>';
                    $('#scienceBox').append(scienceTr);
                }
            }


            if (registerList) {
                //公司注册信息
                for (var i = 0; i < registerList.length; i++) {
                    var registerTr = '<tr>' +
                        '            <td class="fileName">' + registerList[i].fileName + '</td>' +
                        '            <td>' + registerList[i].fileSize + '</td>' +
                        '            <td class="uploadok">上传成功</td>' +
                        '            <td><button class="layui-btn layui-btn-danger layui-btn-sm" onclick="registerDel(this)">删除</button></td>' +
                        '            </tr>';
                    $('#enrollBox').append(registerTr);
                }
            }

            if (recordList) {
                //备案信息
                for (var i = 0; i < recordList.length; i++) {
                    var recordTr = '<tr>' +
                        '            <td class="fileName">' + recordList[i].fileName + '</td>' +
                        '            <td>' + recordList[i].fileSize + '</td>' +
                        '            <td class="uploadok">上传成功</td>' +
                        '            <td><button class="layui-btn layui-btn-danger layui-btn-sm" onclick="recordDel(this)">删除</button></td>' +
                        '            </tr>';
                    $('#recordBox').append(recordTr);
                }
            }

            if (accessList) {
                //接入信息及手续办理状态
                for (var i = 0; i < accessList.length; i++) {
                    var accessTr = '<tr>' +
                        '            <td class="fileName">' + accessList[i].fileName + '</td>' +
                        '            <td>' + accessList[i].fileSize + '</td>' +
                        '            <td class="uploadok">上传成功</td>' +
                        '            <td><button class="layui-btn layui-btn-danger layui-btn-sm" onclick="accessDel(this)">删除</button></td>' +
                        '            </tr>';
                    $('#accessBox').append(accessTr);
                }
            }


            $('.projectNo').val(d.projectNo);
            $('.projectName').val(d.projectName);
            $('.projectType').val(d.projectType);
            $('.areaName').val(d.areaName);
            $('.connectGridTime').val(d.connectGridTime);
            $('.capacity').val(d.capacity);
            $('.recordInfo').val(d.recordInfo);
            $('.accessInfo').val(d.accessInfo);
            $('.baseInfo').val(d.baseInfo);
            $('.others').val(d.others);


            //获取业主公司
            param.url = 'systemCenter/companyDrop';
            ajaxJS(param, {companyListType: 0}, function (company) {
                var data = company.data;
                for (var i = 0; i < data.length; i++) {
                    var str = '<option value="' + data[i].id + '">' + data[i].companyName + '</option>';
                    $('.companyId').append(str);
                }
                $('.companyId').val(companyId)
            });

            //获取项目公司
            param.url = 'systemCenter/companyProjectDrop';
            ajaxJS(param, {companyId: companyId}, function (d) {
                var data = d.data;
                $('.companyProject').empty();
                $('.companyProject').append('<option value="">请选择</option>');
                for (var i = 0; i < data.length; i++) {
                    var str = '<option value="' + data[i].id + '">' + data[i].companyName + '</option>';
                    $('.companyProject').append(str);
                }
                $('.companyProject').val(companyProject)
            });

            //获取项目经理
            param.url = 'systemCenter/getEmpDrop';
            ajaxJS(param, {roleType: 2,companyId:companyId}, function (emp) {
                var data = emp.data;
                for (var i = 0; i < data.length; i++) {
                    var str = '<option value="' + data[i].empId + '">' + data[i].empName + '</option>';
                    $('.manager').append(str);
                }
                $('.manager').val(d.manager);
            });

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

            $('.upload').each(function () {
                $(this).click(function () {
                    var form = $("<form>");
                    form.attr("style", "display:none");
                    form.attr("target", "");
                    form.attr("method", "post");
                    form.attr("action", imgUrl + 'picture-console/common/file/download');
                    form.append('<input type="hidden" name="fileName" value="' + $(this).attr('fileName') + '" />')
                    form.append('<input type="hidden" name="fileUrl" value="' + $(this).attr('fileUrl') + '" />')
                    form.append('<input type="hidden" name="isOnLine" value="false" />')
                    $("body").append(form);
                    form.submit();
                })
            })


            //选择城市
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

            var scienceArr = d.scienceList || [];
            var enrollArr = d.registerList || [];
            var recordArr = d.recordList || [];
            var accessArr = d.accessList || [];


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
                param.url = 'projectBackend/updateProject';
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
                data.submitType = 1;
                param.url = 'projectBackend/updateProject';
                ajaxJS(param, data, function (d) {
                    top.layer.close(index);
                    layer.msg(d.desc);
                    layer.closeAll("iframe");
                    parent.location.reload();
                })
            });

            function getData() {
                var data = {
                    projectId: $('.sign').attr('signid'),
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
                    return;
                }
                if ($('.projectName').val() == '') {
                    layer.msg('项目名称不能为空!');
                    return;
                }
                if ($('.companyId').val() == '') {
                    layer.msg('项目公司不能为空!');
                    return;
                }
                if ($('.areaName').val() == '') {
                    layer.msg('区域不能为空!');
                    return;
                }
                if ($('.manager').val() == '') {
                    layer.msg('甲方项目经理不能为空!');
                    return;
                }
                if ($('.connectGridTime').val() == '') {
                    layer.msg('并网时间不能空!');
                    return;
                }
                if ($('.capacity').val() == '') {
                    layer.msg('并网容量不能空!');
                    return;
                }
                if (enrollArr.length == 0) {
                    layer.msg('请选择公司注册文件!');
                    return;
                }
                if (recordArr.length == 0) {
                    layer.msg('请选择备案文件!');
                    return;
                }
                if (accessArr.length == 0) {
                    layer.msg('请选择相关手续文件!');
                    return;
                }
                return getData();
            }
        }, 500)
    })
});
