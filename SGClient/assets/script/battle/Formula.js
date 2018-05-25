/*
 Author: YeXiao
 Date: 2018-05-25
 Info:战斗攻击包伤害计算公式
*/
var Formula = {
	//获取伤害计算
	getSkilDamage : function (atker,defer,skill) {
		var dmgInfo = {};
		dmgInfo.damage = 10;
		dmgInfo.isCrit = false;//是否暴击
		dmgInfo.isHit = true;//是否命中
		dmgInfo.isKilled = false;//是否击杀
		return dmgInfo;
	}
}
module.exports = Formula;
