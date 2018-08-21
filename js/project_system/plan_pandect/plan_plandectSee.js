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
                var item = '<div class="idDel item" modifyStatus="' + tasks[i].modifyStatus + '">' +
                    '       <div class="item-title" onclick="slide(this)" taskMainId="' + tasks[i].taskMainId + '">' +
                    '       <i class="layui-icon">&#xe602;</i>' +
                    '       <div class="num itemNo">' + tasks[i].serialNo + '</div>' +
                    '       <div class="name"><input disabled class="itemName" type="text" value="' + tasks[i].taskName + '" onclick="javascript: event.stopPropagation();"></div>' +
                    '       <div class="btn">' +
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
                    var subItem = '<div class="item-list subDel" modifyStatus="' + subTaskList[j].modifyStatus + '" taskId="' + subTaskList[j].taskId + '" leader="' + subTaskList[j].leader + '">' +
                        '          <div class="body win5 num">' + subTaskList[j].serialNo + '</div>' +
                        '          <div class="body win7 name" title="' + subTaskList[j].taskName + '">' + subTaskList[j].taskName + '</div>' +
                        '          <div class="body win7">' +
                        '          <select disabled class="fill">' +
                        '          <option value="节点交付" ' + (subTaskList[j].handType == "节点交付" ? "selected" : "") + '>节点交付</option>' +
                        '          <option value="累计交付" ' + (subTaskList[j].handType == "累计交付" ? "selected" : "") + '>累计交付</option>' +
                        '          </select>' +
                        '          </div>' +
                        '          <div class="body win8">' +
                        '          <select disabled class="process">' +
                        '          <option value="1" ' + (subTaskList[j].processLevel == "1" ? "selected" : "") + '>1</option>' +
                        '          <option value="2" ' + (subTaskList[j].processLevel == "2" ? "selected" : "") + '>2</option>' +
                        '          </select>' +
                        '          </div>' +
                        '          <div class="body win8">' +
                        '          <select disabled class="node">' +
                        '          <option value="1" ' + (subTaskList[j].nodeLevel == "1" ? "selected" : "") + '>1</option>' +
                        '          <option value="2" ' + (subTaskList[j].nodeLevel == "2" ? "selected" : "") + '>2</option>' +
                        '          </select>' +
                        '          </div>' +
                        '          <div class="body win7">' +
                        '          <select disabled class="defect" danger="' + subTaskList[j].dangerLevel + '">' +
                        '          </select>' +
                        '          </div>' +
                        '          <div class="body win10 time">' + subTaskList[j].startDate + '' +
                        '          </div>' +
                        '          <div class="body win10 time">' + subTaskList[j].endDate + '' +
                        '          </div>' +
                        '          <div class="body win10">' +
                        '          <select disabled class="feature">' +
                        '          <option value="前置" ' + (subTaskList[j].controlProp == "前置" ? "selected" : "") + '>前置</option>' +
                        '          <option value="后置" ' + (subTaskList[j].controlProp == "后置" ? "selected" : "") + '>后置</option>' +
                        '          </select>' +
                        '          </div>' +
                        '          <div class="body win7 fileRequire" title="' + subTaskList[j].fileRequire + '">' + subTaskList[j].fileRequire + '</div>' +
                        '          <div class="body win7 fileType">' +
                        '          </div>' +
                        '          <div class="body win7 lender" title="' + subTaskList[j].leaderName + '">' + subTaskList[j].leaderName + '</div>' +
                        '          <div class="body win7">' +
                        '          </div>' +
                        '          </div>';
                    $('.list').eq(i).append(subItem);

                    var fileType = subTaskList[j].repuirementList;
                    var fileTypeArr = [];
                    for (var k = 0; k < fileType.length; k++) {
                        fileTypeArr.push(fileType[k].dataTypeName);
                    }
                    var reList = JSON.stringify(fileType);
                    var fileTypeStr = "<p title='" + fileTypeArr.join(',') + "'>" + fileTypeArr.join(',') + "</p>";
                    $('.list').eq(i).find('.item-list').eq(j).find('.fileType').append(fileTypeStr)
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

            $(document).scroll(function (e) {
                debugger
                var scrolltop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                if (scrolltop > 200) {
                    $('.fixed').show();
                } else {
                    $('.fixed').hide();
                }
            });

        });
    }, 500)


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


