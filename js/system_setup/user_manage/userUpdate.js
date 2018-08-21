layui.use(['form', 'layer', 'jquery', 'upload'], function () {
    var form = layui.form, $ = layui.jquery, upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: 'systemCenter/getEmpForEdit', async: false};

    var uploadArr = [];
    setTimeout(function () {
        ajaxJS(param, {empId: $('.sign').attr('signid')}, function (d) {
            var ownerCompanyId = d.data.ownerCompanyId;
            var subCompanyId = d.data.subCompanyId;
            var roleIds = d.data.roleIds;

            $('.empAccount').val(d.data.empAccount);
            $('.empName').val(d.data.empName);
            $('.phone').val(d.data.phone);
            $('.email').val(d.data.email);


            if (d.data.fileName) {
                uploadArr = [{fileUrl: d.data.qualify, fileName: d.data.fileName}];
                var tr = $(['<tr>',
                    '<td>' + d.data.fileName + '</td>',
                    '<td>已上传</td>', '<td>',
                    '<a class="layui-btn layui-btn-xs layui-btn-danger" onclick="delFile()">删除</a>',
                    '<a target="_blank" href="' + (imgUrl + d.data.qualify) + '" class="layui-btn layui-btn-xs layui-btn-normal picSee">预览</a>',
                    '<a fileUrl="' + d.data.qualify + '" fileName="' + d.data.fileName + '" class="layui-btn layui-btn-xs layui-btn-normal" onclick="downFile(this)">下载</a>',
                    '</td>',
                    '</tr>'].join(''));
                $('#demoList').html(tr);
                var roleStatus = 1;
                $('.picSee').each(function () {
                    if (!/.*?(jpg|gif|png|bmp)/.test($(this).attr('href'))) {
                        $(this).hide();
                    }
                })
            } else {
                $('.layui-upload').hide();
                var roleStatus = 0;
            }

            delFile = function(){
                uploadArr = [];
                $('#demoList').empty()
            }

            downFile = function (self) {
                var form = $("<form>");
                form.attr("style", "display:none");
                form.attr("target", "");
                form.attr("method", "post");
                form.attr("action", imgUrl + 'picture-console/common/file/download');
                form.append('<input type="hidden" name="fileName" value="' + $(self).attr('fileName') + '" />')
                form.append('<input type="hidden" name="fileUrl" value="' + $(self).attr('fileUrl') + '" />')
                form.append('<input type="hidden" name="isOnLine" value="false" />')
                $("body").append(form);
                form.submit();
            };

            //初始化获取业主公司
            param.url = 'systemCenter/companyDrop';
            ajaxJS(param, {}, function (d) {
                var data = d.data;
                $('.owner').empty();
                $('.owner').append('<option value="">请选择</option>');
                for (var i = 0; i < data.length; i++) {
                    $('.owner').append('<option value="' + data[i].id + '">' + data[i].companyName + '</option>')
                }
                if (sessionStorage.getItem('roleType') == '1') {
                    $('.owner').attr('disabled', true)
                }
                $('.owner').val(ownerCompanyId);
                form.render();
            });

            //初始化获取乙方公司
            getPartyB(ownerCompanyId, subCompanyId);

            //通过业主公司获取乙方公司
            form.on('select(owner)', function (data) {
                var d = data.value;

                getPartyB(d);

                if (d == '') {
                    getRole(1)
                } else {
                    getRole(2)
                }
            });


            //通过乙方公司获取角色
            form.on('select(partyB)', function (data) {
                var d = data.value;

                if (d == '') {
                    getRole(2)
                } else {
                    getRole(3)
                }
            });


            if (ownerCompanyId && subCompanyId) {
                getRole(3, roleIds, roleStatus)
            } else if (ownerCompanyId && !subCompanyId) {
                getRole(2, roleIds, roleStatus)
            } else {
                getRole(1, roleIds, roleStatus)
            }

            form.on('select(role)', function (data) {
                var d = data.value;

                if (d == 0) {
                    $('.layui-upload').show()
                } else {
                    $('.layui-upload').hide();
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
                if (uploadArr[0] && roleStatus == 1) {
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
                    subCompanyId: field.partyB,
                    empId: $('.sign').attr('signid')
                };

                param.url = 'systemCenter/updateEmp';
                ajaxJS(param, data, function (d) {
                    top.layer.msg(d.desc);
                    top.layer.close(index);
                    layer.closeAll("iframe");
                    //刷新父页面
                    $(".layui-tab-item.layui-show", parent.document).find("iframe")[0].contentWindow.location.reload();
                })

                return false;
            });
        });


        function getRole(type, roleId, roleStatus) {
            param.url = 'systemCenter/roleDrop';
            ajaxJS(param, {type: type}, function (d) {
                var data = d.data;
                $('.role').empty();
                $('.role').append('<option value="">请选择</option>');
                for (var i = 0; i < data.length; i++) {
                    $('.role').append('<option value="' + data[i].id + ',' + data[i].roleStatus + '">' + data[i].roleName + '</option>')
                }
                $('.role').val(roleId + ',' + roleStatus);
                form.render();


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
            });
        }

        function getPartyB(companyId, subCompanyId) {
            //获得乙方公司
            param.url = 'systemCenter/companySubDrop';
            ajaxJS(param, {companyId: companyId}, function (d) {
                var data = d.data;
                $('.partyB').empty();
                $('.partyB').append('<option value="">请选择</option>');
                for (var i = 0; i < data.length; i++) {
                    $('.partyB').append('<option value="' + data[i].id + '">' + data[i].companyName + '</option>')
                }
                $('.partyB').val(subCompanyId);
                form.render();
            });
        }

        var demoListView = $('#demoList'),
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
    }, 500);

});
