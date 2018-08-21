layui.use(['form', 'layer', "jquery", 'table', 'laydate', "element", "tree"], function () {
    var form = layui.form, $ = layui.jquery, table = layui.table, laydate = layui.laydate, element = layui.element,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: 'projectBackend/getProjectById'};

    setTimeout(function () {
        //给负责人列插值
        $('.lender').html($('.sign').attr('leadername'));
        $('.lender').attr('lender', $('.sign').attr('leader'));
        $('.lender').attr('title', $('.sign').attr('leadername'));

        ajaxJS(param, {projectId: $('.sign').attr('signid')}, function (d) {
            var data = d.data;
            $('.projectNo').val(data.projectNo);
            $('.projectName').val(data.projectName);
            $('.projectType').val(getProjectType(data.projectType));
            $('.capacity').val(data.capacity);
            $('.connectGridTime').val(data.connectGridTime);
        });

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
    }, 500);

    $(document).scroll(function (e) {
        var scrolltop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrolltop > 200) {
            $('.fixed').show();
        } else {
            $('.fixed').hide();
        }
    });

    $('.subDel select').change(function () {
        $(this).parents('.subDel').attr('modifystatus', '1');
    });

    $('.taskName').on('input', function () {
        $(this).parents('.subDel').attr('modifystatus', '1');
    });

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

            for (var j = 0; j < item.find('.item-list').length; j++) {
                var itemList = item.find('.item-list').eq(j);
                itemList.find('.num').html(itemNo + '.' + (j + 1));
            }
        }
    };

    //父节点的删除
    pDel = function (self) {
        event.stopPropagation();
        if ($('.idDel').length == 1) {
            layer.msg('只剩一个节点了')
            return;
        }
        if ($('.item').length <= 1) {
            layer.msg('只剩最后的节点了');
            return;
        }
        $(self).parents('.item').attr('modifyStatus', 2).removeClass('idDel');
        $(self).parents('.item').find('.item-list').attr('modifyStatus', 2);
        if ($(self).parents('.item').hasClass('initial')) {
            $(self).parents('.item').hide();
        } else {
            $(self).parents('.item').remove();
        }
        for (var i = 0; i < $('.idDel').length; i++) {
            var item = $('.idDel').eq(i);
            item.find('.itemNo').html('1.' + (i + 1));
            var itemNo = '1.' + (i + 1);

            for (var j = 0; j < item.find('.item-list').length; j++) {
                var itemList = item.find('.item-list').eq(j);
                itemList.find('.num').html(itemNo + '.' + (j + 1));
            }
        }
    };

    //子节点的拷贝
    copy = function (self) {
        event.stopPropagation();
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
        $(self).parents('.item-list').removeClass('subDel').attr('modifyStatus', 2);
        if ($(self).parents('.item-list').hasClass('initial')) {
            $(self).parents('.item-list').hide()
        } else {
            $(self).parents('.item-list').remove();
        }
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
            value: new Date(),
            isInitValue: true,
            content: "html/project_setup/project_plan/chooseTime.html",
            resize: false,
            btn: '确定',
            yes: function (index, layero) {
                var body = layer.getChildFrame('body', index);
                $(self).val(body.attr('time'));
                var nowTime = new Date().getTime();
                if (!body.attr('time')) {
                    layer.msg('请选择时间');
                    return;
                }
                var getTime = new Date(body.attr('time').split(' - ')[0]).getTime();
                /* $(self).parents('.item-list').attr('modifyStatus', '1');
                 $(self).parents('.item').attr('modifyStatus', '1');*/
                $(self).parents('.item-list').find('.planStart').val(body.attr('time').split(' - ')[0]);
                $(self).parents('.item-list').find('.planEnd').val(body.attr('time').split(' - ')[1]);
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
                /*if (fileTypeArr.length > 0) {
                    $(self).parents('.item-list').attr('modifyStatus', '1');
                    $(self).parents('.item').attr('modifyStatus', '1');
                }*/

                layer.close(index);
            }
        })
    };
    $('.item-list').each(function () {
        $(this).find('.isChange').on('change', function () {
            $(this).parents('.item-list').attr('modifyStatus', '1');
            $(self).parents('.item').attr('modifyStatus', '1');
        })
    });


    //保存按钮
    $('.keep').click(function () {

        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var data = {
            projectId: $('.sign').attr('signid'),
            checkIssubmit: "2",
            tasks: JSON.stringify(getData())
        };
        param.url = 'projectBackend/submitProjectPlan';
        ajaxJS(param, data, function (d) {
            top.layer.close(index);
            layer.msg(d.desc);
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
            if ($('.item-list').eq(i).attr('modifystatus') != '2' && $('.item-list').eq(i).find('.fileType').attr('relist') == undefined) {
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
        param.url = 'projectBackend/submitProjectPlan';
        ajaxJS(param, data, function (d) {
            top.layer.close(index);
            layer.msg(d.desc);
            layer.closeAll("iframe");
            parent.location.reload();
        })


    });

    function getData() {
        var taskArr = [];

        for (var i = 0; i < $('.item').length; i++) {
            var taskList = {taskName: '', serialNo: '', list: []};
            taskList.serialNo = $('.item').eq(i).find('.item-title .itemNo').html();
            taskList.taskName = $('.item').eq(i).find('.item-title .itemName').val();
            taskList.modifystatus = $('.item').eq(i).attr('modifystatus') || 0;

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
                subList.leader = itemList.eq(j).find('.lender').attr('lender');
                subList.startDate = itemList.eq(j).find('.planStart').val();
                subList.endDate = itemList.eq(j).find('.planEnd').val();
                subList.fileRequire = itemList.eq(j).find('.fileRequire').html();
                subList.reList = JSON.parse(itemList.eq(j).find('.fileType').attr('relist') || '[]');
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



