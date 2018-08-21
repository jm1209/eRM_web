layui.use(['form', 'jquery', 'upload'], function () {
    var form = layui.form,
        upload = layui.upload;
    $ = layui.jquery;


    var uploadArr = []
    var demoListView = $('#demoList'),
        uploadListIns = upload.render({
            elem: '#testList',
            url: sessionStorage.getItem("imgUrl") + 'picture-console/common/file/upload',
            accept: 'file',
            multiple: true,
            choose: function (obj) {
                var files = this.files = obj.pushFile();
                //读取本地文件
                obj.preview(function (index, file, result) {
                    var tr = $(['<tr id="upload-' + index + '">'
                        , '<td>' + file.name + '</td>'
                        , '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>'
                        , '<td>等待上传</td>'
                        , '<td>'
                        , '<button class="layui-btn layui-btn-mini demo-reload layui-hide">重传</button>'
                        , '<button class="layui-btn layui-btn-mini layui-btn-danger demo-delete">删除</button>'
                        , '</td>'
                        , '</tr>'].join(''));

                    //单个重传
                    tr.find('.demo-reload').on('click', function () {
                        obj.upload(index, file);
                    });

                    //删除
                    tr.find('.demo-delete').on('click', function () {
                        for(var i = 0; i < uploadArr.length; i++) {
                            if (uploadArr[i].fileName == file.name) {
                                uploadArr.splice(i, 1);
                            }
                        }

                        delete files[index]; //删除对应的文件
                        tr.remove();
                        uploadListIns.config.elem.next()[0].value = '';
                    });

                    demoListView.append(tr);
                });
            },
            done: function (res, index, upload) {
                if (res.code == '200') { //上传成功
                    uploadArr.push(res.data[0])
                    $('#uploadJson').val(JSON.stringify(uploadArr));
                    var tr = demoListView.find('tr#upload-' + index)
                        , tds = tr.children();
                    tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                    return delete this.files[index]; //删除文件队列已经上传成功的文件

                }
                this.error(index, upload);
            },
            error: function (index, upload) {
                var tr = demoListView.find('tr#upload-' + index)
                    , tds = tr.children();
                tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
                tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
            }
        });
})

