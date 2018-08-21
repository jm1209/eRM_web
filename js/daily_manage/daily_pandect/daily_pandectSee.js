layui.use(['form', 'layer', 'jquery', 'upload', 'element'], function () {
    var form = layui.form, $ = layui.jquery, upload = layui.upload, element = layui.element,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: 'routineBackend/dailySummaryDetail'};


    setTimeout(function () {
        ajaxJS(param, {workId: $('.sign').attr('projectid')}, function (d) {
            var dailyTask = d.data;

            $('.safetyUser').val(d.data.safetyUser);
            $('.technician').val(d.data.technician);
            $('.worker').val(d.data.worker);
            $('.cars').val(d.data.cars);
            $('.device').val(d.data.device);

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



        });

        param.url = 'centerBackend/getWeather';
        ajaxJS(param, {cityName: sessionStorage.getItem('cityName')}, function (d) {
            var data = d.data;
            $('.weather span').html(data.type + data.wendu + ' ' + data.fengxiang + data.fengli)
        })
    }, 500);


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
                '             <div class="item-col">' +
                '             <span>缺陷等级:</span>' +
                '             <span class="bug">' +
                '             <select disabled class="dangerLevel" danger="' + dailyArr[i].dangerLevelDefault + '">' +
                '             <option value="0">关闭</option>' +
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
                    '           <td><button class="downFile layui-btn layui-btn-normal layui-btn-sm" onclick="downFile(this)">下载</button></td>' +
                    '           </tr>';
                $('.taskBox .task-list').eq(i).find('tbody').append(fileStr)

                var urlNameArr = [];
                var dataUrls = taskFiles[k].dataUrls;
                for (var a = 0; a < dataUrls.length; a++) {
                    urlNameArr.push(dataUrls[a].fileName+'<br/>');
                }
                var urlStr = '<span>' + urlNameArr.join("") + '</span>';
                $('.taskBox .task-list').eq(i).find('.fileList tbody').find('tr').eq(k).find('.nameList').html(urlStr);
                $('.taskBox .task-list').eq(i).find('.fileList tbody').find('tr').eq(k).find('.downFile').attr('uploadjson', JSON.stringify(taskFiles[k].dataUrls || '[]'));
            }

        }
    }
});

