layui.use(['form', 'layer', "jquery", "upload"], function () {
    var form = layui.form, $ = layui.jquery, upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: 'projectBackend/getApproveProject'};

    var taskList, visionFileIds = [];
    setTimeout(function () {
        ajaxJS(param, {projectId: $('.sign').attr('signid')}, function (d) {
            var sproject = d.data.sproject;
            var visionFileIds = d.data.visionFileIds;
            var tasks = d.data.tasks;

            $('.projectNo').val(sproject.projectNo);
            $('.projectName').val(sproject.projectName);
            $('.projectType').val(getProjectType(sproject.projectType));
            $('.capacity').val(sproject.capacity);
            $('.connectGridTime').val(formatDate(sproject.connectGridTime));
            $('.visionRemark').val(sproject.visionRemark);

            var uploadArr = visionFileIds;
            for (var i = 0; i < visionFileIds.length; i++) {
                var str = '<tr>' +
                    '<td class="fileName">' + visionFileIds[i].fileName + '</td>' +
                    '<td>' + visionFileIds[i].fileSize + '</td>' +
                    '<td>已上传</td>' +
                    '<td><button fileName="' + visionFileIds[i].fileName + '" onclick="uploadDel(this)" class="layui-btn layui-btn-mini layui-btn-danger demo-delete">删除</button></td>';
                $('#demoList').append(str);
            }

            var arr1 = [];
            var arr2 = [];
            for (var i = 0; i < tasks.length; i++) {

                if (tasks[i].modifyStatus == '2') {
                    arr1.push(tasks[i]);
                    continue;
                } else {
                    arr2.push(tasks[i]);
                    continue;
                }
            }
            tasks = arr2.concat(arr1);


            for (var i = 0; i < tasks.length; i++) {
                var arr3 = [];
                var arr4 = [];

                var subTaskList = tasks[i].subTaskList;

                for (var j = 0; j < subTaskList.length; j++) {
                    if (subTaskList[j].modifyStatus == '2') {
                        arr3.push(subTaskList[j]);
                        continue;
                    } else {
                        arr4.push(subTaskList[j]);
                        continue;
                    }
                }
                tasks[i].subTaskList = arr4.concat(arr3);
            }

            for (var i = 0; i < tasks.length; i++) {
                var item = '<div class="item"  modifyStatus="' + tasks[i].modifyStatus + '">' +
                    '       <div class="item-title" onclick="slide(this)" taskMainId="' + tasks[i].taskMainId + '">' +
                    '       <i class="layui-icon">&#xe602;</i>' +
                    '       <div class="num">' + tasks[i].serialNo + '</div>' +
                    '       <div class="name">' + tasks[i].taskName + '</div>' +
                    '       </div>' +
                    '       <div class="list">' +
                    '       </div></div>';
                $('.container').append(item);
                var subTaskList = tasks[i].subTaskList;
                for (var j = 0; j < subTaskList.length; j++) {
                    if (subTaskList[j].approveStatus == '0') {
                        var dangerLevel = '待审核';
                    } else if (subTaskList[j].approveStatus == '1') {
                        var dangerLevel = '通过';
                    } else {
                        var dangerLevel = '拒绝';
                    }
                    var remenArr = [];
                    if (subTaskList.repuirementList) {
                        for (var k = 0; k < subTaskList.repuirementList.length; k++) {
                            remenArr.push(subTaskList.repuirementList[k].dataTypeName)
                        }
                    }

                    var subItem = '<div class="item-list" fileRequire="' + subTaskList[j].fileRequire + '" modifyStatus="' + subTaskList[j].modifyStatus + '" taskId="' + subTaskList[j].taskId + '">' +
                        '          <div class="body win5 num">' + subTaskList[j].serialNo + '</div>' +
                        '          <div class="body win7 name" title="' + subTaskList[j].taskName + '">' + subTaskList[j].taskName + '</div>' +
                        '          <div class="body win7">' + subTaskList[j].handType + '' +
                        '          </div>' +
                        '          <div class="body win8">' + subTaskList[j].processLevel + '' +
                        '          </div>' +
                        '          <div class="body win8">' + subTaskList[j].nodeLevel + '' +
                        '          </div>' +
                        '          <div class="body win7">' +
                        '          <select class="defect" danger="' + subTaskList[j].dangerLevel + '">' +
                        '          </select>' +
                        '          </div>' +
                        '          <div class="body win10 time">' + subTaskList[j].startDate + '</div>' +
                        '          <div class="body win10 time">' + subTaskList[j].endDate + '</div>' +
                        '          <div class="body win10">' + subTaskList[j].controlProp + '' +
                        '          </div>' +
                        '          <div class="body win7 lender" title="' + subTaskList[j].leaderName + '" lender="' + subTaskList[j].leader + '">' + subTaskList[j].leaderName + '</div>' +
                        '          <div class="body win7">' +
                        '          <select onchange="choosePass()" class="ispass">' +
                        '          <option value="1" ' + (subTaskList[j].approveStatus == "1" ? "selected" : "") + '>通过</option>' +
                        '          <option value="0" ' + (subTaskList[j].approveStatus == "0" ? "selected" : "") + '>拒绝</option>' +
                        '          </select></div>' +
                        '          <div class="body win10" title="' + subTaskList[j].approveRemark + '">' +
                        '           <input type="text" class="approveRemark" value="' + subTaskList[j].approveRemark + '">' +
                        '          </div>' +
                        '          </div>';
                    $('.list').eq(i).append(subItem);
                }
            }

            for (var i = 0; i < $('.ispass').length; i++) {
                if ($('.ispass').eq(i).val() == '0') {
                    $('.pass').hide();
                    break;
                }
            }
            param.url = 'systemCenter/getDefectDrop';
            ajaxJS(param, {}, function (d) {
                var list = d.data;
                for (var i = 0; i < list.length; i++) {
                    var str = '<option  value="' + list[i].id + '">' + list[i].defName + '</option>';
                    $('.defect').append(str);
                }

                $('.defect').each(function () {
                    var danger = $(this).attr('danger');
                    $(this).find('option[value="' + danger + '"]').attr('selected', 'true');
                })
            });

            $('.item').each(function () {
                if ($(this).attr('modifyStatus') == '2') {
                    $(this).removeClass('idDel').addClass('deleted');
                    $(this).find('input,select').attr('disabled', 'true');
                    $(this).find('.btn').hide();
                    $(this).find('.num').html('已删除');
                }
            });

            $('.item-list').each(function () {
                if ($(this).attr('modifyStatus') == '2') {
                    $(this).removeClass('subDel').addClass('subDeleted');
                    $(this).find('input,select').attr('disabled', 'true');
                    $(this).find('.copy,.del').hide();
                    $(this).find('.ispass option[value="1"]').attr('selected', true);
                    $(this).find('.time').html('');
                    $(this).find('.num').html('已删除');

                } else if ($(this).attr('modifyStatus') == '1') {
                    $(this).find('.num').css('color', 'red')
                }
            })


            $('.hisSug').click(function () {
                var index = layer.open({
                    title: '历史意见',
                    type: 2,
                    area: ["750px", "550px"],
                    content: "html/project_setup/project_plan/history_sug.html?projectId=" + $('.sign').attr('signid'),
                    resize: false,
                    btn: '取消',
                    yes: function (index, layero) {
                        var body = layer.getChildFrame('body', index);
                        layer.close(index);
                    }
                })
            });


            choosePass = function () {
                var flag = true;
                for (var i = 0; i < $('.ispass').length; i++) {
                    if ($('.ispass').eq(i).val() == '0') {
                        flag = false;
                        break;
                    } else {
                        flag = true;
                    }
                }
                if (flag) {
                    $('.pass').show();
                } else {
                    $('.pass').hide();
                }
            };

            //多文件列表示例
            var demoListView = $('#demoList'),
                uploadListIns = upload.render({
                    elem: '#testList',
                    url: sessionStorage.getItem("imgUrl") + "picture-console/common/file/upload",
                    accept: 'file',
                    multiple: true,
                    choose: function (obj) {
                        var files = this.files = obj.pushFile();
                        obj.preview(function (index, file, result) {
                            var tr = $(['<tr id="upload-' + index + '">',
                                '<td>' + file.name + '</td>',
                                '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>',
                                '<td>等待上传</td>',
                                '<td>',
                                '<button class="layui-btn layui-btn-mini demo-reload layui-hide">重传</button>',
                                '<button fileName="' + file.name + '" onclick="uploadDel(this)" class="layui-btn layui-btn-mini layui-btn-danger demo-delete">删除</button>' +
                                '</td>',
                                '</tr>'].join(''));

                            //单个重传
                            tr.find('.demo-reload').on('click', function () {
                                obj.upload(index, file);
                            });

                            //删除
                            tr.find('.demo-delete').on('click', function () {
                                delete files[index];
                                tr.remove();
                                uploadListIns.config.elem.next()[0].value = '';
                            });
                            demoListView.append(tr);
                        });
                    },
                    done: function (res, index, upload) {
                        if (res.code == 200) { //上传成功
                            uploadArr.push(res.data[0]);
                            $('#testListAction').attr('upload', JSON.stringify(uploadArr));
                            $('.fileArr').html(JSON.stringify(uploadArr))
                            upload = JSON.stringify(uploadArr);
                            var tr = demoListView.find('tr#upload-' + index), tds = tr.children();
                            tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
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

            uploadDel = function (_this) {

                var fileName = $(_this).attr('filename');
                var num = 0;
                for (var i = 0; i < uploadArr.length; i++) {
                    if (fileName == uploadArr[i].fileName) {
                        num = i;
                        break;
                    }
                }
                var arr1 = uploadArr.slice(0, num);
                var arr2 = uploadArr.slice(num + 1, uploadArr.length);
                uploadArr = arr1.concat(arr2);
            };

            //每个项目的开启和关闭
            slide = function (self) {
                if (!$(self).hasClass('down')) {
                    $(self).siblings('.list').stop().slideDown();
                    $(self).addClass('down');
                    $(self).find('.layui-icon').css('transform', 'rotate(90deg)');
                } else {
                    $(self).siblings('.list').stop().slideUp();
                    $(self).removeClass('down');
                    $(self).find('.layui-icon').css('transform', 'rotate(0deg)');
                }
            };


            //拒绝按钮
            $('.refuse').click(function () {
                var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});

                var data = {
                    projectId: $('.sign').attr('signid'),
                    substatus: '5',
                    visionRemark: $('.visionRemark').val(),
                    visionFileIds: $('#testListAction').attr('upload'),
                    tasks: ''
                };
                var tasksArr = [];
                for (var i = 0; i < $('.item-list').length; i++) {
                    var tasksList = {};
                    tasksList.taskId = $('.item-list').eq(i).attr('taskid');
                    tasksList.approveStatus = $('.item-list').eq(i).find('.ispass').val();
                    tasksList.approveRemark = $('.item-list').eq(i).find('.approveRemark').val();
                    tasksArr.push(tasksList)
                }

                data.tasks = JSON.stringify(tasksArr);
                param.url = 'projectBackend/approveProject';
                ajaxJS(param, data, function (d) {
                    top.layer.close(index);
                    layer.msg(d.desc);
                    layer.closeAll("iframe");
                    parent.location.reload();
                })
            });


            //通过按钮
            $('.pass').click(function () {
                var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
                /*if (uploadArr.length == 0) {
                    layer.close(index);
                    layer.msg('请上传文件');
                    return;
                }*/
                var data = {
                    projectId: $('.sign').attr('signid'),
                    substatus: '4',
                    visionRemark: $('.visionRemark').val(),
                    visionFileIds: JSON.stringify(uploadArr),
                    tasks: ''
                };
                var tasksArr = [];
                for (var i = 0; i < $('.item-list').length; i++) {
                    var tasksList = {};
                    tasksList.taskId = $('.item-list').eq(i).attr('taskid');
                    tasksList.approveStatus = $('.item-list').eq(i).find('.ispass').val();
                    tasksList.approveRemark = $('.item-list').eq(i).find('.approveRemark').val();
                    tasksArr.push(tasksList)
                }

                data.tasks = JSON.stringify(tasksArr);

                param.url = 'projectBackend/approveProject';
                ajaxJS(param, data, function (d) {
                    top.layer.close(index);
                    layer.msg(d.desc);
                    layer.closeAll("iframe");
                    parent.location.reload();
                })
            });

            $(document).scroll(function (e) {
                var scrolltop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if (scrolltop > 200) {
                    $('.fixed').show();
                } else {
                    $('.fixed').hide();
                }
            });
        });
    }, 500);
});

function getProjectType(str) {
    switch (str) {
        case '1':
            return '分布式低压';
        case '2':
            return '分布式高压';
        case '3':
            return '地面集中式';
        case '4':
            return '风电';
    }
}


