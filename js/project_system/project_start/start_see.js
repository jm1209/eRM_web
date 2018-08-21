layui.use(['form', 'layer', "jquery", 'laydate', "upload"], function () {
    var form = layui.form, $ = layui.jquery, laydate = layui.laydate, upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: 'projectBackend/getProjectById'};

    setTimeout(function () {
        ajaxJS(param, {projectId: $('.sign').attr('signid')}, function (d) {
            var d = d.data;
            var companyId = d.companyId;
            var manager = d.manager;
            var companyProject = d.companyProject;
            var scienceList = d.scienceList || [];
            var registerList = d.registerList || [];
            var recordList = d.recordList || [];
            var accessList = d.accessList || [];

            //科研或初设资料文件
            for (var a = 0; a < scienceList.length; a++) {
                var scienceTr = '<tr>' +
                    '            <td>' + scienceList[a].fileName + '</td>' +
                    '            <td>' + scienceList[a].fileSize + '</td>' +
                    '            <td class="uploadok">上传成功</td>' +
                    '            <td><button fileUrl="' + scienceList[a].fileUrl + '" fileName="' + scienceList[a].fileName + '"  class="layui-btn layui-btn-normal layui-btn-sm upload" >下载</button></td>' +
                    '            </tr>';
                $('#scienceBox').append(scienceTr);
            }

            //公司注册信息
            for (var b = 0; b < registerList.length; b++) {

                var registerTr = '<tr>' +
                    '            <td>' + registerList[b].fileName + '</td>' +
                    '            <td>' + registerList[b].fileSize + '</td>' +
                    '            <td class="uploadok">上传成功</td>' +
                    '            <td><button fileUrl="' + registerList[b].fileUrl + '" fileName="' + registerList[b].fileName + '"  class="layui-btn layui-btn-normal layui-btn-sm upload">下载</button></td>' +
                    '            </tr>';
                $('#enrollBox').append(registerTr);
            }

            //备案信息
            for (var c = 0; c < recordList.length; c++) {
                var recordTr = '<tr>' +
                    '            <td>' + recordList[c].fileName + '</td>' +
                    '            <td>' + recordList[c].fileSize + '</td>' +
                    '            <td class="uploadok">上传成功</td>' +
                    '            <td><button fileUrl="' + recordList[c].fileUrl + '" fileName="' + recordList[c].fileName + '" class="layui-btn layui-btn-normal layui-btn-sm upload">下载</button></td>' +
                    '            </tr>';
                $('#recordBox').append(recordTr);
            }

            for (var e = 0; e < accessList.length; e++) {
                var accessTr = '<tr>' +
                    '            <td>' + accessList[e].fileName + '</td>' +
                    '            <td>' + accessList[e].fileSize + '</td>' +
                    '            <td class="uploadok">上传成功</td>' +
                    '            <td><button fileUrl="' + accessList[e].fileUrl + '" fileName="' + accessList[e].fileName + '"  class="layui-btn layui-btn-normal layui-btn-sm upload">下载</button></td>' +
                    '            </tr>';
                $('#accessBox').append(accessTr);
            }

            $('.projectNo').val(d.projectNo);
            $('.projectName').val(d.projectName);
            $('.projectType').val(d.projectType);
            $('.areaName').val(d.areaName);
            $('.connectGridTime').val(d.connectGridTime);
            $('.capacity').val(d.capacity);
            $('.recordInfo').val(d.recordInfo);
            $('.accessInfo').val(d.accessInfo);
            $('.baseInfo').val(d.baseInfo);
            $('.others').val(d.others);

            //获取业主公司
            param.url = 'systemCenter/companyDrop';
            ajaxJS(param, {companyListType: 0}, function (company) {
                var data = company.data;
                for (var i = 0; i < data.length; i++) {
                    var str = '<option value="' + data[i].id + '">' + data[i].companyName + '</option>';
                    $('.companyId').append(str);
                }
                $('.companyId').val(companyId)
            });

            //获取项目公司
            param.url = 'systemCenter/companyProjectDrop';
            ajaxJS(param, {companyId: companyId}, function (d) {
                var data = d.data;
                $('.companyProject').empty();
                $('.companyProject').append('<option value="">请选择</option>');
                for (var i = 0; i < data.length; i++) {
                    var str = '<option value="' + data[i].id + '">' + data[i].companyName + '</option>';
                    $('.companyProject').append(str);
                }
                $('.companyProject').val(companyProject)
            });

            //获取项目经理
            param.url = 'systemCenter/getEmpDrop';
            ajaxJS(param, {roleType: 2}, function (emp) {
                var data = emp.data;
                for (var i = 0; i < data.length; i++) {
                    var str = '<option value="' + data[i].empId + '">' + data[i].empName + '</option>';
                    $('.manager').append(str);
                }
                $('.manager').val(d.manager);
            });

            $('.upload').each(function () {
                $(this).click(function () {
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
        })
    }, 500)
});
