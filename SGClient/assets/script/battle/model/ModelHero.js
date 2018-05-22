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
		// 攻击TODO
		return skill.getSkillFrame();
	};
}

module.exports = ModelHero;