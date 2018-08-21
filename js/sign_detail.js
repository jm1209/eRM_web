layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form, table = layui.table, $ = layui.jquery, laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;


    //数据表格渲染
    setTimeout(function () {
        tableInit(table, 'centerBackend/getPcSignRecord', [[
            {
                title: '序号', align: 'center', width: 70, templet: function (d) {
                    return d.LAY_INDEX;
                }
            },
            {field: 'empName', title: '签到人', align: 'center',width: 200},
            {field: 'signArea', title: '签到地点', align: 'center'},
            {field: 'signDate', title: '签到时间', width: 150, align: 'center'}
        ]]);
    }, 20);


    laydate.render({
        elem: '#time',
        range: true,
        type: 'datetime'
    });

    //搜索
    $(".search_btn").on("click", function () {
        var startTime = $('#time').val().split(' - ')[0];
        var endTime = $('#time').val().split(' - ')[1] || '';

        search($, table, {
            name: $(".empName").val(),
            startTime: startTime,
            endTime: endTime
        });
    });
    $(".reset").on("click", function () {
        $('.screen-wrapper input').val('');
        form.render();
        table.reload("tableList", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                name: '',
                endTime: '',
                startTime: ''
            }
        });
        $('.screen-wrapper').stop().slideUp();
        $('.screen span').html('筛选')
    });
});
