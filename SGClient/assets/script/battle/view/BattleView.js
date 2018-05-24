/*
 Author: YeXiao
 Date: 2018-05-01
 Info:战斗UI
*/
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this._cardArr = [null,null,null];//手牌数组
        this._bottomUI = cc.find("Nd_UI_Bottom", this.node);//图片
        this._timeLab = cc.find("Nd_UI_Right/Lab_Time",this.node);//倒计时
        var self = this;
        G_EVENT.on(SG.SGEvent.BATTLE_ENTER,function (event) {
            self.initComplete(event.detail);
        })
        G_EVENT.on(SG.SGEvent.BATTLE_STATE_CHANGE,function (event) {
            self.updateGameState(event.detail);
        });
        G_EVENT.on(SG.SGEvent.BATTLE_UP_HERO,function (event) {
            self.updateHandCard(event.detail);
        });
        // 隐藏一开始不需要显示的ui
        this._touchArr = [];
        for (var i = 0; i < 2; i++) {
            for (var j = 1; j <= 6; j++) {
                var node = cc.find("Canvas/Nd_Battle/Nd_Touch_"+i+"_"+j);
                node.active = false;
                // 我方
                if (i == 0) {
                    node.sp1 = node.getChildByName("Sp_1");
                    node.sp2 = node.getChildByName("Sp_2");
                    this._touchArr.push(node);
                };
            };
        };
        this._selectCard = cc.find("Canvas/Nd_Battle/Nd_Select_Card");
        this._selectCard.active = false;
        this._touchNode = cc.find("Canvas/Nd_Battle");//我方布阵的状态
        this._wSize = cc.size(640,400);
        this._nSize = this._selectCard.getContentSize();
        this._tmpY = this._selectCard.y;//最小Y值
    },

    start () {
    },
    initComplete:function (controler) {
        this._controler = controler;
        this.updateHandCard();
    },
    // 更新手牌
    updateHandCard:function (modelHero) {
        if (!modelHero) {
            var self = this;
            var handCardArr = this._controler.getHandCardArrByCamp(SG.Fight.camp_1);
            SG.FuncUtil.loadPrefab("prefab/battle/Battle_UI_Card",function(pAsset) {
                for (var i = 0; i < handCardArr.length; i++) {
                    var pNode = cc.instantiate(pAsset);
                    pNode.parent = self._bottomUI;
                    pNode.x = i * 130 + 174;
                    var staDB = handCardArr[i].getStaCfg();
                    var _script = pNode.getComponent("BattleUICardTmpl");
                    _script.updateData(staDB);
                    pNode._hId = staDB.id;//用于发送卡牌id用
                    self.setTouchFunc(pNode)
                    SG.SGArray.insert(self._cardArr,i,pNode);
                    // SG.LogsContoler.echoError("aa-",i);
                };
            });
        }else{
            // 敌方上人我不需要更新我的手牌ui
            if (modelHero.camp == SG.Fight.camp_2) {
                return;
            };
            var handCardArr = this._controler.getHandCardArrByCamp(SG.Fight.camp_1);
            for (var i = 0; i < this._cardArr.length; i++) {
                var pNode = this._cardArr[i];
                var staDB = handCardArr[i].getStaCfg();
                var _script = pNode.getComponent("BattleUICardTmpl");
                _script.updateData(staDB);
                pNode._hId = staDB.id;//用于发送卡牌id用
            };
        };
    },
    // 处理触摸事件
    setTouchFunc:function  (node) {
        // 处理触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchCancel, this);
    },
    // 检查边界
    checkBound:function(pos) {
        var _pos = this._touchNode.convertToNodeSpaceAR(pos);
        var x = _pos.x;
        var y = _pos.y;
        var x1 = (-this._wSize.width + this._nSize.width)/2;
        var x2 = (this._wSize.width - this._nSize.width)/2;
        if (x < x1 ) {
            x = x1;
        }else if(x > x2 ){
            x = x2;
        }
        // var y1 = (-this._wSize.height + this._nSize.height)/2;
        // var y2 = (this._wSize.height - this._nSize.height)/2;
        var y1 = this._tmpY;
        var y2 = this._tmpY + this._wSize.height;
        if (y < y1 ) {
            y = y1;
        }else if(y > y2){
            y = y2;
        }
        return cc.p(x,y)
    },
    touchStart:function (event) {
        var pos = event.getLocation();
        for (var i = 0; i < this._cardArr.length; i++) {
            var _card = this._cardArr[i];
            var box = _card.getBoundingBox();
            var _pos = this._bottomUI.convertToNodeSpaceAR(pos);
            if (box.contains(_pos)) {
                _card.active = false;
                this._selectIdx = i;
                break;
            };
        };
        if (this._selectIdx >= 0) {
            this._starPos = pos;//this.node.convertToNodeSpaceAR(pos);
            this.chkSelectCard();
        };
    },
    touchMove:function (event) {
        if (this._selectIdx < 0 ) {
            return
        };
        // var delta = event.touch.getDelta();
        var pos = event.getLocation();
        this.updateCardPos(pos);
        // 更新显示格子
    },
    touchEnd:function (event) {
        if (this._selectIdx >= 0  && this._selectPos >= 0) {
            // 检查次位置是否英雄

            // 上阵一个英雄
            var server = this._controler.server;
            var camp = this._controler.levelInfo.getMyCamp();
            var hId = this._cardArr[this._selectIdx]._hId;
            server.sendUpHero({h:hId,p:this._selectPos,c:camp});
        }
        this.resetTouch()
    },
    touchCancel:function (event) {
        this.resetTouch()
    },
    // 重置触摸
    resetTouch:function() {
        this._selectCard.active = false;
        this._starPos = null;
        this._isMove = false;
        // 刷新成新的卡片
        this._cardArr[this._selectIdx].active = true;

        this._selectIdx = -1;//选的卡的idx
        this._selectPos = -1;//选的位置

        for (var i = 0; i < this._touchArr.length; i++) {
            var _tNode = this._touchArr[i];
            _tNode.active = false;
        }
    },
    // 创建一张卡牌
    chkSelectCard:function () {
        if (this._selectIdx < 0) {
            return
        };
        this._isMove = true;
        this._selectCard.active = true;
        this._selectCard.zIndex = 100;
        this.updateCardPos(cc.p(this._starPos.x,this._starPos.y));
        // 显示可显示的框：TODO，被破路了就不再显示
        for (var i = 0; i < this._touchArr.length; i++) {
            var _tNode = this._touchArr[i];
            _tNode.active = true;
            _tNode.sp1.active = true;
            _tNode.sp2.active = false;
        };
        // 更新选中的卡牌的信息
    },
    // 更新卡牌的位置
    updateCardPos:function (_pos) {
        var pos = this.checkBound(_pos);
        this._selectCard.x = pos.x;
        this._selectCard.y = pos.y;
        this._selectPos = -1;
        // 高亮地图上的图标
        for (var i = 0; i < this._touchArr.length; i++) {
            var _tNode = this._touchArr[i];
            if (_tNode.active) {
                var box = _tNode.getBoundingBox();
                var p = this._touchNode.convertToNodeSpaceAR(_pos);
                if (box.contains(p)) {
                    _tNode.sp1.active = false;
                    _tNode.sp2.active = true;
                    this._selectPos = i ;
                }else{
                    _tNode.sp1.active = true;
                    _tNode.sp2.active = false;
                };
            };
        };
    },
    // 更新战斗UI的显示
    updateUI:function  () {
        // for (var i = 0; i < 4; i++) {
            
        // };
        cc.loader.loadRes("texture/home/"+db.res,cc.SpriteFrame, function(err, spriteFrame){
            if (err) {
                cc.log("load png error:" + db.res + "error:"+ err);
                return;
            }
            self._BuildIconSp.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    // 更新游戏状态
    updateGameState:function (state) {
        if (state = SG.Fight.gameStep.ready) {
            this._timeLab.active = true;
        }else{
            this._timeLab.active = false;
        };
    },
    update(dt){
        if (!this._controler) {
            return;
        };
        var _t = this._controler.logic.getWaitTime();
        if (_t > 0 ) {
            var _time = Math.round(_t/GAME_FRAME_RATE);
            this._timeLab.getComponent(cc.Label).string = _time;
        };
    },
});
