layui.use(['form', 'layer', "jquery", "table"], function () {
    var form = layui.form,
        $ = layui.jquery,
        table = layui.table,
        layer = parent.layer === undefined ? layui.layer : top.layer;


    var amountType = 1;
    $('.msg_txt span').html('监理方总金额/epc方总金额为各自节点相加之和，请在下方节点输入即可,单位为（元）。');
    form.on('select(amountType)', function (data) {
        amountType = data.value;
        $('.jl').val('');
        $('.epc').val('');
        $('.total').val('');
        $('.epcLeave').val('');
        $('.jlLeave').val('');
        $('.amountType').attr('amountType', data.value);
        if (amountType == 1) {
            $('.total').attr('disabled', true);
            $('.surplus').hide();
            $('.msg_txt span').html('监理方总金额/epc方总金额为各自节点相加之和，请在下方节点输入即可,单位为（元）。')
        } else {
            $('.total').removeAttr('disabled');
            $('.surplus').css('display', 'inline-block');
            $('.msg_txt span').html('分别输入监理方总金额/epc方总金额，系统会根据百分比自动计算,单位为（元）。');
        }
    });


    //var totalEpc = 0, totalJl = 0;
    $('.money input').each(function () {
        $(this).on('blur', function (e) {
            var amount = $('.amountType').attr('amountType') || 1;
            if (amount == 1) {
                if (/\D/g.test($(this).val())) {
                    $(this).val('');
                    layer.msg('请输入整数');
                }

                if (e.target.className.indexOf('jl') != -1) {
                    var totalJl = 0;
                    for (var i = 0; i < $('.jl').length; i++) {
                        totalJl += parseInt($('.jl').eq(i).val()) || 0;
                    }
                    $('.totalAmount').val(totalJl);
                } else if (e.target.className.indexOf('epc') != -1) {
                    var totalEpc = 0
                    for (var i = 0; i < $('.epc').length; i++) {
                        totalEpc += parseInt($('.epc').eq(i).val()) || 0;
                    }
                    $('.totalEpc').val(totalEpc);
                }
            } else {
                if ($('.total').val() == '') {
                    $(this).val('');
                    layer.msg('请填写两项总金额');
                    return;
                }
                $(this).val(parseFloat($(this).val()).toFixed(2));
                if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$|(%$)/.test($(this).val()) && !/^(100|[1-9]\d|\d)(.\d{1,2})?%$/.test($(this).val())) {
                    $(this).val('');
                } else {
                    $(this).val($(this).val().replace(/%/g, '') + '%');
                }
                if (e.target.className.indexOf('jl') != -1) {
                    var totalJl = 0;
                    for (var i = 0; i < $('.jl').length; i++) {
                        totalJl += parseFloat($('.jl').eq(i).val()) || 0;
                    }
                    $('.jlLeave').val((100 - totalJl).toFixed(2) + '%');
                } else if (e.target.className.indexOf('epc') != -1) {
                    var totalEpc = 0;
                    for (var i = 0; i < $('.epc').length; i++) {
                        totalEpc += parseFloat($('.epc').eq(i).val()) || 0;
                    }
                    $('.epcLeave').val((100 - totalEpc).toFixed(2) + '%');
                }
            }

        })
    });


    form.verify({
        bitian: function (value, item) {
            if (value == '请选择' || value == '' || value == '全部' || value == "0") {
                return '请选择必选项';
            }
        }
    });
    var managerSupervisor, managerEpc;
    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: ''};

    var companyEpc, supervisor;
    getData();

    function getData() {
        param.url = "projectBackend/getProjectById";
        //managerEpc,managerSupervisor
        ajaxJS(param, {projectId: sessionStorage.getItem("pid") || $(".sign").attr("signid")}, function (res) {
            getCompanyList(res.data.companyId);

            // $(".managerEpc").val(res.data.managerEpc);
            var option1 = $('<option value="' + res.data.managerEpc + '">' + res.data.managerEpcName + '</option>');
            $(".managerEpc").append(option1);
            var option2 = $('<option value="' + res.data.managerSupervisor + '">' + res.data.managerSupervisorName + '</option>');
            $(".managerSupervisor").append(option2);
            supervisor = res.data.supervisor;
            companyEpc = res.data.companyEpc;
            var math = /^(100|[1-9]\d|\d)(.\d{1,2})?%$/;
            if (math.test(res.data.formalVision)) {
                $(".amountType").val("2");
            }
            $(".managerSupervisor").val(res.data.managerSupervisor);
            $(".totalAmount").val(res.data.totalAmount);
            $(".totalEpc").val(res.data.totalEpc);
            $("input[name='startEpc']").val(res.data.startEpc);
            $("input[name='buildEpc']").val(res.data.buildEpc);
            $("input[name='partEpc']").val(res.data.partEpc);
            $("input[name='testEpc']").val(res.data.testEpc);
            $("input[name='formalEpc']").val(res.data.formalEpc);
            $("input[name='startVision']").val(res.data.startVision);
            $("input[name='buildVision']").val(res.data.buildVision);
            $("input[name='partVision']").val(res.data.partVision);
            $("input[name='testVision']").val(res.data.testVision);
            $("input[name='formalVision']").val(res.data.formalVision);

            $(".remark").val(res.data.remark)
            if (res.data.reinforceStatus == "on" || res.data.reinforceStatus == "1") {
                $(".layui-unselect").addClass("layui-form-checked");
                $(".reinforceStatus").attr("checked", "true");
            }

        })
        setTimeout(function () {
            form.render();
        }, 500)
    }


    //获取公司
    function getCompanyList(id) {
        param.url = "systemCenter/companySubDrop";
        ajaxJS(param, {companyId: id,companyType:3}, function (res) {
            var data = res.data;
            var option1 = $('<option value="">请选择</option>');
            var option2 = $('<option value="">请选择</option>');
            $(".companyEpc").html("")
            $(".companyEpc").append(option1)
            for (var i = 0; i < data.length; i++) {
                option1 = $('<option value="' + data[i].id + '">' + data[i].companyName + '</option>');
                $(".companyEpc").append(option1)
            }
            setTimeout(function () {
                $(".companyEpc").val(companyEpc);
            }, 200)
            form.render();
            f();
        })
        ajaxJS(param, {companyId: id,companyType:4}, function (res) {
            var data = res.data;
            var option2 = $('<option value="">请选择</option>');
            $(".supervisor").html("")
            $(".supervisor").append(option2)
            for (var i = 0; i < data.length; i++) {
                option2 = $('<option value="' + data[i].id + '">' + data[i].companyName + '</option>');
                $(".supervisor").append(option2)

            }
            setTimeout(function () {
                $(".supervisor").val(supervisor);
            }, 200);
            form.render();
            f();
        })
    }

    function f() {
        form.on('select(companyEpc)', function (data) {
            getperson(data.value);
        });
        form.on('select(supervisor)', function (data) {
            twoperson(data.value);
        });
    }

    //获取对应公司员工
    function getperson(id) {
        if (id == '') {
            $(".managerEpc").empty();
            $(".managerEpc").append('<option value="">请选择</option>');
            form.render();
            return;
        }
        param.url = "systemCenter/getEmpDrop";
        ajaxJS(param, {companySubId: id}, function (d) {
            var data = d.data;
            $(".managerEpc").html("");

            for (var i = 0; i < data.length; i++) {
                var str = ' <option value="' + data[i].empId + '">' + data[i].empName + '</option>';
                $(".managerEpc").append(str);
            }
            form.render();
        })

    }

    function twoperson(id) {
        if (id == '') {
            $(".managerSupervisor").empty();
            $(".managerSupervisor").append('<option value="">请选择</option>');
            form.render();
            return;
        }
        param.url = "systemCenter/getEmpDrop";
        ajaxJS(param, {companySubId: id}, function (d) {
            var data = d.data;
            $(".managerSupervisor").html("");

            for (var i = 0; i < data.length; i++) {
                var str = ' <option value="' + data[i].empId + '">' + data[i].empName + '</option>';
                $(".managerSupervisor").append(str);
            }
            form.render();
        })
    }


    var numberAll = 0, totalAmount = $(".totalAmount").val(), amountType = 1;
    $(".number").each(function (i, e) {
        $(e).focus(function () {
            totalAmount = $(".totalAmount").val() - 0;
            if (!totalAmount) {
                layer.msg("请输入总金额");
                $(".totalAmount").focus();
                return false;
            }
        })
        $(e).blur(function () {
            var data = $(e).val();
            data = data.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            var math = /^(100|[1-9]\d|\d)(.\d{1,2})?%$/;
            var num = /^[0-9]+.?[0-9]*$/;
            if (amountType == 1) {
                if (num.test(data) || data == "") {
                    if (math.test(data)) {
                        $(e).focus();
                        layer.msg("请输入数字");
                    } else {
                        $(e).val(data)
                        jisuan();
                    }
                } else {
                    $(e).focus();
                    layer.msg("请输入数字");
                }
            } else if (amountType == 2) {
                if (math.test(data) || num.test(data) || data == "") {
                    $(e).val(data.split("%")[0] + "%")
                    jisuan();
                } else {
                    $(e).focus();
                    layer.msg("请输入百分数");
                }
            }

        })
    })

    function jisuan() {
        var numberAll = 0;
        $(".number").each(function (i, e) {
            var totalAmount = $(".totalAmount").val() - 0;
            if ($(e).val()) {
                var data = $(e).val();
                if (amountType == 1) {
                    numberAll = numberAll + (data - 0);
                    var data = totalAmount - numberAll;
                    data = data.toString()
                    data = data.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
                    $(".yue").val(data)
                } else if (amountType = 2) {
                    numberAll = numberAll + (data.split("%")[0] - 0);
                    // numberAll = numberAll + (data - 0);
                    $(".yue").val(100 - numberAll + "%")
                }
            }

        })
    }

    $(".totalAmount").blur(function () {
        var data = $(this).val();
        var num = /^[0-9]+.?[0-9]*$/;
        ;
        if (num.test(data) || data == "") {
            data = data.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            $(this).val(data);
        } else {
            $(this).focus();
            layer.msg("请输入数字");
        }
    })
    //完善提交字段
    var companyEpc, supervisor, reinforceStatus, startEpc, buildEpc, partEpc
    var testEpc, formalEpc, startVision, buildVision, partVision, testVision, formalVision, remark, projectId;

    form.on('select(companyEpc)', function (data) {
        companyEpc = data.value;
    });
    form.on('select(managerEpc)', function (data) {
        managerEpc = data.value;
    });
    form.on('select(supervisor)', function (data) {
        supervisor = data.value;
    });
    form.on('select(managerSupervisor)', function (data) {
        managerSupervisor = data.value;
    });


    form.on("submit(addOrEdit)", function (data) {
        /*if (amountType == '2') {
            if ($('.epcLeave').val().indexOf('-') != -1) {
                layer.msg('epc方超出总金额')
                return false;
            } else if (parseInt($('.epcLeave').val()) != 0) {
                layer.msg('epc方未达到总金额')
                return false;
            }
            if ($('.jlLeave').val().indexOf('-') != -1) {
                layer.msg('监理方超出总金额')
                return false;
            } else if (parseInt($('.jlLeave').val()) != 0) {
                layer.msg('监理方未达到总金额')
                return false;
            }
        }*/

        var field = data.field;
        var numberAll = 0;
        var ispass = false;
        var totalAmount = field.totalAmount - 0;
        var yue = $(".yue").val();
        if (yue == 0 || yue == "0%") {
            ispass = true;
        } else {
            ispass = false;

        }

        // if (ispass) {
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var reinforceStatus;
        if ($('.layui-unselect').hasClass('layui-form-checked')) {
            reinforceStatus = '1'
        } else {
            reinforceStatus = '0'
        }

        var dataJson = {
            companyEpc: field.companyEpc,
            managerEpc: field.managerEpc,
            supervisor: field.supervisor,
            managerSupervisor: field.managerSupervisor,
            reinforceStatus: reinforceStatus,
            totalAmount: field.totalAmount,
            totalEpc: field.totalEpc,
            startEpc: field.startEpc,
            buildEpc: field.buildEpc,
            partEpc: field.partEpc,
            testEpc: field.testEpc,
            formalEpc: field.formalEpc,
            startVision: field.startVision,
            buildVision: field.buildVision,
            partVision: field.partVision,
            testVision: field.testVision,
            formalVision: field.formalVision,
            remark: field.remark,
            projectId: sessionStorage.getItem("pid") || $(".sign").attr("signid")
        };

        if ($(".sign").val() == "edit") {  //编辑
            dataJson.id = sessionStorage.getItem("pid") || $(".sign").attr("signid");
            param.url = 'projectBackend/perfectProject';
            ajaxJS(param, dataJson, function (d) {
                top.layer.close(index);
                // top.layer.msg(d.msg);
                layer.closeAll("iframe");
                //刷新父页面
                parent.location.reload();
            })
        }
        /* } else {
             layer.msg("金额输入不正确")
         }*/


        return false;
    });

    $('.reset').click(function () {
        layer.closeAll("iframe");
        //刷新父页面
        parent.location.reload();
    });
});
