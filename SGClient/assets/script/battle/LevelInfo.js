/*
 Author: YeXiao
 Date: 2018-05-01
 Info:战斗游戏关卡逻辑
*/

var _battleInfo = null;
var _cardArr = [[],[]];//可选手牌集合
var _myCamp = null;
var _controler = null;

var LevelInfo = function (battleInfo,controler) {
	_battleInfo = battleInfo;
	_controler = controler;
	function _createOneHeroInfo(camp,data,isRobot) {
		var heroObj = null;
		var hId = null;
		if (isRobot) {
			hId = data;
			heroObj = new SG.ObjectHero({camp:camp,hId:hId,isRobot:isRobot})
		}else{
			hId = data.id;
			heroObj = new SG.ObjectHero({camp:camp,hId:hId,uData:data})
		};
		_cardArr[camp].push(heroObj);
	};
	// 初始化双方卡牌数组
	function _initHeroCard() {
		for(var key in _battleInfo.user){
			var user = _battleInfo.user[key]
			if (user.uType ==  SG.Fight.userType.robot){
				var cfg = SG.GameData.getConfigName();
				var robotData = SG.GameData.getConfigByNameId(cfg.Robot,user.uId);
				for (var i = 0; i < robotData.heroArr.length; i++) {
					_createOneHeroInfo(user.camp,robotData.heroArr[i],true);
				};
			}else{
				for(var heroInfo in user.heroArr){
					_createOneHeroInfo(user.camp,user.heroArr[heroInfo]);
				}
				if (_battleInfo.uId == user.uId) {
					_myCamp = user.camp;
				}
			}
		}
	};
	// 获取某一阵营的选卡组
	this.getCardArr = function (camp) {
		return _cardArr[camp];
	};
	// 根据阵营id获取对应的战斗卡牌
	this.cloneOneHeroInfo = function (camp,id) {
		var _heroArr = _cardArr[camp]
		for (var k in _heroArr) {
			var heroObj = _heroArr[k]
			if (heroObj._data.hId == id) {
				return SG.SGArray.deepCopy(heroObj);
			};
		};
	};
	// 获取我方阵营
	this.getMyCamp = function () {
		return _myCamp;
	};
	this.getUserId = function () {
		return _battleInfo.uId;
	};
	_initHeroCard();
};
module.exports = LevelInfo;