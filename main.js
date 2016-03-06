/**
 * Created by cliens on 2016/3/6.
 */

/*
* 发起ajax函数
* @Param {JSON} options ajax配置参数
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

/*
* 类jQuery元素获取，但是返回的是原生DOM对象
* @Param {String} query 查询字符串
* @Param {DOM} [context] 查询上下文，默认document
* @return {DOM} 返回Node或NodeList;当query为函数时返回值为null
* */
function $N(query , context){
    query = query.trim();
    context = context || document;
    var type = query.charAt(0);

    if(typeof query == 'Function'){
        query();
        return null;
    }

    query = query.substring(1);
    switch(type){
        case '#':
            return document.getElementById();
        case '.':
            return context.getElementsByClassName(query);
        default:
            return context.getElementsByTagName(query);
    }

}