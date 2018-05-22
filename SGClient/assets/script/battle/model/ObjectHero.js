/*
 Author: YeXiao
 Date: 2018-05-01
 Info:战斗内英雄基本信息
*/
var ObjectHero = function (data) {
	var __sta = {};//角色基础属性
	var __init = {};//战斗基础属性
	this._data = data;//原始数据
	this._initCfg = function  () {
		var cfg = SG.GameData.getConfigName();
		var normalData = null;
		if (this._data.isRobot) {
			normalData = SG.GameData.getConfigByNameId(cfg.Enemyinfo,this._data.hId);
		}else{
			normalData = SG.GameData.getConfigByNameId(cfg.Hero,this._data.hId);
			for (var key in this._data.uData) {
				normalData[key] = this._data.uData[key];
			};
		};
		for(var key in normalData){
			__sta[key] = normalData[key];
		}
		__init = {}
		var cfgData = SG.GameData.getConfigByName(cfg.Attr);
		for(var key in cfgData){
			var keyStr = cfgData[key].key
			// 这里计算玩家的初始基础属性TODO
			if (__sta[keyStr]) {
				__init[keyStr] = __sta[keyStr];
			}else{
				__init[keyStr] = 100;//对应的属性值
			};
		}
	};
	// 获取基础属性
	this.getStaCfg = function () {
		return __sta;
	};
	// 获取战斗基础属性
	this.getInitCfg = function () {
		return __init;
	}
	
	this._initCfg();
}

module.exports = ObjectHero;