/*
 Author: YeXiao
 Date: 2018-04-01
 Info:日志打印用
*/
var LogsControler = {
    // 打印输出
    echo:function () {
        var args = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            args.push(arguments[i]);
        }
        cc.log("echo:",args.join(""));
    },
    // 打印错误警告
    echoError:function () {
        var args = [];
        try {
            throw new Error();
        } catch (e) {
            var loc= e.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, "");
            args.push(loc);
        }
        for (var i = 0, l = arguments.length; i < l; i++) {
            args.push(arguments[i]);
        }
        cc.log("echoError:",args.join(","));
    },
    // 打印一个array内数据
    dump:function (arr,nameStr) {
        var args = [];
        try {
            throw new Error();
        } catch (e) {
            var loc= e.stack.replace(/Error\n/).split(/\n/)[1].replace(/^\s+|\s+$/, "");
            args.push(loc);
        }
        args.push(nameStr+":\n{\n");
        var _addArray = function (_arr,_idx) {
            var _args = [];
            var str = "";
            for (var i = 1; i < _idx; i++) {
                str = str + "--";
            };
            for(var key in _arr){
                var value = _arr[key];
                if (SG.SGArray.isArray(value) || SG.SGArray.isObject(value)) {
                    _args.push(str+key+":{\n"+_addArray(value,_idx+1)+str+"}\n");
                }else{
                    _args.push(str+key+":"+value+"\n");
                }
            }
            return _args.join("");
        }
        if (SG.SGArray.isArray(arr) || SG.SGArray.isObject(arr)) {
            args.push(_addArray(arr,1));
        }else{
            args.push(arr+"\n");
        }
        args.push("}");
        cc.log("dump:",args.join(""));
    },
};
module.exports = LogsControler;