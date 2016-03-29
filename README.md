#cosmos工具库
__自己平常工作中经常要重复写的东西，稍微做了以下封装，算是我的小工具箱吧__

##validation.js
输入框验证

__使用 @示例:__
```
 verifyInputs([option],id);
 verifyInputs({context: $('#login')},'login')

```
context:验证执行的上下文,将会验证它下面所有设置了data-validation-type属性的input
id:为必须。为验证区域自定义一个标识。

data-validation-type 目前有四种类型：
username
password
phone
email