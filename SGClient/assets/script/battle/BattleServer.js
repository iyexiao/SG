/*
 Author: YeXiao
 Date: 2018-05-01
 Info: 战斗联网类
*/

var BattleServer = function (controler) {
	const HandleType = SG.Fight.HandleType;
	var _controler = controler;
	// 资源加载完成{uid:用户id}
	this.sendLoadResComplete = function (args) {
		args.t = HandleType.resCmpl;
		this.sendOneHandle(args);
	}
	// {t:操作类型type h:上阵hid p:上阵位置pos,c:阵营camp}
	this.sendUpHero = function (args) {
		args.t = HandleType.upHero;
		this.sendOneHandle(args);
	}
	// 发送一条操作数据
	this.sendOneHandle = function (args) {
		var msg = SG.SGArray.deepCopy(args);
		msg.idx = _controler.handIdx;
		if (SG.BattleControler.checkIsPve()) {
			// 如果是单人战斗，则原封不动的返回
			_controler.logic.onReceive(msg);
		}else{

		}
	}
};
module.exports = BattleServer;