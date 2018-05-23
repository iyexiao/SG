/*
 Author: YeXiao
 Date: 2018-04-01
 Info:配置表数据
*/

var _configArr ={
    Hero:"Hero",
    Enemyinfo:"Enemyinfo",
    Robot:"Robot",
    Attr:"Attr",
    Skill:"Skill",
    Filter:"Filter",
    Attack:"Attack",
};
var _configs = {};
var GameData = {
    // 获取表名
    getConfigName:function() {
        return _configArr
    },
    //======= 所有表 方法 start ====
    // 根据配置表名称获取对应的配置数据
    getConfigByName:function(cfgName) {
        if (_configs[cfgName]) {
            return _configs[cfgName];
        }
        return null;
    },
    // 根据配置表名和id获取对应的配置行
    getConfigByNameId:function(cfgName,id) {
        if (_configs[cfgName] && _configs[cfgName].length >= id) {
            return SG.SGArray.deepCopy(_configs[cfgName][id -1]);
        }
        return null;
    },
    //======= 所有表 方法 end ====
    //======= Homeshop 表 start ====
    //======= Homeshop 表 end ====
    // 加载配置表
    loadConfig:function (callback){
        SG.LogsControler.echo("初始化配置表=====");
        var _arr = [];
        for(var cfg in _configArr){
            _arr.push(cfg)
        }
        var self = this;
        var _doLoadConfi = function(idx) {
            var url = _arr[idx]
            SG.LogsControler.echo("配置表=====",url);
            cc.loader.loadRes("config/"+url, function(err, json){
                if (err) {
                    SG.LogsControler.echoError("配置表加载错误",url,err)
                    return;
                }
                _configs[url] = json;
                if (callback && idx == _arr.length - 1) {
                    callback();
                }else{
                    _doLoadConfi(idx +1);
                }
            });
        }
        _doLoadConfi(0);
    },
};
module.exports = GameData;