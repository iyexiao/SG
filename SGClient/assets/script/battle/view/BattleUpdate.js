/*
 Author: YeXiao
 Date: 2018-05-01
 Info:游戏主界面的逻辑
*/

cc.Class({
    extends: cc.Component,

    onLoad () {
        this._isInit = false;
        this._controler = null;
        var self = this;
        G_EVENT.on(SG.SGEvent.BATTLE_ENTER,function (event) {
            self._controler = event.detail;
            self._isInit = true;
        })
    },
    update(dt){
        // 开始走循环
        if (this._isInit && this._controler) {
            this._controler.startLoop(dt);
        };
    },
});
