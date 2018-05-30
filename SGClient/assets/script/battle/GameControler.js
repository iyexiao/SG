/*
 Author: YeXiao
 Date: 2018-05-01
 Info:战斗游戏控制器
*/

var GameControler = function (battleInfo) {
	var _battleInfo = battleInfo;
	var _handCardArr=[[],[]];//双方手牌
	//双方战场上的牌
	var _campArr = [[null,null,null,null,null,null],[null,null,null,null,null,null]];
	var _diedArr = [[],[]];//双方战场上死亡的牌
	var _cacheArr = [[],[]];//双方准备上阵的牌
	var _gameStep = SG.Fight.gameStep.wait; //游戏状态
	var _callFuncArr = [];//回调队列
	var _callFuncArrCache = [];//回调队列缓存
	var _isCallFuncing = false;//是否在进行队列遍历
	var _atkModelArr = [];//战斗中的攻击序列
	this.frame = 0;//帧序列数[自增，用于记录当前执行到的步骤]
	this.state = SG.Fight.battleState.none; //一开始是战斗空闲状态
	this.levelInfo = new SG.LevelInfo(battleInfo,this);
	this.server = new SG.BattleServer(this);
	this.handle = new SG.HandleControler(this);
	this.logic = new SG.LogicControler(this);
	// 开始战斗
	this.enterBattle = function () {
		if (_battleInfo.gameMode == SG.Fight.gameMode.pve) {
			// 开始战斗
		}else if(_battleInfo.gameMode == SG.Fight.gameMode.pvp){

		};

		// 初始化两边手牌
		for (var i = 0; i <= 1; i++) {
			for (var j = 0; j < 4; j++) {
				this.updateHandCardArrByCamp(i);
			};
		};
		this.server.sendLoadResComplete({uId:this.levelInfo.getUserId()});
	};
	//更新手牌
	this.updateHandCardArrByCamp = function (camp,oldId) {
		var cardArr = this.levelInfo.getCardArr(camp);
		var hCardArr = _handCardArr[camp];
		//不会随机手牌上有的英雄
		var tmpArr = [];
		for (var i = 0; i < cardArr.length; i++) {
			var isHave = false;
			for (var j = 0; j < hCardArr.length; j++) {
				if (cardArr[i]._data.hId == hCardArr[j]._data.hId) {
					isHave = true;
					break;
				};
			};
			if (!isHave) {
				tmpArr.push(cardArr[i]);
			};
		};
		var heroObj = SG.BattleRandom.getRandomInArr(tmpArr);
		if (oldId) {
			for (var i = 0; i < hCardArr.length; i++) {
				if (hCardArr[i]._data.hId == oldId) {
					// 旧手牌移除、然后记录位置，更新新的手牌;
					SG.SGArray.insert(hCardArr,i,heroObj);
					break;
				};
			};
		}else{
			hCardArr.push(heroObj);
		};
	}
	// 准备开始战斗
	this.enterBattleReady = function (hInfo) {
		this.updateGameState(SG.Fight.gameStep.ready);
		this.updateBattleState(SG.Fight.battleState.ready);
		if (!SERVICE_DUMMY) {
			if (SG.BattleControler.checkIsPve()) {
				this.logic.doPickUpHeroOnReady();
			};
			G_EVENT.emit(SG.SGEvent.BATTLE_ENTER,this);
		};
	};
	// 根据阵营获取手牌
	this.getHandCardArrByCamp=function (camp) {
		return _handCardArr[camp];
	};
	// 获取阵营上有角色数组
	this.getHeroCampArr = function (camp) {
		var cArr = _campArr[camp];
		var tmpArr = [];
		for (var i = 0; i < _campArr[camp].length; i++) {
			var heroModel = _campArr[camp][i];
			if (heroModel) {
				tmpArr.push(heroModel)
			};
		};
		return tmpArr;
	}
	// 获取阵营战场上可上牌的位置(排除破路的位置TODO)
	this.getEmptyPosByCamp = function (camp) {
		var cArr = _campArr[camp];
		var tmpArr = [];
		for (var i = 0; i < _campArr[camp].length; i++) {
			if (!_campArr[camp][i]) {
				tmpArr.push(i)
			};
		};
		return tmpArr;
	};
	// 根据阵营和位置获取对应的英雄
	this.getHeroByCampPos = function (camp,pos) {
		return _campArr[camp][pos];
	}
	// 上阵一个英雄
	this.upOneHero = function (hInfo) {
		this.updateHandCardArrByCamp(hInfo.c,hInfo.h);
		var heroInfo = this.levelInfo.cloneOneHeroInfo(hInfo.c,hInfo.h);
		var exData = {hId:hInfo.h ,posIdx:hInfo.p ,camp:hInfo.c};
		var modelHero = new SG.ModelHero(heroInfo,exData,this);
		SG.SGArray.insert(_campArr[hInfo.c],hInfo.p,modelHero);
		if (!SERVICE_DUMMY) {
			G_EVENT.emit(SG.SGEvent.BATTLE_UP_HERO,modelHero);
		};
	};
	// 攻击序列排序
	this.sortSkill = function (tmpArr) {
		if (!tmpArr) {
			tmpArr =[];
			for (var i = 0; i < _campArr.length; i++) {
				for (var j = 0; j < _campArr[i].length; j++) {
					var modelHero = _campArr[i][j];
					if (modelHero) {
						tmpArr.push(modelHero);
					};
				};
			};
		};
		// 按照攻速排序
		tmpArr.sort(function (a,b) {
			var a1 = a.getBattleDataByKey(SG.Fight.battleKey.atkSpeed);
			var a2 = b.getBattleDataByKey(SG.Fight.battleKey.atkSpeed);
			return a1 - a2;
		})
		_atkModelArr = tmpArr;
	};
	// 当刚上阵一个角色的时候，需要修改这个攻击序列
	// 每上阵一个人、死亡一个人、减攻速的buff
	// 做一次排序,然后赋值给攻击序列
	this.updateAtkModel = function () {
		var tmpArr = _atkModelArr;
		this.sortSkill(tmpArr);
	}
	// 获取应该上去攻击的角色
	this.getAttackHeroModel = function () {
		if (_atkModelArr.length == 0) {
			//当攻击序列结束时候，重新获取攻击序列(这样保证没人都攻击一次才会开始新回合)
			SG.LogsControler.echo("重新开始一回合攻击序列");
			this.sortSkill();
		};
		var atkHeroModel = _atkModelArr[0];
		SG.SGArray.remove(_atkModelArr,0);
		return atkHeroModel;
	}
	// 获取战场上序列
	this.getCampArr = function () {
		return _campArr;
	};
	//获取死亡序列
	this.getDiedArr = function () {
		return _diedArr;
	}
	// 真正开始战斗
	this.startRealBattle = function () {
		this.updateBattleState(SG.Fight.battleState.battle);
		this.logic.doFightAi();
	}
	this.onExitBattle = function () {
		// SG.LogsControler.echo("退出战斗:发事件让UI处理");
		if (!SERVICE_DUMMY) {
			// 发事件让UI处理
		};
		delete this;
	};
	// 获取游戏状态
	this.getGameState = function () {
		return _gameStep;
	};
	this.updateGameState = function (_newState) {
		if (_gameStep == _newState) {
			return
		};
		_gameStep = _newState;
		this.logic.updateWaitTime(_gameStep);
		if (!SERVICE_DUMMY) {
			G_EVENT.emit(SG.SGEvent.BATTLE_STATE_CHANGE);
		};
	};

	// 真正的更新循环
	this.runBySpeedUpdate=function (dt) {
		// SG.LogsControler.echo("按照速率刷新游戏",dt);
		// 只有战斗状态的时候，frame才会刷新，否则都是在执行无效的frame
		if (this.state == SG.Fight.battleState.battle ||
			this.state == SG.Fight.battleState.ready) {
			this.frame += 1;
		};
		this.updateCallFunc()
		this.logic.updateFrame();

	};
	this.updateBattleState= function (state) {
		if (this.state != state) {
			this.state = state;
		};
	}
	// 根据枚举获取对应的对象
	this._getFuncByType = function (funcType) {
		var result = null;
		switch (funcType){
			case SG.Fight.callFuncType.gameControl:
				result = this;
				break
			case SG.Fight.callFuncType.logic:
				result = this.logic;
				break;
			default:
		}
		return result;
	};
	// 检查回调
	this.updateCallFunc = function () {
		_isCallFuncing = true;
		for (var i = _callFuncArr.length - 1; i >= 0; i--) {
			var callInfo = _callFuncArr[i];
			if (!callInfo.isDo && callInfo.left >0) {
				callInfo.left -= 1;
				if (callInfo.left == 0) {
					SG.SGArray.remove(_callFuncArr,i);//先删除，因为可能回调里面还有回调
					var root = this._getFuncByType(callInfo.funcType);
					root[callInfo.func].call(root,callInfo.params);
				};
			};
		};
		_isCallFuncing = false;
		//将缓存的回调存入
		for (var i = 0; i < _callFuncArrCache.length; i++) {
			_callFuncArr.push(_callFuncArrCache[i]);
		};
		_callFuncArrCache = [];//清空数组
	}
	// 给定的操作时间添加某个操作序列
	// 微信小游戏不能用eval，所以需要产一个类型，通过全局调用来处理
	// 复杂情况下会有回调里面添加回调(TODO)
	this.pushOneCallFunc = function (delayFrame,funcType,func,params) {
		if (!delayFrame) {
			SG.LogsControler.echoError("pushOneCallFunc空帧数");
			return
		};
		if ( (!func) || (!funcType) ){
			SG.LogsControler.echoError("pushOneCallFunc空函数",func,funcType);
			return
		};
		if (delayFrame == 0) {
			var root = this._getFuncByType(funcType);
			root[func].call(root,params);
			return;
		};
		var info = {isDo:false,left:delayFrame,funcType:funcType,func:func,params:params};
		if (_isCallFuncing) {
			_callFuncArrCache.push(info);
		}else{
			_callFuncArr.push(info);
		}
	};
	// // 移除回调
	// this.clearOneCallFunc = function () {
	// 	// body...
	// };
	// *******带视图才会走的方法****--------
	//游戏速率(回放的时候可能需要调整速率,战斗胜利的慢动作也可以这里处理)
	var _updateSpeed = 1;
	// 设置游戏速率
	this.setGameSpeed=function (speed) {
		_updateSpeed = speed;
	};
	// 更新循环
	var _updateSpeedCount = 0;
	this.updateFrame = function (dt) {
		var lastCount = 0;
		if (_updateSpeed == 1) {
			this.runBySpeedUpdate(dt);
		}else if ( _updateSpeed < 1){
			// 判断多少帧刷新一次函数
			lastCount = Math.round(_updateSpeedCount);
			_updateSpeedCount += _updateSpeed;
			if (Math.round(_updateSpeedCount) > lastCount) {
				// 如果是达到一次计数了 那么就做一次刷新函数
				this.runBySpeedUpdate(dt);
			};
		}else{
			// 先计算需要刷新多少次
			var count = Math.floor(_updateSpeed);
			for (var i = 1; i <= count; i++) {
				this.runBySpeedUpdate(dt);
				// 如果游戏结束了，就返回
				if (_gameStep == SG.Fight.gameStep.result) {
					break;
				};
			};
			var leftCount = _updateSpeed - count;
			_updateSpeedCount += count;
			// 如果不是整数倍数加速
			if (leftCount > 0) {
				lastCount = Math.round(_updateSpeedCount);
				_updateSpeedCount += leftCount;
				// 如果四舍五入后达到一次计数了 那么就做一次刷新函数
				if (Math.round(_updateSpeedCount) > lastCount) {
					this.runBySpeedUpdate(dt);
				};
			};
		};
	};
	// 开始游戏的循环体
	var _updateDt = 0;//游戏刷新帧率
	this.startLoop = function (dt) {
		_updateDt += dt;
		var _frame = SG.Fight.gameFrame
		if (_updateDt > _frame){
			var loop = Math.floor(_updateDt/_frame);
			for (var i = 1; i <= loop; i++) {
				this.updateFrame(_frame)
			};
			_updateDt -= _frame * loop;
		}
		// SG.LogsControler.echo("这里做帧数的相关处理",dt);
	};
};
module.exports = GameControler;