/**
 * Created by hk61 on 2016/3/21.
 */
/**
 * Created by hk61 on 2016/3/21.
 */
/**
 * 文件上传
 *
 * @param {Array} files file控件内容
 */


var rImageType = /image\/.*/i;
var rVideoType = /video\/.*/i;
var rAudioType = /audio\/.*/i;
var rApplicationType = /application\/.*/i;


var flr = fileUploader = function(url, files, option) {

    return new flr.fn.init(url, files, option);

};

flr.fn = flr.prototype;

flr.fn.option = {
    allow: ['*'],
    single: false
};

flr.extend = flr.fn.extend = function extend() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // 如果是深拷贝
    if ( typeof target === "boolean" ) {
        deep = target;

        // 跳过boolean
        target = arguments[ i ] || {};
        i++;
    }

    // 处理target非对象情况
    if ( typeof target !== "object" && {}.toString.call( target ) !== 'Function' ) {
        target = {};
    }

    for ( ; i < length; i++ ) {

        // 只扩展 non-null 值
        if ( ( options = arguments[ i ] ) != null ) {

            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // 防止死循环
                if ( target === copy ) {
                    continue;
                }

                copyIsArray = Array.isArray( copy );
                // 引用类型，执行递归
                if ( deep && copy && ( isPlainObject( copy ) || copyIsArray) ) {

                    if ( copyIsArray ) {
                        clone = src && Array.isArray( src ) ? src : [];
                    } else {
                        clone = src && isPlainObject( src ) ? src : {};
                    }

                    target[ name ] = extend( deep, clone, copy );

                    // 不扩展 undefined 值
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    function isPlainObject( obj ) {

        // - 任何对象内部 [[Class]]属性不为"[object Object]"
        // - DOM nodes
        // - window
        if ( typeof obj !== "object" || obj.nodeType || obj === obj.window ) {
            return false;
        }else if( obj.constructor && ! {}.hasOwnProperty.call( obj.constructor.prototype, "isPrototypeOf" ) ){
            return false;
        }

        return true;
    }

    return target;
};

var init = flr.fn.init = function(url, files, option) {

    files = Array.isArray(files) ? files : [files];
    this.option = option || {};
    console.log(this);
    this.extend(true, this.option, {
        url: url,
        file: files,
        fileLength: files.length,
        donePointer: 0
    });

    this.singleUploader(files[0], this.option);

};

init.prototype = flr.prototype;

/*
 * 检测是否与为允许的图片格式
 * @Param {String} type 文件格式，例如'image/png'
 * @return {Boolean}
 * */
flr.fn.isAllow = function(type) {

    var allow = this.option.allow;

    if(allow.indexOf('*')) return true; // 是否允许所有格式


    if(allow.indexOf('image/*')){   // 是否允许所有图片格式
        return rImageType.test(type);
    }

    if(allow.indexOf('video/*')){   // 是否允许所有视频格式
        return rVideoType.test(type);
    }

    if(allow.indexOf('audio/*')){   // 是否允许所有音频格式
        return rAudioType.test(type);
    }

    if(allow.indexOf('application/*')){   // 是否允许所有应用格式
        return rApplicationType.test(type);
    }

    return allow.indexOf(type) != -1;

};


flr.fn.multiUploader = function(config) {

    var files = config.files;
    this.len = files.length;

    for(var i = 0; i< len; i++){
        this.singleUploader(files[i], config)
    }

};


// 单个文件上传
flr.fn.singleUploader = function(file, config) {

    if( !config.url ){
        throw new Error('Param url is must!');
    }

    file = config.file;

    if(!this.isAllow(file.type) ){
        throw new Error('This file\'type be not allowed!');
    }

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {

            if (this.status == 200) {    // 成功上传
                var res = JSON.parse(xhr.responseText);
                if( this.donePointer == this.fileLength ){
                    config.success && config.success(res);
                }
                // 上传终止
            }else if (this.status == 0) {
                config.abort && config.abort(xhr);
            } else {
                fail && fail(xhr);
                config.error && config.error(xhr);
            }

        }
    };

    // 上传开始
    xhr.upload.onloadstart = function() {
        config.start && config.start(xhr);
    };

    // 上传中
    xhr.upload.onprogress = function(ev) {
        config.progress && config.progress(ev);
    };

    var formData = new FormData();
    formData.append("file", file);
    xhr.open('post', config.url, true);
    xhr.send(formData);

};