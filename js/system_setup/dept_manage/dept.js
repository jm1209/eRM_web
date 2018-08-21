layui.use(['form', 'layer', 'table', 'jquery', 'element'], function () {
    var form = layui.form,
        table = layui.table,
        $ = layui.jquery,
        element = layui.element,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    //全局设置ajax请求参数
    var param = {jquery: $, layer: layer, url: '', type: 'post'};
    var tableIns;

    var resourceArr = JSON.parse(sessionStorage.getItem('resourceArr'));
    var isUpdate = false;
    $('.addShow,.delShow').hide();
    if(resourceArr) {
        for (var i = 0; i < resourceArr.length; i++) {
            if (resourceArr[i] == 'addPartyB') {
                $('.addShow').show();
            }
            if (resourceArr[i] == 'delPartyB') {
                $('.delShow').show();
            }
            if (resourceArr[i] == 'updatePartyB') {
                isUpdate = true;
            }
        }
    }

    /*================================================监理公司====================================================================*/
    getTableList('jlTable', {companyListType: 1, companyType: 4});

    var jlDown = true;
    $(".jlBtn").on("click", function () {
        table.reload("jlTable", {
            page: {
                curr: 1
            },
            where: {
                companyName: $(".jlName").val()
            }
        });
        $('.jl-wrapper').stop().slideUp();
        jlDown = true;
        $('.jlScreen span').html('筛选')
    });


    $('.jlScreen').click(function () {
        form.render();
        if (jlDown) {
            $('.jl-wrapper').stop().slideDown();
            jlDown = !jlDown;
            $('.jlScreen span').html('收起')
        } else {
            $('.jl-wrapper').stop().slideUp();
            jlDown = !jlDown;
            $('.jlScreen span').html('筛选')
        }
    });

    //重置
    $('.jlReset').click(function () {
        $('input').val('');
        $('select').val('');
        table.reload("jlTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {companyName: ''}
        });
        $('.jl-wrapper').stop().slideUp();
        jlDown = true;
        $('.jlScreen span').html('筛选')
    });

    $('.jlDel').click(function () {
        del('jlTable')
    });

    /*================================================epc公司====================================================================*/
    getTableList('epcTable', {companyListType: 1, companyType: 3});

    var epcDown = true;
    $(".epcBtn").on("click", function () {
        table.reload("epcTable", {
            page: {
                curr: 1
            },
            where: {
                companyName: $(".epcName").val()
            }
        });
        $('.epc-wrapper').stop().slideUp();
        epcDown = true;
        $('.epcScreen span').html('筛选')
    });

    $('.epcScreen').click(function () {
        form.render();
        if (epcDown) {
            $('.epc-wrapper').stop().slideDown();
            epcDown = !epcDown;
            $('.epcScreen span').html('收起')
        } else {
            $('.epc-wrapper').stop().slideUp();
            epcDown = !epcDown;
            $('.epcScreen span').html('筛选')
        }
    });

    //重置
    $('.epcReset').click(function () {
        $('input').val('');
        $('select').val('');
        table.reload("epcTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {companyName: ''}
        });
        $('.epc-wrapper').stop().slideUp();
        epcDown = true;
        $('.epcScreen span').html('筛选')
    });

    $('.epcDel').click(function () {
        del('epcTable')
    });


    $(".add_btn").click(function () {
        addOrEdit("html/system_setup/dept_manage/deptAdd.html","添加公司");
    });

    //添加和编辑
    function addOrEdit(url, title, edit) {

        if (edit) {
            var pid = edit.pid, pname = edit.pName;
        } else {
            var pid = "", pname = "";
        }

        var index = layer.open({
            title: title,
            type: 2,
            area: ["750px", "450px"],
            content: url + "?pid=" + pid + "&pname=" + pname,
            resize: false,
            success: function (layero, index) {
                var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                if (edit) {

                    body.find(".sign").val("edit").attr("signid", edit.id);
                    body.find("input[name='companyName']").val(edit.companyName).attr('companyNo');
                    body.find(".companyType").attr('companyType',edit.companyType);
                    body.find("input[name='phone']").val(edit.phone);
                    body.find("input[name='email']").val(edit.email);

                    if (edit.used == '1') {
                        body.find('.yzCompany').attr('disabled', true);
                        body.find('.companyType').attr('disabled', true);
                    }

                    if (edit.logoUrl) {
                        body.find(".showImg").show().find('img').attr('src', edit.logoUrl);
                        body.find(".upload-wrapper").hide();
                    } else {
                        body.find(".upload-wrapper").show();
                        body.find(".showImg").hide();
                    }

                    form.render();
                }
            }
        })

    }


    function del(id) {
        var checkStatus = table.checkStatus(id), data = checkStatus.data, idArr = [];

        if (data.length > 0) {
            for (var i in data) {
                idArr.push(data[i].id);
            }
            layer.confirm('确定删除选中的公司？', {icon: 3, title: '提示信息'}, function (index) {
                param.url = 'systemCenter/deleteCompanySub';
                ajaxJS(param, {companyIds: idArr.join(',')}, function (d) {
                    window.location.reload();
                    layer.close(index);
                })
            })
        } else {
            layer.msg("请选择需要删除的公司");
        }
    }

    //数据表格操作按钮
    table.on('tool(jlTable)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit('html/system_setup/dept_manage/deptAdd.html', '编辑公司', data);
        } else if (layEvent === 'see') {
            addOrEdit('html/system_setup/dept_manage/deptSee.html', '查看公司', data);
        }
    });

    table.on('tool(epcTable)', function (obj) {
        var layEvent = obj.event, data = obj.data;

        if (layEvent === 'edit') { //编辑
            addOrEdit('html/system_setup/dept_manage/deptAdd.html', '编辑公司', data);
        } else if (layEvent === 'see') {
            addOrEdit('html/system_setup/dept_manage/deptSee.html', '查看公司', data);
        }
    });

    function getTableList(id, where) {
        where.token = sessionStorage.getItem('token');
        tableIns = table.render({
            elem: '#' + id,
            url: interfaceUrl + 'systemCenter/getCompanyList',
            method: 'post',
            page: {
                layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'],
                curr: 1,
                groups: 10
            },
            limit: 10,
            limits: ['10', '50', '100', '200'],
            id: id,
            cols: [[
                {type: "checkbox", fixed: "left", width: 50},
                {
                    field: '', title: '序号', align: 'center', templet: function (d) {
                        return d.LAY_INDEX;
                    }
                },
                {field: 'companyNo', title: '公司编号', align: 'center'},
                {field: 'companyName', title: '公司名称', align: 'center'},
                {
                    field: 'companyType', title: '公司类型', align: 'center', templet: function (d) {
                        switch (d.companyType) {
                            case '1':
                                return '业主';
                            case '2':
                                return '设计院';
                            case '3':
                                return 'EPC';
                            case '4':
                                return '监理';
                            case '5':
                                return '第三方';
                        }
                    }
                },
                {field: 'pName', title: '业主公司', align: 'center'},
                {
                    title: '操作', width: 100, fixed: "right", align: "center", templet: function (d) {
                        if (isUpdate) {
                            return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="edit">编辑</a>';
                        } else {
                            return '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="see">查看</a>';
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
            where: where
        });
    }
});


function goLogin() {
    parent.goLogin()

}