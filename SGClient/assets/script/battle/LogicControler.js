/*
 Author: YeXiao
 Date: 2018-05-01
 Info:战斗逻辑控制器
*/
var LogicControler = function (controler) {
	const HandleType = SG.Fight.HandleType;
	var _controler = controler;
	var _handMap = {};
	this.onReceive = function (args) {
		// 执行一条操作
		this.doOneHandler(args);
	};
	this.doOneHandler = function (hInfo) {
		switch(hInfo.t){
			case HandleType.upHero:
				_controler.upOneHero(hInfo);
				break;
			case HandleType.resCmpl:
				_controler.enterBattleReady(hInfo);
				break;
			default:
			SG.LogsControler.echoError("错误的操作类型",hInfo.t);
		}
	};
	// 打机器人的时候在准备阶段上阵电脑方英雄
	this.doPickUpHeroOnReady = function  () {
		for (var i = 0; i < 3; i++) {
			var _frame = (i + 1)*2*GAME_FRAME_RATE;//两秒上阵一个伙伴
			_controler.pushOneCallFunc(_frame,SG.Fight.callFuncType.logic,
				"upOneHeroAi",SG.Fight.camp_2);
		};
	};
	// 上阵一个伙伴的ai
	this.upOneHeroAi = function (camp) {
		var heroArr = _controler.getHandCardArrByCamp(camp);
		var posArr = _controler.getEmptyPosByCamp(camp);
		var heroObj = SG.BattleRandom.getRandomInArr(heroArr);
        var staDB = heroObj.getStaCfg();
		var pos = SG.BattleRandom.getRandomInArr(posArr);
        _controler.server.sendUpHero({h:staDB.id,p:pos,c:camp});
	};
	// 做攻击序列ai
	this.doFightAi = function () {
		var fightHero = _controler.getAttackHeroModel();//获取将要攻击的人
		var _frame = fightHero.doAttack();
		var skill = fightHero.getCurrentSkill();
		_controler.pushOneCallFunc(_frame,SG.Fight.callFuncType.logic,
			"onAttackComplete",{heroModel:fightHero,skill:skill});
		cc.log("角色上去攻击",fightHero.camp,fightHero.posIdx,fightHero.hId);
		if (!SERVICE_DUMMY) {
			G_EVENT.emit(SG.SGEvent.BATTLE_HERO_ATTACK,{heroModel:fightHero});
		};
	};
	// 攻击结束
	this.onAttackComplete = function (params) {
		// 身上buff计数 -1
		params.heroModel.updateBuffCount(false);
		params.heroModel.resetCurrentSkill();

		var tmpArr = {	sType:SG.Fight.battleTrigger.atkEnd,
						atker:params.heroModel,
						skill:params.skill}
		this.doBattleTriggerFunc(tmpArr);//攻击触发前

		this.doFightAi();
	}
	// 执行某个时机行为，触发事件
	// {sType:触发类型，atker:攻击者,skill:释放的技能}
	this.doBattleTriggerFunc = function (params) {
		var campArr = _controler.getCampArr();
		var diedArr = _controler.getDiedArr();
		for (var i = 0; i < campArr.length; i++) {
			var modelArr = campArr[i];
			for (var j = 0; j < modelArr.length; j++) {
				var modelHero = modelArr[j]
				if (modelHero) {
					modelHero.checkSkillExpendTrigger(params);
				};
			};
		};
	}

	// *******  带视图才会走的方法   ****--------
	// 倒计时等待时间
	var _waitTime = -1;
	this.updateWaitTime = function (_gameStep) {
		if (_gameStep == SG.Fight.gameStep.ready) {
			_waitTime = SG.Fight.waitFrame.ready;
		};	
	};
	this.getWaitTime = function () {
		return _waitTime;
	};
	this.updateFrame = function(){
		if (_waitTime > 0 ) {
			_waitTime -= 1;
			if (_waitTime == 0) {
				_waitTime = -1;
				var _gameStep = _controler.getGameState()
				if (_gameStep == SG.Fight.gameStep.ready) {
					//此时上阵的角色开始攻击
					_controler.updateGameState(SG.Fight.gameStep.battle);
					_controler.startRealBattle();
				};
			};
		};
	}
};
module.exports = LogicControler;