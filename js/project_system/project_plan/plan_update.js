layui.use(['form', 'layer', "jquery", 'table', 'laydate', "element", "tree"], function () {
    var form = layui.form, $ = layui.jquery, table = layui.table, laydate = layui.laydate, element = layui.element,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: 'projectBackend/getApproveProject'};

    setTimeout(function () {
        ajaxJS(param, {projectId: $('.sign').attr('signid')}, function (d) {
            var sproject = d.data.sproject;
            var tasks = d.data.tasks;

            $('.projectNo').val(sproject.projectNo);
            $('.projectName').val(sproject.projectName);
            $('.projectType').val(getProjectType(sproject.projectType));
            $('.capacity').val(sproject.capacity);
            $('.connectGridTime').val(formatDate(sproject.connectGridTime));

            for (var i = 0; i < tasks.length; i++) {
                var item = '<div class="idDel item" modifyStatus="' + tasks[i].modifyStatus + '">' +
                    '       <div class="item-title" onclick="slide(this)" taskMainId="' + tasks[i].taskMainId + '">' +
                    '       <i class="layui-icon">&#xe602;</i>' +
                    '       <div class="num itemNo">' + tasks[i].serialNo + '</div>' +
                    '       <div class="name"><input class="itemName" type="text" value="' + tasks[i].taskName + '" onclick="javascript: event.stopPropagation();"></div>' +
                    '       <div class="btn">' +
                    '       <a href="javascript:;" class="pCopy" onclick="pCopy(this)">复制</a>' +
                    '       <a href="javascript:;" class="pDel" onclick="pDel(this)">删除</a>' +
                    '       </div>' +
                    '       </div>' +
                    '       <div class="list">' +
                    '       </div></div>';
                $('.container').append(item);
                var subTaskList = tasks[i].subTaskList;
                for (var j = 0; j < subTaskList.length; j++) {
                    if (subTaskList[j].startDate && subTaskList[j].endDate) {
                        var planTime = subTaskList[j].startDate + ' - ' + subTaskList[j].endDate;
                    } else {
                        var planTime = ''
                    }
                    var subItem = '<div class="item-list subDel" approveStatus="' + subTaskList[j].approveStatus + '" modifyStatus="' + subTaskList[j].modifyStatus + '" taskId="' + subTaskList[j].taskId + '" leader="' + subTaskList[j].leader + '">' +
                        '          <div class="body win5 num">' + subTaskList[j].serialNo + '</div>' +
                        '          <div class="body win7 name"><input class="taskName" type="text" value="' + subTaskList[j].taskName + '"></div>' +
                        '          <div class="body win7">' +
                        '          <select class="fill">' +
                        '          <option value="">请选择</option>' +
                        '          <option value="节点交付" ' + (subTaskList[j].handType == "节点交付" ? "selected" : "") + '>节点交付</option>' +
                        '          <option value="累计交付" ' + (subTaskList[j].handType == "累计交付" ? "selected" : "") + '>累计交付</option>' +
                        '          </select>' +
                        '          </div>' +
                        '          <div class="body win8">' +
                        '          <select class="process">' +
                        '          <option value="">请选择</option>' +
                        '          <option value="1" ' + (subTaskList[j].processLevel == "1" ? "selected" : "") + '>1</option>' +
                        '          <option value="2" ' + (subTaskList[j].processLevel == "2" ? "selected" : "") + '>2</option>' +
                        '          </select>' +
                        '          </div>' +
                        '          <div class="body win8">' +
                        '          <select class="node">' +
                        '          <option value="">请选择</option>' +
                        '          <option value="1" ' + (subTaskList[j].nodeLevel == "1" ? "selected" : "") + '>1</option>' +
                        '          <option value="2" ' + (subTaskList[j].nodeLevel == "2" ? "selected" : "") + '>2</option>' +
                        '          </select>' +
                        '          </div>' +
                        '          <div class="body win7">' +
                        '          <select class="defect" danger="' + subTaskList[j].dangerLevel + '">' +
                        '          </select>' +
                        '          </div>' +
                        '          <div class="body win10">' +
                        '          <input type="text" class="planStart chooseTime" onclick="planTime(this)" value="' + (subTaskList[j].startDate != "0002-11-30" ? subTaskList[j].startDate : "") + '">' +
                        '          </div>' +
                        '          <div class="body win10">' +
                        '          <input type="text" class="planEnd chooseTime" onclick="planTime(this)" value="' + (subTaskList[j].startDate != "0002-11-30" ? subTaskList[j].endDate : "") + '">' +
                        '          </div>' +
                        '          <div class="body win10">' +
                        '          <select class="feature">' +
                        '          <option value="">请选择</option>' +
                        '          <option value="前置" ' + (subTaskList[j].controlProp == "前置" ? "selected" : "") + '>前置</option>' +
                        '          <option value="后置" ' + (subTaskList[j].controlProp == "后置" ? "selected" : "") + '>后置</option>' +
                        '          </select>' +
                        '          </div>' +
                        '          <div class="body win7 fileRequire" title="' + subTaskList[j].fileRequire + '">' + subTaskList[j].fileRequire + '</div>' +
                        '          <div class="body win7 fileType">' +
                        '          </div>' +
                        '          <div class="body win7 lender" leader="' + subTaskList[j].leader + '" title="' + subTaskList[j].leaderName + '">' + subTaskList[j].leaderName + '</div>' +
                        '          <div class="body win7">' +
                        '          <a href="javascript:;" class="copy" onclick="copy(this)">复制</a>' +
                        '          <a href="javascript:;" class="del" onclick="del(this)">删除</a>' +
                        '          </div>' +
                        '          </div>';
                    $('.list').eq(i).append(subItem);

                    var fileType = subTaskList[j].repuirementList;
                    var fileTypeArr = [];
                    for (var k = 0; k < fileType.length; k++) {
                        fileTypeArr.push(fileType[k].dataTypeName);
                    }
                    var reList = JSON.stringify(fileType);
                    var fileTypeStr = "<input class='checkFileType' type='text' relist='" + reList + "' onclick='chooseFile(this)' value='" + fileTypeArr.join(',') + "'>";
                    $('.list').eq(i).find('.item-list').eq(j).find('.fileType').append(fileTypeStr)

                    $('.subDel select').change(function () {
                        $(this).parents('.subDel').attr('modifystatus', '1');
                    });

                    $('.taskName').on('input', function () {
                        $(this).parents('.subDel').attr('modifystatus', '1');
                    });
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
                    $(this).hide()
                }
            });

            $('.item-list').each(function () {
                if ($(this).attr('modifyStatus') == '2') {
                    $(this).removeClass('subDel').addClass('subDeleted');
                    $(this).find('input,select').attr('disabled', 'true');
                    $(this).hide()
                } else if ($(this).attr('modifyStatus') == '1') {
                    $(this).find('.num').css('color', 'red')
                }
                if ($(this).attr('approvestatus') == '1') {
                    $(this).find('input').attr('disabled', 'true');
                    $(this).find('select').attr('disabled', 'true');
                    $(this).find('.chooseTime').removeAttr('onclick')
                }
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

    //父节点的拷贝
    pCopy = function (self) {
        event.stopPropagation();
        var str = '<div class="item copyItem idDel">' + $(self).parents('.item').html() + '</div>';
        $(str).insertAfter($(self).parents('.item'));
        for (var i = 0; i < $('.copyItem').find('.item-list').length; i++) {
            if ($('.copyItem').find('.item-list').eq(i).attr('modifyStatus') != 2) {
                $('.copyItem').find('.item-list').eq(i).attr('modifyStatus', '1');
            }
        }
        for (var i = 0; i < $('.idDel').length; i++) {
            var item = $('.idDel').eq(i);
            item.find('.itemNo').html('1.' + (i + 1));
            var itemNo = '1.' + (i + 1);

            for (var j = 0; j < item.find('.subDel').length; j++) {
                var itemList = item.find('.subDel').eq(j);
                itemList.find('.num').html(itemNo + '.' + (j + 1));
            }
        }
    };

    //父节点的删除
    pDel = function (self) {
        event.stopPropagation();
        if ($('.idDel').length == 1) {
            layer.msg('只剩最后的节点了')
            return;
        }
        $(self).parents('.item').attr('modifyStatus', 2).removeClass('idDel');
        $(self).parents('.item').find('.item-list').attr('modifyStatus', 2);
        $(self).parents('.item').hide();
        for (var i = 0; i < $('.idDel').length; i++) {
            var item = $('.idDel').eq(i);
            item.find('.itemNo').html('1.' + (i + 1));
            var itemNo = '1.' + (i + 1);

            for (var j = 0; j < item.find('.subDel').length; j++) {
                var itemList = item.find('.subDel').eq(j);
                itemList.find('.num').html(itemNo + '.' + (j + 1));
            }
        }
    };

    //子节点的拷贝
    copy = function (self) {
        event.stopPropagation()
        $(self).parents('.item-list').clone(true).attr('modifystatus', '1').insertAfter($(self).parents('.item-list'));
        $('.copySubItem').attr('copySubItem', '1');
        for (var i = 0; i < $(self).parents('.list').find('.subDel').length; i++) {
            var itemList = $(self).parents('.list').find('.subDel').eq(i);
            itemList.find('.num').html(itemList.find('.num').html().substr(0, 4) + (i + 1))
        }
    };

    //子节点删除
    del = function (self) {
        event.stopPropagation();
        if ($(self).parents('.list').find('.subDel').length == 1) {
            layer.msg('只剩一个节点了')
            return;
        }
        $(self).parents('.item-list').hide().removeClass('subDel').attr('modifyStatus', 2);
        for (var i = 0; i < $(self).parents('.list').find('.subDel').length; i++) {
            var itemList = $(self).parents('.list').find('.subDel').eq(i);
            itemList.find('.num').html(itemList.find('.num').html().substr(0, 4) + (i + 1))
        }
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
    planTime = function (self) {
        layer.open({
            title: '选择时间',
            type: 2,
            area: ["600px", "450px"],
            content: "html/project_setup/project_plan/chooseTime.html",
            resize: false,
            btn: '确定',
            yes: function (index, layero) {
                var body = layer.getChildFrame('body', index);
                $(self).val(body.attr('time'));
                if (!body.attr('time')) {
                    layer.msg('请选择时间');
                    return;
                }
                var nowTime = new Date().getTime();
                var getTime = new Date(body.attr('time').split(' - ')[0]).getTime();
                $(self).parents('.item-list').find('.planStart').val(body.attr('time').split(' - ')[0]);
                $(self).parents('.item-list').find('.planEnd').val(body.attr('time').split(' - ')[1]);
                // $(self).parents('.item-list').attr('modifyStatus', '1');
                layer.close(index);
            }
        })
    };
    var fileTypeArr = [];
    var fileNameArr = [];
    chooseFile = function (self) {
        layer.open({
            title: '选择文件',
            type: 2,
            area: ["400px", "450px"],
            content: "html/project_setup/project_plan/chooseFile.html",
            resize: false,
            btn: '确定',
            yes: function (index, layero) {
                fileTypeArr.length = 0;
                fileNameArr.length = 0;
                var body = layer.getChildFrame('body', index);
                for (var i = 0; i < body.find('li').length; i++) {
                    var relist = {dataTypeId: '', dataTypeName: ''};
                    if (body.find('li input:checked').eq(i).attr('dataid')) {
                        relist.dataTypeId = body.find('li input:checked').eq(i).attr('dataid')
                        relist.dataTypeName = body.find('li input:checked').eq(i).attr('dataTypeName')
                        fileTypeArr.push(relist);
                        fileNameArr.push(body.find('li input:checked').eq(i).attr('dataTypeName'))
                    }
                }
                $(self).attr('relist', JSON.stringify(fileTypeArr)).val(fileNameArr.join(','));
                /* if (fileTypeArr.length > 0) {
                     $(self).parents('.item-list').attr('modifyStatus', '1');
                 }*/

                layer.close(index);
            }
        })
    };


    //保存按钮
    $('.keep').click(function () {
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            projectId: $('.sign').attr('signid'),
            checkIssubmit: "2",
            tasks: JSON.stringify(getData())
        };
        param.url = 'projectBackend/updateProjectPlan';
        ajaxJS(param, data, function (d) {
            layer.msg(d.desc);
            top.layer.close(index);
            layer.closeAll("iframe");
            parent.location.reload();
        })


    });

    //提交按钮
    $('.hand').click(function () {
        var flag = true;
        for (var i = 0; i < $('.item-list').length; i++) {
            if ($('.item-list').eq(i).attr('modifystatus') != '2' && $('.item-list').eq(i).find('.chooseTime').val() == '') {
                layer.msg('请选择时间');
                return
            }
            if ($('.item-list').eq(i).attr('modifystatus') != '2' && $('.item-list').eq(i).find('.checkFileType').attr('relist') == undefined) {
                layer.msg('请选择文件类型');
                return;
            }
        }

        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            projectId: $('.sign').attr('signid'),
            checkIssubmit: "3",
            tasks: JSON.stringify(getData())
        };

        param.url = 'projectBackend/updateProjectPlan';
        ajaxJS(param, data, function (d) {
            layer.msg(d.desc);
            top.layer.close(index);
            layer.closeAll("iframe");
            parent.location.reload();
        })


    });

    //历史意见按钮
    $('.sugBox').click(function () {
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
    $('.item-list').each(function () {
        $(this).find('.isChange').on('change', function () {
            $(this).parents('.item-list').attr('modifyStatus', '1');
        })
    });

    function getData() {
        var taskArr = [];

        for (var i = 0; i < $('.item').length; i++) {
            var taskList = {taskName: '', serialNo: '', list: []};
            taskList.serialNo = $('.item').eq(i).find('.item-title .itemNo').html();
            taskList.taskName = $('.item').eq(i).find('.item-title .itemName').val();
            taskList.modifystatus = $('.item').eq(i).attr('modifystatus');

            var itemList = $('.item').eq(i).find('.item-list');
            for (var j = 0; j < itemList.length; j++) {
                var subList = {
                    serialNo: '',
                    taskName: '',
                    handType: '',
                    processLevel: '',
                    nodeLevel: '',
                    dangerLevel: '',
                    controlProp: '',
                    leader: '',
                    startDate: '',
                    endDate: '',
                    reList: []
                };
                subList.serialNo = itemList.eq(j).find('.num').html();
                subList.modifyStatus = itemList.eq(j).attr('modifystatus') || 0;
                subList.taskName = itemList.eq(j).find('.name input').val();
                subList.handType = itemList.eq(j).find('.fill').val();
                subList.processLevel = itemList.eq(j).find('.process').val();
                subList.nodeLevel = itemList.eq(j).find('.node').val();
                subList.dangerLevel = itemList.eq(j).find('.defect').val();
                subList.controlProp = itemList.eq(j).find('.feature').val();
                subList.leader = itemList.eq(j).attr('leader');
                subList.startDate = itemList.eq(j).find('.planStart').val();
                subList.endDate = itemList.eq(j).find('.planEnd').val();
                subList.fileRequire = itemList.eq(j).find('.fileRequire').html();
                // subList.reList = JSON.parse(itemList.eq(j).find('.fileType input').attr('relist') || '[]');
                var reList = JSON.parse(itemList.eq(j).find('.fileType input').attr('relist') || '[]');
                var reArr = [];
                for (var k = 0; k < reList.length; k++) {
                    var changeRe = {};
                    changeRe.dataTypeName = reList[k].dataTypeName;
                    changeRe.dataTypeId = reList[k].id || reList[k].dataTypeId;
                    reArr.push(changeRe)
                }
                subList.reList = reArr;
                taskList.list.push(subList);
            }
            taskArr.push(taskList);
        }
        return taskArr;
    }

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


