/*
 Author: YeXiao
 Date: 2018-05-01
 Info: 战斗地图上英雄
*/
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this._qualitySp = cc.find("Sp_Quality", this.node);//品质
        this._headSp = cc.find("Sp_Head", this.node);//头像
        this._hpBar = cc.find("PB_Xue", this.node);//hp
        this._nameLab = cc.find("Lab_Name", this.node);//名字
        this._typeSp = cc.find("Sp_Quality/Sp_Type", this.node);// 类型
        this._starSp = cc.find("Sp_Quality/Nd_Star", this.node);// 星级
        this._infoSp = cc.find("Sp_Quality/Nd_Info", this.node);// buff
        this._infoSp.active = false;
    },
    start () {
    },
    // 更新显示数据
    updateData:function(db) {
        this._db = db;
        this._nameLab.getComponent(cc.Label).string = db.name;
        var self = this;
        cc.loader.loadRes("hero/"+db.cardRes,cc.SpriteFrame, function(err, spriteFrame){
            if (err) {
                SG.LogsControler.echoError("load png error:"+db.cardRes+ "error:"+err);
                return;
            }
            var sp = self._headSp.getComponent(cc.Sprite);
            sp.spriteFrame = spriteFrame;
            // sp.scale = 0.34;
        });
        var qStr = "heroui_wujiang"+db.quality
        cc.loader.loadRes("ui/"+qStr,cc.SpriteFrame, function(err, spriteFrame){
            if (err) {
                SG.LogsControler.echoError("load png error:"+qStr+ "error:"+err);
                return;
            }
            var sp = self._qualitySp.getComponent(cc.Sprite);
            sp.spriteFrame = spriteFrame;
        });
        // 国家
        var cStr = "heroui_c"+db.conuntryType
        cc.loader.loadRes("ui/"+cStr,cc.SpriteFrame, function(err, spriteFrame){
            if (err) {
                SG.LogsControler.echoError("load png error:"+cStr+ "error:"+err);
                return;
            }
            self._typeSp.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        // 星级显示
        for (var i = db.star + 1; i < 6; i++) {
            var node = this._starSp.getChildByName("Sp_Star"+i);
            node.active = false;
        };
    },
    // update (dt) {},
});
