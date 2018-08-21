layui.use(['form', 'layer', "jquery", "upload"], function () {
    var form = layui.form, $ = layui.jquery, upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: 'projectBackend/getApproveProject'};

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
            $('.remark').val(sproject.visionRemark);

            for (var i = 0; i < visionFileIds.length; i++) {
                var str = '<tr>' +
                    '<td class="fileName">' + visionFileIds[i].fileName + '</td>' +
                    '<td><a fileUrl="' + visionFileIds[i].fileUrl + '" fileName="' + visionFileIds[i].fileName + '" class="layui-btn upload">下载</a>';
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

                    var subItem = '<div class="item-list" modifyStatus="' + subTaskList[j].modifyStatus + '" taskId="' + subTaskList[j].taskId + '">' +
                        '          <div class="body win5 num">' + subTaskList[j].serialNo + '</div>' +
                        '          <div class="body win7 name" title="' + subTaskList[j].taskName + '">' + subTaskList[j].taskName + '</div>' +
                        '          <div class="body win7">' + subTaskList[j].handType + '' +
                        '          </div>' +
                        '          <div class="body win8">' + subTaskList[j].processLevel + '' +
                        '          </div>' +
                        '          <div class="body win8">' + subTaskList[j].nodeLevel + '' +
                        '          </div>' +
                        '          <div class="body win7">' +
                        '          <select disabled class="defect" danger="' + subTaskList[j].dangerLevel + '">' +
                        '          </select>' +
                        '          </div>' +
                        '          <div class="body win10 time">' + subTaskList[j].startDate + '</div>' +
                        '          <div class="body win10 time">' + subTaskList[j].endDate + '</div>' +
                        '          <div class="body win10">' + subTaskList[j].controlProp + '' +
                        '          </div>' +
                        '          <div class="body win7 lender" title="' + subTaskList[j].leaderName + '" lender="' + subTaskList[j].leader + '">' + subTaskList[j].leaderName + '</div>' +
                        '          <div class="body win7">' +
                        '          <select disabled onchange="choosePass()" class="ispass">' +
                        '          <option value="1" ' + (subTaskList[j].approveStatus == "1" ? "selected" : "") + '>通过</option>' +
                        '          <option value="0" ' + (subTaskList[j].approveStatus == "0" ? "selected" : "") + '>拒绝</option>' +
                        '          </select></div>' +
                        '          <div class="body win10" title="' + subTaskList[j].approveRemark + '">' + subTaskList[j].approveRemark + '' +
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


            $('.upload').each(function () {
                $(this).click(function(){
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
            projectStatus: '7',
            reviewRemark: $('.reviewRemark').val()

        };
        param.url = 'projectBackend/reviewProject';
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
        var data = {
            projectId: $('.sign').attr('signid'),
            projectStatus: '6',
            reviewRemark: $('.reviewRemark').val()
        };
        param.url = 'projectBackend/reviewProject';
        ajaxJS(param, data, function (d) {
            layer.msg(d.desc);
            top.layer.close(index);
            layer.closeAll("iframe");
            parent.location.reload();
        })
    });

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


