/*
 Author: YeXiao
 Date: 2018-05-04
 Info: 用户角色数据
*/
var _testData = {
		battleInfo:{
			battleId:100,
			randoomSeed:52695097,
			// gameMode:1,//单人
			gameMode:2,//多人
			uId:1001,
			user:[
				{uId:1001,uType:1,camp:0,heroArr:[
						{id:1,lv:1,star:1,quality:1},{id:2,lv:1,star:1,quality:1},
						{id:3,lv:1,star:1,quality:1},{id:4,lv:1,star:1,quality:1},
						{id:5,lv:1,star:1,quality:1},{id:6,lv:1,star:1,quality:1},
						{id:8,lv:1,star:1,quality:1},{id:7,lv:1,star:1,quality:1},
						{id:9,lv:1,star:1,quality:1},{id:10,lv:1,star:1,quality:1},
					]
				},
				{uId:1,uType:2,camp:1,},
			],
		},
	};
var UserModel = {
	_isLogin:false,
	_uId : 1001,
	// 更新数据
	update:function () {
		// argument
	},
	getBattleInfo:function () {
		if (!this._isLogin) {
			return _testData.battleInfo;
		};
	},
	getUserId:function () {
		return this._uId;
	}
};
module.exports = UserModel;