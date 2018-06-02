/*
 Author: YeXiao
 Date: 2018-04-01
 Info:游戏入口
*/

const GameData = require("GameData");

cc.Class({
    extends: cc.Component,

    onLoad () {
        this._homeNode = cc.find("Canvas/Nd_Home");
        this.checkInit();
    },
    // 初始化全局变量
    checkInit:function() {
        var self = this;
        GameData.loadConfig(function() {
            // 初始化场景数据
            self._homeNode.getComponent("HomeControler").loadData();
        });
    },
    update (dt) {
        // cc.log("aa===,",dt);
    },
});
