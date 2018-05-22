/*
 Author: YeXiao
 Date: 2018-05-01
 Info:战斗控制器
*/

var BattleControler = {
	gameControler:null,
	battleInfo:null,
	// 开始战斗
	startBattleInfo:function(battleInfo) {
		this.resetBatttle();
		this.battleInfo = battleInfo;
		SG.BattleRandom.setRandomSeed(battleInfo.randoomSeed);//设置随机种子
		this.gameControler = new SG.GameControler(battleInfo);
		this.gameControler.enterBattle();
	},
	// 重置战斗数据
	resetBatttle:function(){
	},
	exitBattle:function () {
		if (this.gameControler) {
			this.gameControler.onExitBattle();
			this.gameControler = null;
		};
	},
	// 检查是否是单人战斗
	checkIsPve:function () {
		if (this.battleInfo.gameMode == SG.Fight.gameMode.pve) {
			return true;
		}
		return false;
	},
};
module.exports = BattleControler;