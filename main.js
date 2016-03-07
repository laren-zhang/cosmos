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
* @return
* */
function getStyle( obj, attr ){
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}


/*
* 判断元素是狗包含指定元素
* @Param {DOM} parentNode
* @Param {DOM} childNode
* @return {Boolean}
* */
function contains(parentNode, childNode) {
    if (parentNode.contains) {
        return parentNode != childNode && parentNode.contains(childNode);
    } else {
        return !!(parentNode.compareDocumentPosition(childNode) & 16);
    }
}


/* 依赖contains() */
/*
* hover函数
* @Param {DOM} obj DOM对象
* @Param {Function} callbackIn hover时候执行的函数
* @Param {Function} callbackOut 鼠标移出执行函数
* */
function hover(obj, callbackIn, callbackOut){

    obj.onmouseover = function (ev){
        if(isHover(ev , this))
            callbackIn && callbackIn();
    };

    obj.onmouseout = function (ev){
        if(isHover(ev , this))
            callbackOut && callbackOut();
    };

    function isHover(e,target){
        e = e || window.event;

        var fromNode = e.relatedTarget || e.fromElement
            , toNode = e.relatedTarget || e.toElement;

        if (e.type=="mouseover")  {
            return !contains(target, fromNode) && !( fromNode === target);
        } else {
            return !contains(target, toNode) && !(toNode === target);
        }
    }

}

/*
* 对象拷贝继承方法
* */
function extend() {
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


                // 引用类型，执行递归
                if ( deep && copy && ( isPlainObject( copy ) || ( copyIsArray = Array.isArray( copy ) ) ) ) {

                    if ( copyIsArray ) {
                        copyIsArray = false;
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
}


/*
* 简单的PubSub模式 发布者/订阅者模式
*/
(function() {
    function Event() {
        this._events = {};
    }

    Event.prototype.on = function(name, listener) {
        if(this._events[name]){
            this._events[name].push(listener);
        }else{
            this._events[name] = [listener];
        }
    };

    Event.prototype.emit = function(name) {

        var event = this._events[name];
        var len = event && event.length, i = 0;
        var param = Array.prototype.slice.call(arguments, 1);

        for(;i<len;i++){
            this._events[name][i].apply(null, param);
        }

    };

    window.ev = new Event();
})();