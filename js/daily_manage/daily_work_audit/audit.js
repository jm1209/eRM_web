layui.use(['form', 'layer', 'jquery', 'upload', 'element'], function () {
    var form = layui.form, $ = layui.jquery, upload = layui.upload, element = layui.element,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: 'routineBackend/getDailyWorkApproveForEdit'};

    setTimeout(function () {
        ajaxJS(param, {workId: $('.sign').attr('workId')}, function (d) {
            var dailyTask = d.data.dailyTask;
            var lastDailyTask = d.data.lastDailyTask;
            var visionFileIds = d.data.visionFileIds;
            var lastDailyArr = [];

            $('.weather span').html(d.data.weather);
            $('.remark').html(d.data.remark);


            $('.keep').attr('val', JSON.stringify(d.data.visionFileIds));

            for (var i = 0; i < visionFileIds.length; i++) {
                var str = '<tr>' +
                    '<td class="fileName">' + visionFileIds[i].fileName + '</td>' +
                    '<td>' + visionFileIds[i].fileSize + '</td>' +
                    '<td>已上传</td>' +
                    '<td><button fileName="' + visionFileIds[i].fileName + '" fileUrl="' + visionFileIds[i].fileUrl + '" class="layui-btn layui-btn-normal layui-btn-sm" onclick="bigDown(this)">下载</button>';
                $('#demoList').append(str);
            }

            $('.safetyUser').val(d.data.safetyUser);
            $('.technician').val(d.data.technician);
            $('.worker').val(d.data.worker);
            $('.cars').val(d.data.cars);
            $('.device').val(d.data.device);
            $('.visionReamrk').val(d.data.visionRemark);

            if (lastDailyTask) {
                for (var i = 0; i < lastDailyTask.length; i++) {
                    var subTasks = lastDailyTask[i].subTasks;
                    for (var j = 0; j < subTasks.length; j++) {
                        lastDailyArr.push(subTasks[j])
                    }
                }
            }
            insertLastTask(lastDailyArr);

            var dailyArr = [];
            if (dailyArr) {
                for (var i = 0; i < dailyTask.length; i++) {
                    var subTask = dailyTask[i].subTasks;
                    for (var j = 0; j < subTask.length; j++) {
                        dailyArr.push(subTask[j])
                    }
                }
            }
            insertTask(dailyArr);


            $('.uploadFile').each(function () {
                var self = this;
                $(this).click(function () {
                    var index = layer.open({
                        title: '上传文件',
                        type: 2,
                        area: ["750px", "550px"],
                        content: "html/daily_manage/daily_work/upload.html",
                        resize: false,
                        btn: ['确定'],
                        yes: function (index, layero) {
                            var body = layer.getChildFrame('body', index);
                            $(self).attr('uploadJson', body.find('#uploadJson').val());
                            var uploadFile = JSON.parse(body.find('#uploadJson').val());
                            var fileName = [];
                            for (var i = 0; i < uploadFile.length; i++) {
                                fileName.push(uploadFile[i].fileName + '<br/>')
                            }
                            $(self).parent().siblings('.nameList').html(fileName.join(''));
                            layer.close(index);
                        }
                    })
                });
            })

            param.url = 'systemCenter/getDefectDrop';
            ajaxJS(param, {}, function (d) {
                var list = d.data;
                for (var i = 0; i < list.length; i++) {
                    var str = '<option  value="' + list[i].id + '">' + list[i].defName + '</option>';
                    $('.dangerLevel').append(str);
                }

                $('.dangerLevel').each(function () {
                    var danger = $(this).attr('danger');
                    $(this).find('option[value="' + danger + '"]').attr('selected', 'true');
                })
            });

            downFile = function (self) {
                var files = $(self).attr('uploadjson');

                var form = $("<form>");
                form.attr("style", "display:none");
                form.attr("target", "");
                form.attr("method", "post");
                form.attr("action", imgUrl + 'picture-console/common/file/downLoadList');
                form.append("<input type='hidden' name='files' value='" + files + "' />")
                $("body").append(form);
                form.submit();
            };

            bigDown = function (self) {
                var form = $("<form>");
                form.attr("style", "display:none");
                form.attr("target", "");
                form.attr("method", "post");
                form.attr("action", imgUrl + 'picture-console/common/file/download');
                form.append('<input type="hidden" name="fileName" value="' + $(self).attr('fileName') + '" />');
                form.append('<input type="hidden" name="fileUrl" value="' + $(self).attr('fileUrl') + '" />');
                form.append('<input type="hidden" name="isOnLine" value="false" />');
                $("body").append(form);
                form.submit();
            }
        });
    }, 500);


    $('.keep').click(function () {
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            workId: $('.sign').attr('workid'),
            visionReamrk: $('.visionReamrk').val(),
            visionFiles: $('.keep').attr('val'),
            dailyTask: '',
            lastDailyTask: ''
        };

        var lastTasksArr = [];
        for (var i = 0; i < $('.lastTaskBox .task-list').length; i++) {
            var taskList = $('.lastTaskBox .task-list').eq(i);
            var task = {};
            task.taskId = taskList.attr('taskId');
            task.approveRemark = taskList.find('.sug').val();
            task.approveStatus = taskList.find('.isPass').val();
            task.dangerLevel = taskList.find('.dangerLevel').val();
            lastTasksArr.push(task)
        }

        var tasksArr = [];
        for (var i = 0; i < $('.taskBox .task-list').length; i++) {
            var taskList = $('.taskBox .task-list').eq(i);
            var task = {};
            task.taskId = taskList.attr('taskId');
            task.approveRemark = taskList.find('.sug').val();
            task.approveStatus = taskList.find('.isPass').val();
            task.dangerLevel = taskList.find('.dangerLevel').val();
            tasksArr.push(task)
        }

        data.lastDailyTask = JSON.stringify(lastTasksArr);
        data.dailyTask = JSON.stringify(tasksArr);

        param.url = 'routineBackend/saveApproveDailyWork';
        ajaxJS(param, data, function (d) {
            top.layer.close(index);
            layer.msg(d.desc)
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        })
    });


    $('.put').click(function () {
        for (var i = 0; i < $('.task-list').length; i++) {
            if ($('.task-list').eq(i).find('.isPass').val() == '2' && $('.task-list').eq(i).find('.dangerLevel').val() == '0') {
                layer.msg('任务拒绝时，缺陷等级不能选关闭');
                return;
            } else if ($('.taskBox .task-list').eq(i).find('.isPass').val() == '2' && $('.taskBox .task-list').eq(i).find('.dangerLevel').val() == '0') {
                layer.msg('任务拒绝时，缺陷等级不能选关闭');
                return;
            } else if ($('.task-list').eq(i).find('.isPass').eq(i).val() == '1' && $('.task-list').eq(i).find('.dangerLevel').val() != '0') {
                layer.msg('任务通过时，缺陷等级只能选关闭');
                return;
            } else if ($('.taskBox .task-list').eq(i).find('.isPass').eq(i).val() == '1' && $('.taskBox .task-list').eq(i).find('.dangerLevel').val() != '0') {
                layer.msg('任务通过时，缺陷等级只能选关闭');
                return;
            } else if ($('.task-list').eq(i).find('.isPass').eq(i).val() == '0') {
                layer.msg('有具体任务没有审核,不能提交');
                return;
            } else if ($('.taskBox .task-list').eq(i).find('.isPass').eq(i).val() == '0') {
                layer.msg('有具体任务没有审核,不能提交');
                return;
            }
        }

        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            workId: $('.sign').attr('workid'),
            visionReamrk: $('.visionReamrk').val(),
            visionFiles: $('.keep').attr('val'),
            dailyTask: '',
            lastDailyTask: ''
        };
        var lastTasksArr = [];
        for (var i = 0; i < $('.lastTaskBox .task-list').length; i++) {
            var taskList = $('.lastTaskBox .task-list').eq(i);
            var task = {};
            task.taskId = taskList.attr('taskId');
            task.approveRemark = taskList.find('.sug').val();
            task.approveStatus = taskList.find('.isPass').val();
            task.dangerLevel = taskList.find('.dangerLevel').val();
            lastTasksArr.push(task)
        }

        var tasksArr = [];
        for (var i = 0; i < $('.taskBox .task-list').length; i++) {
            var taskList = $('.taskBox .task-list').eq(i);
            var task = {};
            task.taskId = taskList.attr('taskId');
            task.approveRemark = taskList.find('.sug').val();
            task.approveStatus = taskList.find('.isPass').val();
            task.dangerLevel = taskList.find('.dangerLevel').val();
            tasksArr.push(task)
        }

        data.lastDailyTask = JSON.stringify(lastTasksArr);
        data.dailyTask = JSON.stringify(tasksArr);

         param.url = 'routineBackend/approveDailyWork';
         ajaxJS(param, data, function (d) {
             top.layer.close(index);
             layer.msg(d.desc);
             layer.closeAll("iframe");
             //刷新父页面
             parent.location.reload();

         })
    });


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

    isPass = function (self) {

    }

    function insertLastTask(lastDailyArr) {
        for (var i = 0; i < lastDailyArr.length; i++) {
            var taskStr = '<div class="task-list" taskId="' + lastDailyArr[i].taskId + '">' +
                '          <div class="task-title" onclick="slide(this)">' +
                '          <p class="layui-icon">&#xe602;</p>' +
                '          <p class="name">当天工作任务————<span>（' + lastDailyArr[i].taskName + '）</span></p>' +
                '          </div>' +
                '          <div class="list">' +
                '           <div class="item">' +
                '             <div class="item-row">' +
                '             <div class="item-col">' +
                '             <span>序号:</span>' +
                '             <span class="num">' + lastDailyArr[i].serialNo + '</span>' +
                '             </div>' +
                '             <div class="item-col">' +
                '             <span>任务名称:</span>' +
                '             <span class="taskName">' + lastDailyArr[i].taskName + '</span>' +
                '             </div>' +
                '             <div class="item-col">' +
                '             <span>进度过程等级:</span>' +
                '             <span class="process">' + lastDailyArr[i].processLevel + '</span>' +
                '             </div>' +
                '             </div>' +
                '             <div class="item-row">' +
                '             <div class="item-col">' +
                '             <span>计划开始时间:</span>' +
                '             <span class="planStart">' + lastDailyArr[i].startDate + '</span>' +
                '             </div>' +
                '             <div class="item-col">' +
                '             <span>计划结束时间:</span>' +
                '             <span class="planEnd">' + lastDailyArr[i].endDate + '</span>' +
                '             </div>' +
                '             <div class="item-col">' +
                '             <span>进度节点等级:</span>' +
                '             <span class="node">' + lastDailyArr[i].nodeLevel + '</span>' +
                '             </div>' +
                '             </div>' +
                '             <div class="item-row">' +
                '             <div class="item-col">' +
                '             <span>计划完成进度%:</span>' +
                '             <span class="planFinish">' + lastDailyArr[i].planRate + '</span>' +
                '             </div>' +
                '             <div class="item-col">' +
                '             <span>实际完成进度%:</span>' +
                '             <span class="factFinish">' + lastDailyArr[i].realRate + '</span>' +
                '             </div>' +
                '             <div class="item-col">' +
                '             <span>控制点特征:</span>' +
                '             <span class="feature">' + lastDailyArr[i].controlProp + '</span>' +
                '             </div>' +
                '             </div>' +
                '             <div class="item-row">' +
                '             <div class="item-col">' +
                '             <span>负责人:</span>' +
                '             <span class="leader">' + lastDailyArr[i].leader + '</span>' +
                '             </div>' +
                '             <div class="item-col danger">' +
                '             <span>缺陷等级:</span>' +
                '             <span class="bug">' +
                '             <select class="dangerLevel" danger="' + lastDailyArr[i].dangerLevel + '">' +
                '              <option value="0">关闭</option>' +
                '             </select>' +
                '             </span>' +
                '             </div>' +
                '             <div class="item-col passBox">' +
                '             <span>是否通过: </span>' +
                '             <span class="">' +
                '             <select class="isPass" onchange="isPass(this)">' +
                '             <option value="0" ' + (lastDailyArr[i].approveStatus == "0" ? "selected" : "") + '>待审核</option>' +
                '             <option value="1" ' + (lastDailyArr[i].approveStatus == "1" ? "selected" : "") + '>通过</option>' +
                '             <option value="2" ' + (lastDailyArr[i].approveStatus == "2" ? "selected" : "") + '>拒绝</option>' +
                '             </select>' +
                '             </span>' +
                '             </div>' +
                '             </div>' +
                '             </div>' +
                '             <div class="fileList">' +
                '             <table class="layui-table">' +
                '             <thead>' +
                '             <tr>' +
                '             <td>序号</td>' +
                '             <td>文件类型</td>' +
                '             <td>文件名称</td>' +
                '             <td>上传</td>' +
                '             <td>删除</td>' +
                '             </tr>' +
                '             </thead>' +
                '             <tbody>' +
                '             </tbody>' +
                '             </table>' +
                '             </div>' +
                '             <div class="layui-form-item">' +
                '             <label class="layui-form-label">整改措施</label>' +
                '             <div class="layui-input-block">' +
                '             <textarea disabled class="layui-textarea">' + lastDailyArr[i].measure + '</textarea>' +
                '             </div>' +
                '             </div>' +
                '             <div class="layui-form-item">' +
                '             <label class="layui-form-label">审批意见</label>' +
                '             <div class="layui-input-block">' +
                '             <textarea placeholder="请输入内容" class="layui-textarea sug">' + (lastDailyArr[i].approveRemark || "同意") + '</textarea>' +
                '             </div>' +
                '             </div>' +
                '              </div>' +
                '               </div>';
            $('.lastTaskBox').append(taskStr);

            var taskFiles = lastDailyArr[i].taskFiles;
            for (var k = 0; k < taskFiles.length; k++) {
                var fileStr = '<tr>' +
                    '           <td class="dataTypeId" dataTypeId="' + taskFiles[k].dataTypeId + '">' + (k + 1) + '</td>' +
                    '           <td>' + taskFiles[k].dataTypeName + '</td>' +
                    '           <td class="nameList"></td>' +
                    '           <td><button class="bigDown layui-btn layui-btn-normal layui-btn-sm">下载</button></td>' +
                    '           <td><button class="delFile"></button></td>' +
                    '           </tr>';
                $('.taskBox .task-list').eq(i).find('tbody').append(fileStr)

                var urlNameArr = [];
                var dataUrls = taskFiles[k].dataUrls;
                for (var a = 0; a < dataUrls.length; a++) {
                    urlNameArr.push(dataUrls[a].fileName + '<br/>');
                }
                var urlStr = '<span>' + urlNameArr.join("") + '</span>';
                $('.taskBox .task-list').eq(i).find('.fileList tbody').find('tr').eq(k).find('.nameList').html(urlStr);
                $('.taskBox .task-list').eq(i).find('.fileList tbody').find('tr').eq(k).find('.uploadFile').attr('uploadjson', JSON.stringify(taskFiles[k].dataUrls || '[]'));
            }
        }
    }

    function insertTask(dailyArr) {
        for (var i = 0; i < dailyArr.length; i++) {
            var taskStr = '<div class="task-list" taskId="' + dailyArr[i].taskId + '">' +
                '          <div class="task-title" onclick="slide(this)">' +
                '          <p class="layui-icon">&#xe602;</p>' +
                '          <p class="name">当天工作任务————<span>（' + dailyArr[i].taskName + '）</span></p>' +
                '          </div>' +
                '          <div class="list">' +
                '<div class="item">' +
                '             <div class="item-row">' +
                '             <div class="item-col">' +
                '             <span>序号:</span>' +
                '             <span class="num">' + dailyArr[i].serialNo + '</span>' +
                '             </div>' +
                '             <div class="item-col">' +
                '             <span>任务名称:</span>' +
                '             <span class="taskName">' + dailyArr[i].taskName + '</span>' +
                '             </div>' +
                '             <div class="item-col">' +
                '             <span>进度过程等级:</span>' +
                '             <span class="process">' + dailyArr[i].processLevel + '</span>' +
                '             </div>' +
                '             </div>' +
                '             <div class="item-row">' +
                '             <div class="item-col">' +
                '             <span>计划开始时间:</span>' +
                '             <span class="planStart">' + dailyArr[i].startDate + '</span>' +
                '             </div>' +
                '             <div class="item-col">' +
                '             <span>计划结束时间:</span>' +
                '             <span class="planEnd">' + dailyArr[i].endDate + '</span>' +
                '             </div>' +
                '             <div class="item-col">' +
                '             <span>进度节点等级:</span>' +
                '             <span class="node">' + dailyArr[i].nodeLevel + '</span>' +
                '             </div>' +
                '             </div>' +
                '             <div class="item-row">' +
                '             <div class="item-col">' +
                '             <span>计划完成进度%:</span>' +
                '             <span class="planFinish">' + dailyArr[i].planRate + '</span>' +
                '             </div>' +
                '             <div class="item-col">' +
                '             <span>实际完成进度%:</span>' +
                '             <span class="factFinish">' + dailyArr[i].realRate + '</span>' +
                '             </div>' +
                '             <div class="item-col">' +
                '             <span>控制点特征:</span>' +
                '             <span class="feature">' + dailyArr[i].controlProp + '</span>' +
                '             </div>' +
                '             </div>' +
                '             <div class="item-row">' +
                '             <div class="item-col">' +
                '             <span>负责人:</span>' +
                '             <span class="leader">' + dailyArr[i].leader + '</span>' +
                '             </div>' +
                '             <div class="item-col danger">' +
                '             <span>缺陷等级:</span>' +
                '             <span class="bug">' +
                '             <select class="dangerLevel" danger="' + dailyArr[i].dangerLevel + '">' +
                '              <option value="0">关闭</option>' +
                '             </select>' +
                '             </select>' +
                '             </span>' +
                '             </div>' +
                '             <div class="item-col passBox">' +
                '             <span>是否通过: </span>' +
                '             <span class="">' +
                '             <select class="isPass" onchange="isPass(this)">' +
                '             <option value="0" ' + (dailyArr[i].approveStatus == "0" ? "selected" : "") + '>待审核</option>' +
                '             <option value="1" ' + (dailyArr[i].approveStatus == "1" ? "selected" : "") + '>通过</option>' +
                '             <option value="2" ' + (dailyArr[i].approveStatus == "2" ? "selected" : "") + '>拒绝</option>' +
                '             </select>' +
                '             </span>' +
                '             </div>' +
                '             </div>' +
                '             </div>' +
                '             <div class="fileList">' +
                '             <table class="layui-table">' +
                '             <thead>' +
                '             <tr>' +
                '             <td>序号</td>' +
                '             <td>文件类型</td>' +
                '             <td>文件名称</td>' +
                '             <td>上传</td>' +
                '             <td>删除</td>' +
                '             </tr>' +
                '             </thead>' +
                '             <tbody>' +
                '             </tbody>' +
                '             </table>' +
                '             </div>' +
                '             <div class="layui-form-item">' +
                '             <label class="layui-form-label">审批意见</label>' +
                '             <div class="layui-input-block">' +
                '             <textarea class="layui-textarea sug">' + (dailyArr[i].approveRemark || "同意") + '</textarea>' +
                '             </div>' +
                '             </div>' +
                '              </div>' +
                '               </div>';
            $('.taskBox').append(taskStr);

            var taskFiles = dailyArr[i].taskFiles;
            for (var k = 0; k < taskFiles.length; k++) {
                var fileStr = '<tr>' +
                    '           <td class="dataTypeId" dataTypeId="' + taskFiles[k].dataTypeId + '">' + (k + 1) + '</td>' +
                    '           <td>' + taskFiles[k].dataTypeName + '</td>' +
                    '           <td class="nameList"></td>' +
                    '           <td><button class="downFile layui-btn layui-btn-normal layui-btn-sm" onclick="downFile(this)">下载</button></td>' +
                    '           <td><button class="delFile"></button></td>' +
                    '           </tr>';
                $('.taskBox .task-list').eq(i).find('tbody').append(fileStr)

                var urlNameArr = [];
                var dataUrls = taskFiles[k].dataUrls;
                for (var a = 0; a < dataUrls.length; a++) {
                    urlNameArr.push(dataUrls[a].fileName + '<br/>');
                }
                var urlStr = '<span>' + urlNameArr.join("") + '</span>';
                $('.taskBox .task-list').eq(i).find('.fileList tbody').find('tr').eq(k).find('.nameList').html(urlStr);
                $('.taskBox .task-list').eq(i).find('.fileList tbody').find('tr').eq(k).find('.downFile').attr('uploadjson', JSON.stringify(taskFiles[k].dataUrls || '[]'));
            }
        }
    }


    var uploadArr = [];
    var demoListView = $('#demoList'),
        uploadListIns = upload.render({
            elem: '#testList',
            url: sessionStorage.getItem("imgUrl") + 'picture-console/common/file/upload',
            accept: 'file',
            multiple: true,
            choose: function (obj) {
                var files = this.files = obj.pushFile();
                //读取本地文件
                obj.preview(function (index, file, result) {
                    var tr = $(['<tr id="upload-' + index + '">'
                        , '<td>' + file.name + '</td>'
                        , '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>'
                        , '<td>等待上传</td>'
                        , '<td>'
                        , '<button class="layui-btn layui-btn-mini demo-reload layui-hide">重传</button>'
                        , '<button class="layui-btn layui-btn-mini layui-btn-danger demo-delete">删除</button>'
                        , '</td>'
                        , '</tr>'].join(''));

                    //单个重传
                    tr.find('.demo-reload').on('click', function () {
                        obj.upload(index, file);
                    });

                    //删除
                    tr.find('.demo-delete').on('click', function () {
                        for (var i = 0; i < uploadArr.length; i++) {
                            if (uploadArr[i].fileName == file.name) {
                                uploadArr.splice(i, 1);
                            }
                        }

                        delete files[index]; //删除对应的文件
                        tr.remove();
                        uploadListIns.config.elem.next()[0].value = '';
                    });

                    demoListView.append(tr);
                });
            },
            done: function (res, index, upload) {
                if (res.code == '200') { //上传成功
                    uploadArr.push(res.data[0])
                    $('.keep').attr('val', JSON.stringify(uploadArr));
                    var tr = demoListView.find('tr#upload-' + index)
                        , tds = tr.children();
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
});

