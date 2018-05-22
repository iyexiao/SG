/*
 Author: YeXiao
 Date: 2018-05-10
 Info:战斗场景上数据
*/
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
    	this._posArr = [[],[]];//底牌坐标
    	this._pNode = [];//底牌父节点
    	for (var i = 0; i <= 1; i++) {
    		for (var j = 1; j <=6; j++) {
    			var str = "Canvas/Nd_Battle/Nd_Hero_"+i+"/Nd_Touch"+j;
    			var tNode = cc.find(str);
    			this._posArr[i].push(cc.p(tNode.x,tNode.y));
    		};
    		var tmpNode = cc.find("Canvas/Nd_Battle/Nd_Hero_"+i);
    		this._pNode.push(tmpNode);
    	};
    	//阵上的角色
    	this.HeroArr = [[null,null,null,null,null,null],[null,null,null,null,null,null]];
    	var self = this;
        G_EVENT.on(SG.SGEvent.BATTLE_ENTER,function (event) {
            self.initComplete(event.detail);
        })
        G_EVENT.on(SG.SGEvent.BATTLE_UP_HERO,function(event){
            self.upOneHero(event.detail);
        });
    },

    initComplete:function (controler) {
        this._controler = controler;
    },
    // 上阵一个角色
    upOneHero:function (modelHero) {
        var staDB = modelHero._data.getStaCfg();
        var camp = modelHero.camp;
        var posIdx = modelHero.posIdx;
        var pos = this._posArr[camp][posIdx];
        var self = this;
        SG.FuncUtil.loadPrefab("prefab/battle/Battle_Hero",function(pAsset) {
            var pNode = cc.instantiate(pAsset);
            pNode.parent = self._pNode[camp];
            pNode.x = pos.x;
            pNode.y = pos.y;
            var _script = pNode.getComponent("BattleHeroTmpl");
            _script.updateData(staDB);

			SG.SGArray.insert(self.HeroArr[camp],posIdx,pNode);
            self.HeroArr.push(pNode);
        });
    },
});