/*
 Author: YeXiao
 Date: 2018-05-01
 Info:战斗随机种子
*/

var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

var _ranArr = [];
var _seed;
var BattleRandom = {
	// 这个必须一开始调用，否则随机种子不一样会很麻烦
	setRandomSeed:function(seed) {
		_seed = seed;
		_ranArr = [];
	},
	// 获取一个随机种子
	getNext:function(){
		if (!_seed) {
			var random = Math.floor((Math.random()+Math.floor(Math.random()*9+1))*Math.pow(10,7));
			this.setRandomSeed(random);
		}
		m_z = (36969 * (m_z & 65535) * _seed + (m_z >> 16)) & mask;
		m_w = (18000 * (m_w & 65535) * _seed + (m_w >> 16)) & mask;

		var result = ((m_z << 16) + m_w) & mask;
		result /= 4294967296;
		result += 0.5;
		_ranArr.push(result); //todo:是否需要恒定精度
		return result;
	},
	// 获取一个随机数
	getOneRandom:function (index) {
		if (index) {
			return this.getCurStep(index);
		}
		return this.getNext();
	},
	// 根据步数获取其对应的随机数
	getCurStep:function(index) {
		if (index < _ranArr.length) {
			return _ranArr[index-1];
		}
		return 0;
	},
	// 在数组内获取一个值
	getRandomInArr:function (arr) {
		var ran = Math.floor(this.getNext()*arr.length+1)-1;
		return arr[ran];
	}

}

module.exports = BattleRandom;
