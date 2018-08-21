layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form,
        $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var param = {jquery: $, layer: layer, url: ''};

    var resourceArr = JSON.parse(sessionStorage.getItem('resourceArr'));
    $('.addShow,.delShow,.updateShow').hide();
    if(resourceArr) {
        for (var i = 0; i < resourceArr.length; i++) {
            if (resourceArr[i] == 'addDataClass') {
                $('.addShow').show();
            }
            if (resourceArr[i] == 'delDataClass') {
                $('.delShow').show();
            }
            if (resourceArr[i] == 'updateDataClass') {
                $('.updateShow').show();
            }
        }
    }

    //treeInit();
    createTree();
function createTree() {
    $(".item").html("");
    param.url = 'systemCenter/getDataTypeList';
    ajaxJS(param, {}, function (d) {
        var data = d.data;
        var data = d.data;
        for (var i = 0; i < data.length; i++) {
            var parent = $('<div class="parent">\n' +
                '                <div class="parent_title items checkbox parent_select" open="true" dataTypeName="'+data[i].dataTypeName+'"  value='+data[i].id+' name="parent">\n' +
                '                    <div class="item_select">\n' +
                '                       <i>'+(i + 1)+'</i>\n' +
                '                    </div>\n' +
                '                    <div class="title">\n' +
                '                        <span>'+data[i].dataTypeName+'</span>\n' +
                '                    </div>\n' +
                '                </div>\n'+
                '            </div>');
            $(".item").append(parent);
            if(data[i].nodes) {
                for (var j = 0; j < data[i].nodes.length; j++) {
                    var child = $('<div class="items child child_select" pid="'+data[i].nodes[j].pid+'" dataTypeName="'+data[i].nodes[j].dataTypeName+'" value='+data[i].nodes[j].id+' name="">\n' +
                        '                    <div class="item_select">\n' +
                        '                       <i>'+(i + 1)+'.'+(j + 1)+'</i>\n' +
                        '                    </div>\n' +
                        '                    <div class="title">\n' +
                        '                        <span>'+data[i].nodes[j].dataTypeName +'</span>\n' +
                        '                    </div>\n' +
                        '                </div>');
                    $(".parent").eq(i).append(child)
                }
            }

        }

        form.render();
        // openTree();
        clickSelect()
    })
}




    //点击选择
    function clickSelect() {
        $(".items").each(function (i, e) {
            $(e).click(function () {
                clearSelect()
                $(e).addClass("actives");
                $(e).attr("sel", "true");
            })
        })
    }

    //清除选中
    function clearSelect() {
        $(".items").each(function (i, e) {
            $(e).removeClass("actives");
            $(e).removeAttr("sel");
        })
    }

    function treeInit() {
        param.url = "systemCenter/getDataTypeList";
        ajaxJS(param, {}, function (d) {
            $('#treeview').treeview({
                data: d.data,
                levels: 1
            });



        });
    }


    $(".addPage").click(function () {
        addOrEdit("add");
    });

    $(".editPage").click(function () {
        addOrEdit("edit");
    });

    $(".delPage").click(function () {
        del();
    });

    function addOrEdit(edit) {
        var id, hasParent = false,dataTypeName = "",pid;
        $(".items").each(function (i, e) {
            if ($(e).attr("sel")){
                id = $(e).attr("value");
                dataTypeName = $(e).attr("dataTypeName");
                pid = $(e).attr("pid");
                if ($(e).attr("name") == 'parent'){
                    hasParent = true
                } else {
                    hasParent = false
                }
            }
        })
        if (id ||　edit　== "add") {
            var index = layer.open({
                title: "资料类别",
                type: 2,
                area: ["750px", "580px"],
                content: "html/system_setup/datum_menage/datumAdd.html",
                success: function (layero, index) {
                    var body = $($(".layui-layer-iframe", parent.document).find("iframe")[0].contentWindow.document.body);
                    if (edit == "edit") {
                        body.find(".sign").val("edit").attr("signid", id);
                        body.find(".pid").attr("val",pid);
                        if (hasParent) {
                            body.find(".pid_box").hide();
                        }
                        body.find(".dataTypeName").val(dataTypeName);

                        // body.find(".pid").val(node[0].pid);
                        // body.find(".pname").val(node[0].pname);
                        // body.find(".name").val(node[0].name);
                        // body.find(".ptype").val(node[0].ptype);
                        // body.find(".url").val(node[0].url);
                        // body.find(".icon").val(node[0].icon);
                        // body.find(".type").val(node[0].type);
                        // body.find(".remark").val(node[0].description);
                        // body.find(".status input[value=" + node[0].status + "]").prop("checked", "checked");
                        form.render();
                    } else {
                        // body.find(".seq").val(5);
                        // body.find(".pid").val(node[0].id);
                        // body.find(".pname").val(node[0].name);
                        // body.find(".ptype").val(node[0].type);
                        body.find(".sign").val("add");
                    }
                }
            })
        } else {
            layer.msg("请选择一个资料类别！");
        }
    }

    // 删除操作
    function del() {
        // var node = $('#treeview').treeview('getSelected');
        var id = "", hasParent = false,dataTypeName = "";
        $(".items").each(function (i, e) {
            if ($(e).attr("sel")){
                id = $(e).attr("value");
                dataTypeName = $(e).attr("dataTypeName");
                pid = $(e).attr("pid");
                if ($(e).attr("name") == 'parent'){
                    hasParent = true
                } else {
                    hasParent = false
                }
            }
        })
        if (id&& !hasParent) {
            layer.confirm('确定删除选中的资料类别？', {icon: 3, title: '提示信息'}, function (index) {
                delInfo(id);
            });
        } else if(hasParent) {
            layer.msg("一级资料类别不允许删除！");
            return false;
        } else {
            layer.msg("请选择要删除的资料类别！");
            return false;
        }
    }

    // 删除请求
    function delInfo(data) {
        param.url = 'systemCenter/deleteDataType';
        ajaxJS(param, {dataTypeIds: data}, function (d) {

            layer.closeAll('loading');
            layer.msg(d.desc);
            createTree()
        })
    }
});

function goLogin() {
    parent.goLogin()

}