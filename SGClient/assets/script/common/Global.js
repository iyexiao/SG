// 带路径不带后缀名的文件
var _files = [
	"SGEvent",
	"battle/Fight",
	"battle/BattleRandom",
	"battle/model/ObjectSkill",
	"battle/model/ObjectHero",
	"battle/model/ModelHero",
	"battle/model/ModelBasic",
	"battle/skill/SkillAiBasic",
	"battle/LevelInfo",
	"battle/BattleControler",
	"battle/BattleServer",
	"battle/LogicControler",
	"battle/GameControler",
	"battle/AttackChooseType",
	"battle/Formula",
	"common/LogsControler",
	"common/GameData",
	"common/FuncUtil",
	"common/SGArray",
	"user/UserModel",
];
// 给全局变量定义
if (SERVICE_DUMMY) {
	SG = {}
}else{
	window.SG = {};
};
for (var i = 0; i < _files.length; i++) {
	var str = _files[i]
	var keyArr = str.split("/");
	var key = keyArr[keyArr.length-1];
	if (SERVICE_DUMMY) {
		SG[key] = require("./"+str+".js"); // 形如：require("./battle/ModelHero.js")
	}else{
		window.SG[key] = require(key);
	};
}