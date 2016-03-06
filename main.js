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


/*
 * 拖拽
 * @Param {DOM} obj 要拖拽的对象
 * @Param {JSON} [callbacks] 设定move,end拖拽状态方法
 * @return {JSON} [limit] 对拖拽方向进行限制，默认{x:false, y:false}
 * */
function drag(obj, callbacks , limit) {
    var
        downX
        , downY
        , initX
        , initY
        , moveX
        , moveY
        , doc = document;

    bindEvent(obj, 'mousedown', function(ev) {

        downX = ev.clientX;
        downY = ev.clientY;
        initX = obj.offsetLeft;
        initY = obj.offsetTop;

        bindEvent(doc, "mousemove", move);
        bindEvent(doc, "mouseup", up);
        bindEvent(doc, "selectstart", preventDefault);

        // 阻止默认选取
        function preventDefault(ev) {
            ev.preventDefault();
        }

        function move(ev) {
            moveX = ev.clientX - downX;
            moveY = ev.clientY - downY;

            limit.x || (obj.style.left = initX + moveX + 'px');
            limit.y || (obj.style.top = initY + moveY + 'px');
            callbacks && callbacks.move && callbacks.move.bind(obj)(ev);
        }

        function up(ev) {
            doc.removeEventListener('mousemove', move, false);
            doc.removeEventListener('mouseup', up, false);
            doc.removeEventListener('selectstart', preventDefault, false);
        }

        callbacks && callbacks.end && callbacks.bind(this)();

    });

    // 绑定事件函数
    function bindEvent(obj, event, callbacks) {
        obj.addEventListener(event, callbacks,false);
        return obj;
    }
}

/*
* 获取元素指定样式
* @Param {DOM} obj
* @Param {String} attr 属性名
* */
function getStyle( obj, attr ){
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}