/*
 Author: YeXiao
 Date: 2018-05-01
 Info:战斗基本类
*/
var ModelBasic = function (data,exData,controler) {
	this._data = data;
	// 额外的数值
	this.posIdx = exData.posIdx;//角色位置
	this.hId = exData.hId;//角色id
	this.camp = exData.camp;//所在阵营
	this.canAttack = true;//是否可攻击
	this.controler = controler;
	//一开始上来，有大招就放大招,然后每隔两回合放一次大招
	this.currIdx = 0;
	// this.printInfo = function() {
	// 	var date = new Date();
	// 	console.log("ModelHero=Info name:",self._data," createTime:",date);
	// }
	// onDelete = function () {
	// 	delete this;
	// }

	var __bd = {};//战斗中属性
	var _skills = [null,null,null];//技能
	var _currSkill = null;
	// 初始化战斗数据
	this._initBattleCfg = function  () {
		// 这里计算玩家的战斗属性(基本等于初始属性)
		var cfgData = this._data.getInitCfg();
		for(var key in cfgData){
			__bd[key] = cfgData[key];
		}
		// 初始化技能
		var staData = this._data.getStaCfg();
		for (var i = 0; i < 3; i++) {
			var skillId = staData["skill"+i];
			if (skillId) {
				var skillObj = new SG.ObjectSkill(skillId,this);
				SG.SGArray.insert(_skills,i,skillObj);
			};
		};
	};
	// 返回战斗属性对应的值
	this.getBattleDataByKey = function (key) {
		return __bd[key];
	};
	// 遍历技能做技能的特殊触发逻辑
	this.checkSkillExpendTrigger = function (params) {
		for (var i = 0; i < _skills.length; i++) {
			var skill = _skills[i]
			if (skill) {
				skill.doExpandTrigger(params);
			};
		};
	}
	// 获取应该攻击的技能
	this.getCurrentSkill = function () {
		if (_currSkill) {
			return _currSkill;
		};
		var giveSkill = null;
		if (this.currIdx == 0 ) {
			// 释放大招
			this.currIdx = 2;
			giveSkill = _skills[SG.Fight.skillType.big];//可能某些英雄没有大招
		}else{
			this.currIdx -= 1;
		};
		if (!giveSkill) {
			giveSkill = _skills[SG.Fight.skillType.small];
		};
		_currSkill = SG.SGArray.deepCopy(giveSkill);
		return _currSkill;
	};
	// 重置技能(攻击结束以后会重置)
	this.resetCurrentSkill = function () {
		_currSkill = null;
	};
	// 玩家属性变化(key value pattern:加成方式)
	this.changeValue = function (key,value,pattern) {
		
		if (!__bd[key]) {
			SG.LogsControler.echoError("未找到战斗属性",key);
			return;
		};
		var newValue = null;

		switch(key){
			case Fight.changePattern.addSub:
				newValue = __bd[key] +  value;
				break;
			case Fight.changePattern.percentage:
				newValue = __bd[key] + Math.round(this._data.getInitCfg()[key] * value/100);
				break;
		}
		if (newValue < 0) { newValue = 0};
		__bd[key] = newValue;//重新赋值给角色战斗数值
		switch(key){
			case Fight.battleKey.hp:
				if (newValue <= 0) {
					// 英雄死亡
				};
				break
			case Fight.battleKey.atkSpeed:
				// 攻速发生变化
				break
		};
	};
	// 检查角色是否可攻击
	this.checkCanAttack = function () {
		if (!this.canAttack) {
			return false;
		};
		// 检查身上是否有不能攻击的buff；
		return true;
	}
	this._initBattleCfg();
}

module.exports = ModelBasic;