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
        });
        G_EVENT.on(SG.SGEvent.BATTLE_INIT,function (event) {
            self._controler = event.detail;
            self.multyInit();
        })
    },
    update(dt){
        // 开始走循环
        if (this._isInit && this._controler) {
            this._controler.startLoop(dt);
        };
    },
    // 多人初始化websocket
    multyInit:function() {
        var self = this;
        window.G_WS = new WebSocket("ws://localhost:3000");
        window.G_WS.onopen = function (msg) {
            cc.log("connected success!!");
            var battleInfo = SG.UserModel.getBattleInfo();
            var params = {battleInfo:battleInfo,t:SG.Fight.MsgType.init};
            window.G_WS.send(JSON.stringify(params));
        };
        window.G_WS.onmessage = function (msg) {
            if (!msg.data) {
                return;
            };
            if (!self._controler) {
                return;
            };
            // 获取服务器推送
            var NotifyType  = SG.Fight.NotifyType
            var tmpArr = JSON.parse(msg.data);
            switch(tmpArr.t){
                case NotifyType.roomComplete:
                    // 收到房间初始化完成就发资源加载完成
                    var params = {uId:self._controler.levelInfo.getUserId()}
                    self._controler.server.sendLoadResComplete(params);
                    break
                case NotifyType.startBattle:
                    self._isInit = true;
                    self._controler.handle.receiveOneHandle(tmpArr.info);
                    break
                case NotifyType.handle:
                    self._controler.handle.receiveOneHandle(tmpArr.info);
                    break
                default:
            }
            // cc.log("onmessage!",);
        };
        window.G_WS.onerror = function (msg) {
            cc.log("onerror!");
        };
        window.G_WS.onclose = function (msg) {
            cc.log("onclose!");
        };
    }
});
