layui.use(['form', 'layer', "jquery", 'element', 'table'], function () {
    var form = layui.form, element = layui.element, $ = layui.jquery, table = layui.table,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var param = {jquery: $, layer: layer, url: '', language: sessionStorage.getItem('language') || 1};

    $('#more').click(function () {
        var index = layui.layer.open({
            title: '签到记录',
            type: 2,
            content: "sign_detail.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                form.render();

                setTimeout(function () {
                    layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        });
        layui.layer.full(index);
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
    });

    $('.layui-tab-title li').click(function () {
        setTimeout(function () {
            $('.proName').each(function () {
                var left = $(this).width();
                $(this).css('left', -left - 20)
            });
        }, 20)
    });

    //转跳
    function goto() {
        $(".planToDo").each(function (i, e) {
            $(this).click(function () {
                if ($(this).attr('name') == '日常工作审核') {
                    parent.mainJump($('<a href="javascript:;" data-url="html/daily_manage/daily_work_audit/daily_work_audit.html"><cite>日常工作审核</cite></a>'));
                } else if ($(this).attr('name') == '日常工作复审') {
                    parent.mainJump($('<a href="javascript:;" data-url="html/daily_manage/daily_work_recheck/daily_work_recheck.html"><cite>日常工作复审</cite></a>'));
                } else if ($(this).attr('name') == '日常工作处理') {
                    parent.mainJump($('<a href="javascript:;" data-url="html/daily_manage/daily_work/daily_work.html"><cite>日常工作</cite></a>'));
                } else if ($(this).attr('name') == '计划制定中') {
                    parent.mainJump($('<a href="javascript:;" data-url="html/project_setup/project_plan/project_plan.html"><cite>项目计划</cite></a>'));
                } else if ($(this).attr('name') == '待制定计划') {
                    parent.mainJump($('<a href="javascript:;" data-url="html/project_setup/project_plan/project_plan.html"><cite>项目计划</cite></a>'));
                } else if ($(this).attr('name') == '待审核计划') {
                    parent.mainJump($('<a href="javascript:;" data-url="html/project_setup/plan_approval/plan_approval.html"><cite>项目计划审批</cite></a>'));
                } else if ($(this).attr('name') == '待复审计划') {
                    parent.mainJump($('<a href="javascript:;" data-url="html/project_setup/plan_recheck/plan_recheck.html"><cite>项目计划复审</cite></a>'));
                }
            })
        })
    }


    //待办列表
    param.url = 'centerBackend/homePageInfo';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        var needArr = [];
        for (var k in data) {
            var value = data[k];

            if (value && value.power == '1') {
                var obj = getNeedName(k);
                value.name = getNeedName(k).name;
                value.url = getNeedName(k).url;
                needArr.push(value);
            }
        }

        for (var i = 0; i < needArr.length; i++) {
            var str = '<li class="planToDo" name="' + needArr[i].name + '">' +
                '      <h2>' + needArr[i].name + '</h2>' +
                '      <p>' + needArr[i].counts + '</p>' +
                '      </li>';
            $('.need ul').append(str);
        }
        signRecord(needArr.length);
        goto()
    });

    //项目状态饼状图
    param.url = 'centerBackend/getProjectStatusChart';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        var chartsArr = [];

        for (var k in data) {
            var chartsList = {name: '', value: ''};
            chartsList.name = getProState(k);
            chartsList.value = data[k];
            if (chartsList.value != 0) {
                chartsArr.push(chartsList)
            }
        }

        drawCharts('statusCharts', chartsArr);
    });

    //项目进度拼装图
    param.url = 'centerBackend/getProjectProcessCount';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        var chartsArr = [];

        for (var k in data) {
            var chartsList = {name: '', value: ''};
            chartsList.name = getProSPro(k);
            chartsList.value = data[k];
            if (chartsList.value != 0) {
                chartsArr.push(chartsList)
            }
        }

        drawCharts('proCharts', chartsArr);
    });

    //项目状态项目列表（项目经理维度）
    param.url = 'centerBackend/projectStatusList';
    ajaxJS(param, {}, function (d) {
        planList(d.data);
    });

    function jump(url, projectId) {
        layui.layer.open({
            title: '总览',
            type: 2,
            content: url,
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);

                body.find(".sign").val("edit").attr("signid", projectId).attr('projectId', projectId);

                setTimeout(function () {
                    layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
                layui.layer.full(index);

                $(window).on("resize", function () {
                    layui.layer.full(index);
                })
            }
        })
    }

    //项目财务项目列表
    param.url = 'centerBackend/getProjectFinanceList';
    ajaxJS(param, {}, function (d) {

        financeList(d.data);
    });


    //签到列表
    function signRecord(len) {
        param.url = 'centerBackend/getPcSignRecord';
        len > 4 ? 8 : 5;
        ajaxJS(param, {}, function (d) {
            var data = d.data.list;
            for (var i = 0; i < len; i++) {
                if (i >= data.length) {
                    return;
                }
                var str = '<tr>' +
                    '      <td style="width: 85px"><div style="white-space:nowrap;overflow:hidden;width: 85px;text-overflow: ellipsis;height:20px" title="' + data[i].empName + '">' + data[i].empName + '</div></td>' +
                    '      <td style="width: 160px;"><div style="white-space:nowrap;overflow:hidden;width: 160px;text-overflow: ellipsis;height:20px" title="' + data[i].signArea + '">' + data[i].signArea + '</div></td>' +
                    '      <td style="width: 100px"><div style="white-space:nowrap;overflow:hidden;width: 100px;text-overflow: ellipsis;height:20px" title="' + data[i].signDate + '">' + data[i].signDate + '</div></td>' +
                    '      </tr>';

                $('.table table').append(str)
            }

        });
    }

    function getNeedName(str) {
        var obj = {
            url: "",
            name: ""
        };
        switch (str) {
            case 'dailyApprove':
                obj.name = "日常工作审核";
                obj.url = "daily_manage/daily_work/daily_work.html";
                return obj;
            case 'dailyReview':
                obj.name = "日常工作复审";
                obj.url = "daily_manage/daily_work/daily_work.html";
                return obj;
            case 'dailyWork':
                obj.name = "日常工作处理";
                obj.url = "daily_manage/daily_work/daily_work.html";
                return obj;
            case 'planDoing':
                obj.name = "计划制定中";
                obj.url = "daily_manage/daily_work/daily_work.html";
                return obj;
            case 'planToDo':
                obj.name = "待制定计划";
                obj.url = "daily_manage/daily_work/daily_work.html";
                return obj;
            case 'projectPlanApprove':
                obj.name = "待审核计划";
                obj.url = "daily_manage/daily_work/daily_work.html";
                return obj;
            case 'projectPlanReview':
                obj.name = "待复审计划";
                obj.url = "daily_manage/daily_work/daily_work.html";
                return obj;
        }
    }

    function getProState(str) {
        switch (str) {
            case 'build':
                return '建设中数量';
            case 'finish':
                return '已移交数量';
            case 'part':
                return '部分并网数量';
            case 'start':
                return '启动中数量';
            case 'test':
                return '试运行数量';
        }
    }

    function getProSPro(str) {
        switch (str) {
            case 'levelOne':
                return '严重';
            case 'levelTwo':
                return '一般';
            case 'levelThree':
                return '轻微';
        }
    }

    function planList(d) {
        for (var i = 0; i < d.length; i++) {
            var xAxis = [];
            var series = [];
            var title = d[i].managerName;
            $('#itemStatus').append('<div id="legend_' + i + '" class="legend bar" style="height: 350px;width: 45%"></div>');
            for (var j = 0; j < d[i].projectList.length; j++) {
                xAxis.push(
                    d[i].projectList[j].projectName + "-" +
                    d[i].projectList[j].projectId + "-" +
                    d[i].projectList[j].projectStatus + "-" +
                    d[i].projectList[j].planRate + "-" +
                    d[i].projectList[j].realRate
                );
                if (d[i].projectList[j].status == '0') {
                    series.push(150)
                } else if (d[i].projectList[j].status == '1') {
                    series.push(200)
                } else if (d[i].projectList[j].status == '2') {
                    series.push(250)
                }
            }

            chartBar(title, 'legend_' + i + '', xAxis, series)
        }

    }

    $('.fare').click(function () {
        setTimeout(function () {
            drawTable()
        }, 500)
    });


    function drawCharts(id, dataArr) {
        console.log(dataArr)
        var myChart = echarts.init(document.getElementById(id));
        var option = {
            tooltip: {
                formatter: "{b} : {c} ({d}%)"
            },
            series: [
                {
                    type: 'pie',
                    data: dataArr
                }
            ]
        };
        myChart.setOption(option);
        if (id == 'proCharts') {
            myChart.on('click', function (params) {
                var dangerLevel;
                if (params.name == '严重') {
                    dangerLevel = '1'
                } else if (params.name == '一般') {
                    dangerLevel = '2'
                } else if (params.name == '轻微') {
                    dangerLevel = '3'
                }
                drawTable(dangerLevel)
            });
        } else {
            myChart.on('click', function (params) {
                if (params.name == '启动中数量') {
                    parent.mainJump($('<a href="javascript:;" data-url="html/project_setup/plan_pandect/plan_pandect.html"><cite>计划总览</cite></a>'));
                } else {
                    parent.mainJump($('<a href="javascript:;" data-url="html/daily_manage/daily_pandect/daily_pandect.html"><cite>日常总览</cite></a>'));
                }

            });
        }
    }

    function financeList(d) {
        for (var i = 0; i < d.length; i++) {
            var str = '<ul class="item-pro">' +
                '      <h2 class="proName">' + d[i].projectName + '</h2>' +
                '      </ul>';
            $('.finance').append(str);
            var num = parseInt(d[i].projectStatus);
            for (var j = 0; j < num; j++) {
                var li = ' <li></li>';
                $('.item-pro').eq(i).append(li)
            }
        }

        var color = ['#7178c5', '#78cbf9', '#8bc661', '#f3ba6f'];


        $('.item-pro').each(function (i) {
            var ranNum = Math.floor(Math.random() * 100) % 4
            $(this).find('li').css('background-color', color[ranNum]);
            $(this).hover(function () {
                var div = $("<ul></ul>");
            })
        })
    }

    function drawTable(dangerLevel) {
        var tableIns = table.render({
            elem: '#tableList',
            url: interfaceUrl + 'centerBackend/getProjectProcess',
            method: 'post',
            page: {
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'],
                curr: 1,//设定初始在第 5 页
                groups: 10//只显示 1 个连续页码
            },
            limit: 10,
            limits: [10, 50, 100, 200],
            id: "tableList",
            cellMinWidth: 110,
            cols: [[
                {field: 'dangerLevel', title: '缺陷等级', align: 'center'},
                {field: 'projectName', title: '所属项目', align: 'center'},
                {field: 'taskName', title: '任务节点', align: 'center'},
                {field: 'taskDate', title: '提出时间', align: 'center'},
                {field: 'closeDate', title: '关闭时间', align: 'center'},
                {field: 'approveRemark', title: '监理意见', align: 'center'},
                {field: 'measure', title: '整改措施', align: 'center'}
            ]],
            request: {
                pageName: 'pageIndex',
                limitName: 'pageSize'
            },
            response: {
                countName: 'total',
                dataName: 'list',
                statusCode: 200
            },
            where: {
                token: sessionStorage.getItem('token'),
                dangerLevel: dangerLevel
            }
        });
    }

    function chartBar(title, id, xAxis, series) {
        var myChart = echarts.init(document.getElementById(id));

        var option = {
            title: {
                text: title
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    var project = params[0].name.split('-')[0];
                    var color = params[0].color;
                    var planRate = params[0].name.split('-')[3];
                    var realRate = params[0].name.split('-')[4];


                    if (params[0].data == 150) {
                        var status = '计划工期内完成';
                    } else if (params[0].data == 200) {
                        var status = '轻度逾期';
                    } else if (params[0].data == 250) {
                        var status = '严重逾期';
                    }
                    return '<i style="display: inline-block;margin-right: 5px;width: 13px;height: 13px;border-radius:50%;vertical-align: middle;background-color: ' + color + '"></i>' +
                        status + '<br/>' +
                        project + '<br/>' +
                        '计划进度：' + planRate + '<br/>' +
                        '实际进度：' + realRate;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxis,
                    axisLabel: {
                        show: false,
                        interval: 0
                    },
                    id: xAxis
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '',
                    type: 'bar',
                    barWidth: '60%',
                    data: series,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = ['#64cc70', '#eec442', '#e5220d'];
                                if (params.value == 150) {
                                    return colorList[0]
                                } else if (params.value == 200) {
                                    return colorList[1]
                                } else if (params.value == 250) {
                                    return colorList[2]
                                }
                            }
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
        myChart.on('click', function (params) {
            var productStatus = params.name.split('-')[2];
            var productId = params.name.split('-')[1];

            if (productStatus <= 2) {
                layer.msg('该项目未提交计划，暂时无法查看')
            } else if (productStatus > 2 && productStatus != 6 && productStatus != 8) {
                jump('project_setup/plan_pandect/plan_plandectSee.html', productId);
            } else if (productStatus == 6) {
                jump('daily_manage/daily_pandect/pandect_list.html', productId);
            } else if (productStatus == 8) {
                layer.msg('该项目未提交计划，暂时无法查看')
            }
        });
    }
});


function goLogin() {
    parent.goLogin();
}