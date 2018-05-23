/*
 Author: YeXiao
 Date: 2018-05-22
 Info:战斗攻击包选择类
*/
var AttackChooseType = {
	//获取技能应该达到的人
	getSkillCanAttackPos : function (hero,skill,campArr) {
		if (!skill._data.filter) {
			SG.LogsControler.echoError("有攻击技能就必须有选敌ai",skill.sid);
			return
		};
		var posIdxArr = [];
		var _cfg = SG.GameData.getConfigName();
		var fData = SG.GameData.getConfigByNameId(_cfg.Filter,skill._data.filter);
		// 此处先随机选一个敌方角色
		var targetObj = SG.BattleRandom.getRandomInArr(campArr);
		posIdxArr.push(targetObj);
		// // 如果有选敌距离、则先选敌，若没有选出敌人，并且要有命中(此时攻击衰减50%)
		// if (fData.atkdis) {
		// 	for (var key in campArr) {
				
		// 	};
		// };
		return posIdxArr;
	}
}
module.exports = AttackChooseType;
