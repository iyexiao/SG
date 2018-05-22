/*
 Author: YeXiao
 Date: 2018-05-20
 Info:战斗技能类
*/
var ObjectSkill = function (sid,heroModel) {
	this.sid = sid;
	this._heroModel = heroModel;
	this._data = null;
	this._skillExpend = null;//额外的技能脚本
	this._initCfg = function  () {
		var cfg = SG.GameData.getConfigName();
		this._data = SG.GameData.getConfigByNameId(cfg.Skill,this.sid);

		if(this._data.extScript){
			this._skillExpend = new SG[this._data.extScript](this._data.extInfo);
		}
	};
	// 技能做额外判定处理
	this.doExpandTrigger = function (params) {
		if(!this._skillExpend){
			return;
		}
		switch(params.sType){
			case Fight.battleTrigger.atkStart:
				this._skillExpend.onHeroAttackStart(this._heroModel,params.atker,params.skill);
				break;
		}
	};
	// 获取技能帧长度
	this.getSkillFrame = function(){
		return this._data.frame;
	}
	this._initCfg();
}
module.exports = ObjectSkill;