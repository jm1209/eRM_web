layui.use(['form', 'layer', "jquery", 'laydate', "upload"], function () {
    var form = layui.form, $ = layui.jquery, laydate = layui.laydate, upload = layui.upload,
        layer = parent.layer === undefined ? layui.layer : top.layer;

    var param = {jquery: $, layer: layer, url: 'systemCenter/areaDrop'};

    ajaxJS(param, {}, function (d) {
        var provinceList = d.data;

        var province = $("#province"), city = $("#city"), town = $("#town");
        for (var i = 0; i < provinceList.length; i++) {
            addEle(province, provinceList[i]);
        }

        function addEle(ele, value) {
            var optionStr = "";
            optionStr = "<option value=" + value.areaName + ">" + value.areaName + "</option>";
            ele.append(optionStr);
        }

        function removeEle(ele) {
            ele.find("option").remove();
            var optionStar = "<option value=''>" + "请选择" + "</option>";
            ele.append(optionStar);
        }

        var provinceText, cityText, cityItem;
        province.on("change", function () {
            provinceText = $(this).val();
            $.each(provinceList, function (i, item) {
                if (provinceText == item.areaName) {
                    cityItem = i;
                    return cityItem
                }
            });
            removeEle(city);
            removeEle(town);
            $.each(provinceList[cityItem].nodes, function (i, item) {
                addEle(city, item)
            })
        });
        city.on("change", function () {
            cityText = $(this).val();
            removeEle(town);
            $.each(provinceList, function (i, item) {
                if (provinceText == item.areaName) {
                    cityItem = i;
                    return cityItem
                }
            });
            $.each(provinceList[cityItem].nodes, function (i, item) {
                if (cityText == item.areaName) {
                    for (var n = 0; n < item.nodes.length; n++) {
                        addEle(town, item.nodes[n])
                    }
                }
            });
        });
    })
});

