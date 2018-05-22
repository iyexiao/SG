/*
 Author: YeXiao
 Date: 2018-05-01
 Info:战斗UI手牌道具处理
*/
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this._qualitySp = cc.find("Sp_Quality", this.node);//品质
        this._iconSp = cc.find("Sp_Icon", this.node);//头像
        this._angerSp = cc.find("Sp_Bg_Name/Sp_Bg_Anger/Sp_Anger", this.node);//怒气
        this._nameLab = cc.find("Sp_Bg_Name/Lab_Name", this.node);//名字
    },
    start () {
    },
    // 更新显示数据
    updateData:function(db) {
        this._db = db;
        this._nameLab.getComponent(cc.Label).string = db.name;
        var self = this;
        cc.loader.loadRes("head/"+db.headRes,cc.SpriteFrame, function(err, spriteFrame){
            if (err) {
                SG.LogsControler.echoError("load png error:"+db.headRes+ "error:"+err);
                return;
            }
            var sp = self._iconSp.getComponent(cc.Sprite);
            sp.spriteFrame = spriteFrame;
            sp.scale = 0.5;
        });
        var qStr = "common_q"+db.quality
        cc.loader.loadRes("ui/"+qStr,cc.SpriteFrame, function(err, spriteFrame){
            if (err) {
                SG.LogsControler.echoError("load png error:"+qStr+ "error:"+err);
                return;
            }
            var sp = self._qualitySp.getComponent(cc.Sprite);
            sp.spriteFrame = spriteFrame;
        });
        var aStr = "artText_uiNum2"+db.anger
        cc.loader.loadRes("common/"+aStr,cc.SpriteFrame, function(err, spriteFrame){
            if (err) {
                SG.LogsControler.echoError("load png error:"+aStr+ "error:"+err);
                return;
            }
            self._angerSp.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    // update (dt) {},
});
