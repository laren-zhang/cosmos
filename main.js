/**
 * Created by cliens on 2016/3/6.
 */

/*
* 发起ajax函数
* @options {JSON} options ajax配置参数
* */
function ajax(options){
    options = {
        method: options.method && options.method.toLocaleString() || 'get' ,
        url: options.url || '/' ,
        sync: options.sync || false ,
        data: options.data || null,
        success: options.success || function(){
        } ,
        fail: options.fail || function(){
        }
    };

    var xhr;
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState != 4) return void 0;
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == '304'){
            options.success(xhr.response);
        }
        else{
            options.fail({
                status: xhr.status ,
                statusText: xhr.statusText
            });
        }
    };
    xhr.open(options.method, options.url, options.sync);
    
    if(options.method === 'post'){
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(options.data);
    }else{
        xhr.send(null);
    }

    return xhr;
}