layui.use(['form', 'layer', "jquery", "upload"], function () {
    var form = layui.form, $ = layui.jquery, upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var param = {jquery: $, layer: layer, url: 'routineBackend/getGanttChartInfo'};
    var projectId = UrlParm.parm("projectId")
    ajaxJS(param, {projectId: projectId}, function (d) {
        var data = d.data;
        var ganttArr = [{
            name: "",
            series: [
                {name: "计划", start: new Date(), end: new Date(new Date().getTime() + 10000000000)},
                {name: "计划", start: new Date(), end: new Date(new Date().getTime() + 10000000000)}
            ]
        }];
        for (var i = 0; i < data.length; i++) {
            var ganttList = {};
            var series = {};
            var realSeries = {};
            var serieArr = []
            series.name = '计划';
            series.start = new Date(data[i].startDate);
            series.end = new Date(data[i].endDate);
            series.color = '#78afe8';
            serieArr.push(series)

            realSeries.name = '实际';
            realSeries.start = new Date(data[i].startRealDate);
            realSeries.end = new Date(data[i].endRealDate);
            if (data[i].endRealDate > data[i].endDate) {
                realSeries.color = 'red';
            } else {
                realSeries.color = '#66ca91';
            }
            serieArr.push(realSeries)

            ganttList.name = data[i].taskName;
            ganttList.bold = 'bold';
            ganttList.series = serieArr;
            ganttArr.push(ganttList);
            var subTask = data[i].subTaskList;
            for (var j = 0; j < subTask.length; j++) {
                var subGanttList = {};
                var subSeries = {};
                var subRealSeries = {};
                var subSerieArr = [];

                subSeries.name = '计划';
                subSeries.start = new Date(subTask[j].startDate);
                subSeries.end = new Date(subTask[j].endDate);
                subSeries.color = '#78afe8';
                subSerieArr.push(subSeries)

                subRealSeries.name = '实际';
                subRealSeries.start = new Date(subTask[j].startRealDate);
                subRealSeries.end = new Date(subTask[j].endRealDate);

                if (subTask[j].endRealDate > subTask[j].endDate) {
                    subRealSeries.color = 'red';
                } else {
                    subRealSeries.color = '#66ca91';
                }
                subSerieArr.push(subRealSeries)

                subGanttList.name = subTask[j].taskName;
                subGanttList.bold = '';
                subGanttList.series = subSerieArr;
                ganttArr.push(subGanttList)
            }
        }
        for (var i = 0; i < ganttArr.length; i++) {
            var series = ganttArr[i].series;
            for (var j = 0; j < series.length; j++) {
                if (series[j].start == 'Invalid Date') {
                    series.length = 1;
                }
            }
        }



        $("#ganttChart").ganttView({
            data: ganttArr,
            slideWidth: '100%'
        });
    });


});

