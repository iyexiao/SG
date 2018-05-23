var ModelHero = function (data,exData,controler) {
	var self = this;
	SG.ModelBasic.call(this,data,exData,controler);
	// this.printInfo = function() {
	// 	var date = new Date();
	// 	console.log("ModelHero=Info name:",self._data," createTime:",date);
	// }
	this.printLog = function() {
		var date = new Date();
		console.log("Log name:",self._data," createTime:",date);
	};
	// 攻击结束后做身上buff减少(增加或者减少)
	this.updateBuffCount = function (isAdd) {
		// TODO
		if (!SERVICE_DUMMY) {
			G_EVENT.emit(SG.SGEvent.BATTLE_BUFF_UPDATE,this);
		};
	}
	// 开始做攻击
	this.doAttack = function () {
		if (!this.checkCanAttack()) {
			// 直接就是攻击结束、然后再返回的时候再做相关的检查
			return 0
		};
		var skill = this.getCurrentSkill();
		var tmpArr = {sType:SG.Fight.battleTrigger.atkStart,atker:this,skill:skill}
		this.controler.logic.doBattleTriggerFunc(tmpArr);//攻击触发前
		// 获取攻击对象
		var camp = this.camp == SG.Fight.camp_1 ? SG.Fight.camp_2 : SG.Fight.camp_1;
		var campArr = this.controler.getHeroCampArr(camp);
		var targetArr  = SG.AttackChooseType.getSkillCanAttackPos(this,skill,campArr);
		// 攻击对象承受伤害
		var cfg = SG.GameData.getConfigName();
		if (!skill._data.atk) {
			SG.LogsControler.echoError("改技能没有攻击包",skill.sid);
		};
		var atkData = SG.GameData.getConfigByNameId(cfg.Attack,skill._data.atk);
		this.doRealAttack(targetArr,atkData,skill);
		return skill.getSkillFrame();
	};
	// 真正的执行攻击
	this.doRealAttack = function (chooseArr,atkData,skill) {
		for (var key in chooseArr) {
			var targetModel = chooseArr[key];
			// SG.LogsControler.dump(targetModel._data,"what???");
		SG.LogsControler.echo(this.camp,"阵营",this.posIdx,"位置的",this.hId,"角色",
			"使用",skill.sid,"技能","攻击 ",targetModel.camp,"阵营的",
			targetModel.posIdx,"位置",targetModel.hId,"玩家");
		};
	}
}

module.exports = ModelHero;