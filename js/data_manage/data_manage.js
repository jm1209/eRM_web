layui.use(['form', 'layer', 'table', 'jquery', 'laydate'], function () {
    var form = layui.form, table = layui.table, $ = layui.jquery, laydate = layui.laydate,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var param = {jquery: $, layer: layer, url: 'systemCenter/dataTypeDrop'};

    var dataArr;
    getItemList();
    var allId, allDataTypeId;

    function getItemList() {
        param.url = 'systemCenter/getDataProjectList';
        ajaxJS(param, {}, function (d) {
            var data = d.data.list;
            for (var i = 0; i < data.length; i++) {
                var ul = $('<ul class="dataBox' + i + '"><div>' + data[i].companyName + '</div></ul>');
                $(".itemBox").append(ul);
                for (var j = 0; j < data[i].projects.length; j++) {
                    var li = $('<li class="item" index="' + data[i].projects[j].projectId + '">' +
                        '       <i class="jstree-ocl"></i>' +
                        '       <i class="iconfont icon-wenjianjia"></i>' +
                        '       <span>' + data[i].projects[j].projectName + '</span>' +
                        '       </li>');
                    $(".dataBox" + i).append(li);
                }
            }


            clickTree();
        });
    }

    function clickTree() {
        $(".item").each(function (i, e) {
            $(e).click(function () {
                var index = $(e).attr("index");
                $(".item").removeClass('red');
                $(this).addClass('red');

                allId = index;
                if (allDataTypeId) {
                    itemClick(index, allDataTypeId);
                } else {
                    itemClick(index);
                }
            })
        })
    }

    param.url = 'systemCenter/dataTypeDrop';
    ajaxJS(param, {power: 1}, function (d) {
        var data = d.data;
        var dataTypeArr = [];
        for (var i = 0; i < data.length; i++) {
            dataTypeArr.push(data[i]);
            var child = data[i].child;
            for (var j = 0; j < child.length; j++) {
                dataTypeArr.push(child[j])
            }
        }
        for (var i = 0; i < dataTypeArr.length; i++) {
            var option = '<option value="' + dataTypeArr[i].id + '">' + dataTypeArr[i].dataTypeName + '</option>';
            $('.dateTypeId').append(option);
        }
        form.render()
    });
    form.on('select(dateTypeId)', function (data) {
        allDataTypeId = data.value;
        if (allId) {
            itemClick(allId, allDataTypeId);
        } else {
            itemClick('',allDataTypeId);
        }
    });


    function itemClick(id, dataTypeId) {
        tableIns = table.render({
            elem: '#tableList',
            url: interfaceUrl + 'systemCenter/getDataList',
            method: 'post',
            page: {
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'], //自定义分页布局
                curr: 1,//设定初始在第 5 页
                groups: 10//只显示 1 个连续页码
            },
            limit: 10,
            limits: [10, 50, 100, 200],
            id: "tableList",
            cols: [[
                {type: "checkbox", fixed: "left", width: 50},
                {
                    title: '序号', align: 'center', templet: function (d) {
                        return d.LAY_INDEX
                    }
                },
                {field: 'fileName', title: '资料名称', align: 'center'},
                {field: 'dateTypeName', title: '资料类别', align: 'center'},
                {
                    title: '操作', templet: function (d) {
                        if (/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(d.fileName)) {
                            return '<button class="layui-btn layui-btn-xs layui-btn-primary" lay-event="down" >下载</button>' +
                                '<a class="layui-btn layui-btn-xs layui-btn-primary" target = "_blank" href="' + sessionStorage.getItem("imgUrl") + d.fileUrl + '" >预览</a>'
                        } else {
                            return '<button class="layui-btn layui-btn-xs layui-btn-primary" lay-event="down" >下载</button>'

                        }
                    }
                }
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
                projectId: id,
                id: id,
                dataTypeId: dataTypeId
            }
        });
    }


    table.on('tool(tableList)', function (obj) {
        var layEvent = obj.event, data = obj.data;
        if (layEvent === 'down') {

            var form = $("<form>");
            form.attr("style", "display:none");
            form.attr("target", "");
            form.attr("method", "post");
            form.attr("action", imgUrl + 'picture-console/common/file/download');
            form.append('<input type="hidden" name="fileName" value="' + data.fileName + '" />')
            form.append('<input type="hidden" name="fileUrl" value="' + data.fileUrl + '" />')
            form.append('<input type="hidden" name="isOnLine" value="false" />')
            $("body").append(form);
            form.submit();
        }
    });

    $('#downFileList').click(function () {
        var checkStatus = table.checkStatus('tableList'), data = checkStatus.data, idArr = [];
        if (data.length > 0) {
            var form = $("<form>");
            form.attr("style", "display:none");
            form.attr("target", "");
            form.attr("method", "post");
            form.attr("action", imgUrl + 'picture-console/common/file/downLoadList');
            form.append("<input type='hidden' name='files' value='" + JSON.stringify(data) + "' />")
            $("body").append(form);
            form.submit();
        } else {
            layer.msg("请选择要下载的文件");
        }



    });
});
