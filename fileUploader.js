/**
 * Created by hk61 on 2016/3/21.
 */
/**
 * 文件上传
 * @Dependencies [jQuery]
 *
 * @示例：
 *         fileUploader(ev.target.files,{
 *           success:function(file) {
 *               changeUserProfile(file.name);
 *           },
 *           allow:['image/*'],
 *           single: true,
 *           field:'avatar'
 *       });
 */

$(function() {

    var rImageType = /image\/\S+/i
        , rVideoType = /video\/\S+/i
        , rAudioType = /audio\/\S+/i
        , rApplicationType = /application\/\S+/i;


    var flr = fileUploader = function(url, files, option) {
        return new flr.fn.init(url, files, option);
    };

    flr.fn = flr.prototype;

    // 默认配置选项
    flr.option = {

        url:configInfo.server_url + '/api/file/upload',
        allow: ['*'],
        field: 'file',
        single: false,
        data:{},
        success: function(res, xhr) {
            console.log('成功！');
        },
        fail: function(ev, xhr) {
            console.log('失败！');
        },
        progress: function(ev, xhr) {
            console.log('上传中……');
        },
        abort: function(ev, xhr){
            console.log('用户终止。');
        },
        start: function(ev, xhr){
            console.log('上传开始……');
        },
        notAllowed: function(file) {    // 格式错误触发
            console.log(file, '文件格式不被允许');
        }

    };

    flr.option.error = flr.option.fail;


    var init = flr.fn.init = function(url, files, option) {

        if(typeof url != 'string'){
            option = files;
            files = url;
            url = void 0;
        }

        // 文件列表兼容处理
        files = Array.isArray(files) ? files : ( files.length != void 0
            ? Array.prototype.slice.call(files) : [files] );

        // 选项参数扩充
        this.option = $.extend(true, flr.option, option ,{
            url: url,
            files: files,
            fileLength: files.length
        });

        this.uploader( this.option.single ? files.slice(0,1) : files, this.option);

    };

    init.prototype = flr.prototype;


    /*
     * 检测是否与为允许的图片格式
     * @Param {String} type 文件格式，例如'image/png'
     * @return {Boolean}
     * */
    flr.fn.isAllow = function(type) {
        var allow = this.option.allow;

        if(allow.indexOf('*') != -1){
            return true;  // 是否允许所有格式
        }

        if(allow.indexOf('image/*') != -1){   // 是否允许所有图片格式
            return rImageType.test(type);
        }

        if(allow.indexOf('video/*') != -1){   // 是否允许所有视频格式
            return rVideoType.test(type);
        }

        if(allow.indexOf('audio/*') != -1){   // 是否允许所有音频格式
            return rAudioType.test(type);
        }

        if(allow.indexOf('application/*') != -1){   // 是否允许所有应用格式
            return rApplicationType.test(type);
        }

        return allow.indexOf(type) != -1;

    };

    // 文件上传
    flr.fn.uploader = function(files, config) {
        var that = this;

        if( !config.url ){
            throw new Error('Param url is must!');
        }

        var xhr = new XMLHttpRequest();    console.log(xhr);

        xhr.onreadystatechange = function(ev) {
            if (this.readyState == 4) {

                if (this.status == 200) {    // 成功上传

                    var res = JSON.parse(xhr.responseText);
                    config.success.call(that, res, xhr);

                    // 上传终止
                }else if (this.status == 0) {
                    config.abort.call(that, ev, xhr);
                } else {
                    config.error.call(that, ev, xhr);
                }

            }
        };

        // 上传开始
        xhr.upload.onloadstart = function(ev) {
            config.start.call(this, ev, xhr);
        };

        // 上传中
        xhr.upload.onprogress = function(ev) {
            config.progress.call(this, ev, xhr);
        };

        // 出错
        xhr.upload.onerror = function(ev) {
            config.error.call(this, ev, xhr);
        };


        var formData = new FormData();

        // 附加数据通过data扩充
        var data = config.data, val;
        for(var k in data){
            val = data[k];
            if(val){
                formData.append(k, file);
            }
        }

        files.forEach(function(file) {

            var fileExt = file.type!= '' ?
                          file.type : file.path.substring(file.path.lastIndexOf('.') + 1);

            if(!that.isAllow(fileExt) ){
                config.notAllowed && config.notAllowed(file);
                throw new Error('This file\'type be not allowed!');
            }

            formData.append(config.field, file);

        });

        xhr.open('post', config.url, true);
        xhr.setRequestHeader('sid', localStorage.getItem('sid') || 0);
        xhr.send(formData);

    };
    window.fileUploader = fileUploader;

});
