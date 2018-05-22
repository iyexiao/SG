
/*
 Author: YeXiao
 Date: 2018-04-07
 Info:公共的基础类
*/

var _widgets = [];
var FuncUtil = {
	// 加载一个预设体
	loadPrefab:function(pName,callBack) {
		cc.loader.loadRes(pName, function(err, prefabAsset){
            if (err) {
                SG.LogsControler.echoError("load prefab error:"+pName+ "error:"+err);
                return;
            }
            if (callBack) {
            	callBack(prefabAsset);
            }
        });
	},
	// 弹一个框(后期这里做动画的设定和框层级的处理)
    pushWidget:function(pNode) {
	    // var scene = cc.director.getScene();
	    // var parent = cc.find("Canvas",scene);
	    var parent = cc.find("Canvas");
	    pNode.parent = parent;
	    _widgets.push(pNode)
    },
    // 移除一个弹框
    popWidget:function(pNode) {
    	_widgets.find(function (pNode) {
    		pNode.removeFromParent();
    	})
    },
    formatSeconds:function (value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        if(theTime > 60) {
            theTime1 = parseInt(theTime/60);
            theTime = parseInt(theTime%60);
            if(theTime1 > 60) {
                theTime2 = parseInt(theTime1/60);
                theTime1 = parseInt(theTime1%60);
            }
        }
        var result = 0;
        if (theTime < 10) {
            result = "0" + parseInt(theTime);
        }else{
            result = parseInt(theTime);
        };
        if(theTime1 > 0) {
            if (theTime1 < 10) {
                result = "0" + parseInt(theTime1)+":"+result;
            }else{
                result = parseInt(theTime1)+":"+result;
            };
        }
        if(theTime2 > 0) {
            if (theTime2 < 10) {
                result = "0" + parseInt(theTime2)+":"+result;
            }else{
                result = parseInt(theTime2)+":"+result;
            };
        }
        return result;
    }
};


module.exports = FuncUtil;