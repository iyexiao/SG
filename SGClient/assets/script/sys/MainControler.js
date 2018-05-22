/*
 Author: YeXiao
 Date: 2018-05-01
 Info:游戏主界面的逻辑
*/

cc.Class({
    extends: cc.Component,

    onLoad () {
        this._btnBattle = cc.find("Canvas/Btn_Battle");
        this.checkInit();
    },
    // 初始化全局变量
    checkInit:function() {
        var self = this;
        SG.GameData.loadConfig(function() {
            // 这里开始初始化用户数据
        });
    },
    startBattle:function () {
    	var onSceneLaunched = function () {
    		var battleInfo = SG.UserModel.getBattleInfo();
	        // SG.LogsControler.dump(battleInfo,"战斗场景初始化完毕===");
	        // 开始调用战斗逻辑
	        SG.BattleControler.startBattleInfo(battleInfo);
    	}
		cc.director.loadScene("game", onSceneLaunched);
    }
});
