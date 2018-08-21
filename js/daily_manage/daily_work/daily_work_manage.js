layui.use(['form', 'layer', 'jquery', 'upload', 'element'], function () {
    var form = layui.form, $ = layui.jquery, upload = layui.upload, element = layui.element,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: 'routineBackend/getDailyWorkForEdit'};


    setTimeout(function () {
        ajaxJS(param, {workId: $('.sign').attr('workId')}, function (d) {
            var dailyTask = d.data.dailyTask;
            var lastDailyTask = d.data.lastDailyTask;
            var lastDailyArr = [];

            sessionStorage.setItem('projectType', d.data.projectType);

            if (sessionStorage.getItem('projectType') == '4') {
                $('.fdShow').append('<e>*</e>')
            }

            $('.safetyUser').val(d.data.safetyUser);
            $('.technician').val(d.data.technician);
            $('.worker').val(d.data.worker);
            $('.cars').val(d.data.cars);
            $('.device').val(d.data.device);
            $('.remark').html(d.data.remark);

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

            $('.realRate').each(function () {
                $(this).blur(function () {
                    if ($(this).val() > 100 || $(this).val() < 0) {
                        $(this).val('');
                    }
                });
            });

            //缺陷等级
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

            $('.lastTaskBox .task-list').each(function () {
                if ($(this).attr('delay') == '1') {
                    $(this).find('select,input,textarea').attr('disabled', true)
                    $(this).find('.uploadFile,.delFile').remove();
                }
            });


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

            $('.delFile').each(function () {
                var self = this;
                $(this).click(function () {
                    $(self).parent().siblings('.nameList').html('');
                    $(self).parent().siblings('.uploadTd ').find('.uploadFile').attr('uploadjson', '');
                })
            })
        });

        param.url = 'centerBackend/getWeather';
        ajaxJS(param, {cityName: sessionStorage.getItem('cityName')}, function (d) {
            var data = d.data;
            $('.weather span').html(data.type + data.wendu + '摄氏度 ' + data.fengxiang + data.fengli)
        })
    }, 500);


    $('.keep').click(function () {
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        if (!/^[1-9]*[1-9][0-9]*$/.test($('.cars').val()) && $('.cars').val() != '') {
            layer.msg('车辆:请输入正整数');
            return
        }
        if (!/^[1-9]*[1-9][0-9]*$/.test($('.device').val()) && $('.device').val() != '') {
            layer.msg('设备:请输入正整数');
            return
        }
        if (!/^[1-9]*[1-9][0-9]*$/.test($('.safetyUser').val()) && $('.safetyUser').val() != '') {
            layer.msg('安全员:请输入正整数');
            return
        }
        if (!/^[1-9]*[1-9][0-9]*$/.test($('.technician').val()) && $('.technician').val() != '') {
            layer.msg('技术员:请输入正整数');
            return
        }
        if (!/^[1-9]*[1-9][0-9]*$/.test($('.worker').val()) && $('.worker').val() != '') {
            layer.msg('施工人员:请输入正整数');
            return
        }
        var data = {
            workId: $('.sign').attr('workid'),
            safetyUser: $('.safetyUser').val(),
            technician: $('.technician').val(),
            worker: $('.worker').val(),
            cars: $('.cars').val(),
            device: $('.device').val(),
            weather: $('.weather span').text(),
            remark: $('.remark').val(),
            dailyTask: '',
            lastDailyTask: ''
        };

        var lastTasksArr = [];
        for (var i = 0; i < $('.lastTaskBox .task-list').length; i++) {
            if ($('.lastTaskBox .task-list').eq(i).attr('delay') == '1') {
                continue;
            }
            var taskList = $('.lastTaskBox .task-list').eq(i);
            var task = {};
            task.taskId = taskList.attr('taskId');
            task.measure = taskList.find('.measure').val();
            task.realRate = taskList.find('.realRate').val();

            var fileTr = taskList.find('.fileList tbody tr');
            var taskFiles = [];
            for (var j = 0; j < fileTr.length; j++) {
                var taskFilesOne = {};
                taskFilesOne.dataTypeId = fileTr.eq(j).find('.dataTypeId').attr('dataTypeId');
                if (fileTr.eq(j).find('.uploadFile').attr('uploadjson')) {
                    var uploadFile = fileTr.eq(j).find('.uploadFile').attr('uploadjson');
                } else {
                    var uploadFile = '[]'
                }
                taskFilesOne.dataUrls = JSON.parse(uploadFile);
                taskFiles.push(taskFilesOne);
            }
            task.taskFiles = taskFiles;
            lastTasksArr.push(task)
        }

        var tasksArr = [];
        for (var i = 0; i < $('.taskBox .task-list').length; i++) {
            var taskList = $('.taskBox .task-list').eq(i);
            var task = {};
            task.taskId = taskList.attr('taskId');
            task.approveRemark = taskList.find('.step').val();
            task.realRate = taskList.find('.realRate').val();

            var fileTr = taskList.find('.fileList tbody tr');
            var taskFiles = [];
            for (var j = 0; j < fileTr.length; j++) {
                var taskFilesOne = {};
                taskFilesOne.dataTypeId = fileTr.eq(j).find('.dataTypeId').attr('dataTypeId');
                if (fileTr.eq(j).find('.uploadFile').attr('uploadjson')) {
                    var uploadFile = fileTr.eq(j).find('.uploadFile').attr('uploadjson');
                } else {
                    var uploadFile = '[]'
                }
                taskFilesOne.dataUrls = JSON.parse(uploadFile);
                taskFiles.push(taskFilesOne);
            }
            task.list = taskFiles;
            tasksArr.push(task)
        }


        data.lastDailyTask = JSON.stringify(lastTasksArr);
        data.dailyTask = JSON.stringify(tasksArr);

        param.url = 'routineBackend/saveDailyWork';
        ajaxJS(param, data, function (d) {
            layer.msg(d.desc)
            top.layer.close(index);
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        })
    });

    $('.put').click(function () {
        if (sessionStorage.getItem('projectType') == '4') {
            if ($('.cars').val() == '') {
                layer.msg('请输入车辆数量');
                return
            }
            if ($('.device').val() == '') {
                layer.msg('请输入设备数量');
                return
            }
            if (!/^[1-9]*[1-9][0-9]*$/.test($('.cars').val())) {
                layer.msg('车辆:请输入正整数');
                return
            }
            if (!/^[1-9]*[1-9][0-9]*$/.test($('.device').val())) {
                layer.msg('设备:请输入正整数');
                return
            }
        } else {
            if (!/^[1-9]*[1-9][0-9]*$/.test($('.cars').val()) && $('.cars').val() != '') {
                layer.msg('车辆:请输入正整数');
                return
            }
            if (!/^[1-9]*[1-9][0-9]*$/.test($('.device').val()) && $('.device').val() != '') {
                layer.msg('设备:请输入正整数');
                return
            }
        }
        if ($('.safetyUser').val() == '') {
            layer.msg('请输入安全员数量')
            return
        }
        if ($('.technician').val() == '') {
            layer.msg('请输入技术员数量')
            return
        }
        if ($('.worker').val() == '') {
            layer.msg('请输入施工人员数量')
            return
        }
        if (!/^[1-9]*[1-9][0-9]*$/.test($('.safetyUser').val())) {
            layer.msg('安全员:请输入正整数');
            return
        }
        if (!/^[1-9]*[1-9][0-9]*$/.test($('.technician').val())) {
            layer.msg('技术员:请输入正整数');
            return
        }
        if (!/^[1-9]*[1-9][0-9]*$/.test($('.worker').val())) {
            layer.msg('施工人员:请输入正整数');
            return
        }
        for (var i = 0; i < $('.lastTaskBox .realRate').length; i++) {
            if ($('.lastTaskBox .realRate').eq(i).val() == '') {
                layer.msg('请输入实际完成进度');
                return
            }
        }
        for (var j = 0; j < $('.taskBox .realRate').length; j++) {
            if ($('.taskBox .realRate').eq(j).val() == '') {
                layer.msg('请输入实际完成进度');
                return
            }
        }
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            workId: $('.sign').attr('workid'),
            safetyUser: $('.safetyUser').val(),
            technician: $('.technician').val(),
            worker: $('.worker').val(),
            cars: $('.cars').val(),
            device: $('.device').val(),
            weather: $('.weather span').text(),
            remark: $('.remark').val(),
            dailyTask: '',
            lastDailyTask: ''
        };

        var lastTasksArr = [];
        for (var i = 0; i < $('.lastTaskBox .task-list').length; i++) {
            if ($('.lastTaskBox .task-list').eq(i).attr('delay') == '1') {
                continue;
            }
            var taskList = $('.lastTaskBox .task-list').eq(i);
            var task = {};
            task.taskId = taskList.attr('taskId');
            task.measure = taskList.find('.measure').val();
            task.realRate = taskList.find('.realRate').val();

            var fileTr = taskList.find('.fileList tbody tr');
            var taskFiles = [];
            for (var j = 0; j < fileTr.length; j++) {
                var taskFilesOne = {};
                taskFilesOne.dataTypeId = fileTr.eq(j).find('.dataTypeId').attr('dataTypeId');
                if (fileTr.eq(j).find('.uploadFile').attr('uploadjson')) {
                    var uploadFile = fileTr.eq(j).find('.uploadFile').attr('uploadjson');
                } else {
                    var uploadFile = '[]'
                }
                taskFilesOne.dataUrls = JSON.parse(uploadFile);
                taskFiles.push(taskFilesOne);
            }
            task.taskFiles = taskFiles;
            lastTasksArr.push(task)
        }

        var tasksArr = [];
        for (var i = 0; i < $('.taskBox .task-list').length; i++) {
            var taskList = $('.taskBox .task-list').eq(i);
            var task = {};
            task.taskId = taskList.attr('taskId');
            task.realRate = taskList.find('.realRate').val();

            var fileTr = taskList.find('.fileList tbody tr');
            var taskFiles = [];
            for (var j = 0; j < fileTr.length; j++) {
                var taskFilesOne = {};
                taskFilesOne.dataTypeId = fileTr.eq(j).find('.dataTypeId').attr('dataTypeId');
                if (fileTr.eq(j).find('.uploadFile').attr('uploadjson')) {
                    var uploadFile = fileTr.eq(j).find('.uploadFile').attr('uploadjson');
                } else {
                    var uploadFile = '[]'
                }
                taskFilesOne.dataUrls = JSON.parse(uploadFile);
                taskFiles.push(taskFilesOne);
            }
            task.list = taskFiles;
            tasksArr.push(task)
        }


        data.lastDailyTask = JSON.stringify(lastTasksArr);
        data.dailyTask = JSON.stringify(tasksArr);

        param.url = 'routineBackend/submitDailyWork';
        ajaxJS(param, data, function (d) {
            layer.msg(d.desc);
            top.layer.close(index);
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

    function insertLastTask(lastDailyArr) {
        for (var i = 0; i < lastDailyArr.length; i++) {

            var taskStr = '<div class="task-list" delay="' + lastDailyArr[i].delay + '" taskId="' + lastDailyArr[i].taskId + '">' +
                '          <div class="task-title" onclick="slide(this)">' +
                '          <p class="layui-icon">&#xe602;</p>' +
                '          <p class="name">历史遗留任务————<span>（' + lastDailyArr[i].taskName + '）</span></p>' +
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
                '             <span class="factFinish"><input type="number" class="realRate" value="' + lastDailyArr[i].realRate + '"></span>' +
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
                '             <div class="item-col">' +
                '             <span>缺陷等级:</span>' +
                '             <span class="bug">' +
                '             <select disabled class="dangerLevel" danger="' + lastDailyArr[i].dangerLevelDefault + '">' +
                '              <option value="0">关闭</option>' +
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
                '             <div class="layui-form-item" style="margin-top: 20px">' +
                '             <label class="layui-form-label">审批意见</label>' +
                '             <div class="layui-input-block">' +
                '             <textarea disabled class="layui-textarea step">' + lastDailyArr[i].approveRemark + '</textarea>' +
                '             </div>' +
                '             </div>' +
                '             <div class="layui-form-item">' +
                '             <label class="layui-form-label">整改措施</label>' +
                '             <div class="layui-input-block">' +
                '             <textarea placeholder="请输入内容" class="layui-textarea measure">' + lastDailyArr[i].measure + '</textarea>' +
                '             </div>' +
                '          </div>' +
                '          </div>';
            $('.lastTaskBox').append(taskStr);

            var taskFiles = lastDailyArr[i].taskFiles;
            for (var k = 0; k < taskFiles.length; k++) {
                var fileStr = '<tr>' +
                    '           <td class="dataTypeId" dataTypeId="' + taskFiles[k].dataTypeId + '">' + (k + 1) + '</td>' +
                    '           <td>' + taskFiles[k].dataTypeName + '</td>' +
                    '           <td class="nameList"></td>' +
                    '           <td class="uploadTd"><button class="uploadFile layui-btn layui-btn-normal layui-btn-sm">上传</button></td>' +
                    '           <td><button class="delFile layui-btn layui-btn-danger layui-btn-sm">删除</button></td>' +
                    '           </tr>';
                $('.taskBox .task-list').eq(i).find('tbody').append(fileStr);

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
                '           <div class="item">' +
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
                '             <span class="factFinish"><input type="number" class="realRate" value="' + dailyArr[i].realRate + '"></span>' +
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
                '             <div class="item-col">' +
                '             <span>缺陷等级:</span>' +
                '             <span class="bug">' +
                '             <select disabled class="dangerLevel" danger="' + dailyArr[i].dangerLevelDefault + '">' +
                '              <option value="0">关闭</option>' +
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
                '             </div>' +
                '          </div>' +
                '          </div>';
            $('.taskBox').append(taskStr);

            var taskFiles = dailyArr[i].taskFiles;
            for (var k = 0; k < taskFiles.length; k++) {
                var fileStr = '<tr>' +
                    '           <td class="dataTypeId" dataTypeId="' + taskFiles[k].dataTypeId + '">' + (k + 1) + '</td>' +
                    '           <td>' + taskFiles[k].dataTypeName + '</td>' +
                    '           <td class="nameList"></td>' +
                    '           <td class="uploadTd"><button class="uploadFile layui-btn layui-btn-normal layui-btn-sm">上传</button></td>' +
                    '           <td><button class="delFile layui-btn layui-btn-danger layui-btn-sm">删除</button></td>' +
                    '           </tr>';
                $('.taskBox .task-list').eq(i).find('tbody').append(fileStr);

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
});

