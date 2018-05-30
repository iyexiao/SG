/*
 Author: YeXiao
 Date: 2018-05-01
 Info:战斗内枚举
*/

var Fight = {};
// 游戏帧率
Fight.gameFrame = 1/GAME_FRAME_RATE;
// 游戏阶段
Fight.gameStep = {
	wait : 1,
	ready : 2,
	battle : 3,
	result : 4,
};
// 游戏模式
Fight.gameMode = {
	pve:1,
	pvp:2,
};
// 玩家类型
Fight.userType = {
	user:1,
	robot:2,
};
//操作序列
Fight.HandleType = {
	resCmpl:1,//资源加载完成(开始进入战斗)
	upHero:2,//上阵一个伙伴
	heroAtk:3,//角色上去攻击
};
// 回调的类型
Fight.callFuncType = {
	gameControl:1,
	logic:2,
};
// 阵营数据(数组从下标从0开始)
Fight.camp_1 = 0;
Fight.camp_2 = 1;
// 开始阶段的倒计时等待时间
Fight.waitFrame = {
	ready:10 * GAME_FRAME_RATE,
};
// 加成方式
Fight.changePattern = {
	addSub:1,//数值
	percentage:2,//百分比
};
// 战斗数值
Fight.battleKey = {
	hp:"hp",
	phyAtk:"phyAtk",
	phydef:"phydef",
	magicAtk:"magicAtk",
	magicAtk:"magicAtk",
	crit:"crit",
	atkSpeed:"atkSpeed",
	block:"block",
};
// 技能类型
Fight.skillType = {
	small:0,//小技能
	big:1,	//大招
	passive:2,//被动(光环)
};
//战斗时机
Fight.battleTrigger = {
	atkStart:0,//我方攻击前
	atkEnd :1,//我方攻击后
	onDef:2,//受击时
	propChange:3,//属性变化时
	onDied:4,//有角色死亡时
	onKill:5,//击杀敌人时，只对击杀者
	onAddHero:6,//当添加一名英雄上场时
	onBrokRoad:7,//破路时
};
Fight.battleState = {
	none:0,//空闲状态
	ready:1,//战斗前准备
	battle:2,//战斗中
	netWait:3,//网络等待
}

module.exports = Fight;