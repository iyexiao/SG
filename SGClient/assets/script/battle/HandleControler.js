/*
 Author: YeXiao
 Date: 2018-05-29
 Info:战斗操作控制器
*/
var HandleControler = function (controler) {
	var _controler = controler;
	var _handleArr = []; //存储网络回来的操作数(已经去重的)
	// 该数据用于排重，因为服务器不会排重前端发的消息，只会转发
	var _doHandleMap = {};//已经执行过的(或者存储过)操作数
	var _currentHandleIdx = -1; //当前操作的idx
	var _cacheHandleIdx = -1; //缓存的操作idx
	// 网络收到操作
	this.receiveOneHandle = function (handleInfo) {
		if (handleInfo.idx <= _cacheHandleIdx) {
			SG.LogsControler.echo("这个是以前的操作",handleInfo.idx);
			return
		};
		if (_handleArr[handleInfo.idx]) {
			SG.LogsControler.echo("操作序列已经存在了",handleInfo.idx);
			return
		};
		_handleArr[handleInfo.idx] = handleInfo;//存储操作序列
		if (handleInfo.idx > _cacheHandleIdx + 1 && handleInfo.idx > _currentHandleIdx +1 ) {
			SG.LogsControler.echo("操作序列跳过，TODO：需要请求操作序列或者追进度",handleInfo.idx);
			this.checkNeedQuickOrGet(handleInfo.idx);
			return
		};
		_cacheHandleIdx = handleInfo.idx;
		if (handleInfo.idx == _currentHandleIdx + 1) {
			this.onReceive(handleInfo);
		}else{
			SG.LogsControler.echo("操作落后了",handleInfo.idx);
			this.checkNeedQuickOrGet(handleInfo.idx);
		};
	};
	// 执行网络操作
	this.onReceive = function (handleInfo) {
		if (!handleInfo.tag) {
			handleInfo.tag = handleInfo.frame + "+" + handleInfo.info;
		};
		if (_doHandleMap[handleInfo.tag]) {
			SG.LogsControler.echo("这个操作处理过了",handleInfo.tag);
			_currentHandleIdx += 1;
			return
		};
		// if (handleInfo.frame < _controler.frame) {
		// 	SG.LogsControler.echo("这个操作过时了",handleInfo.tag);
		// 	_currentHandleIdx += 1;
		// 	return
		// };
		_currentHandleIdx += 1;
		_doHandleMap[handleInfo.tag] = true;
		//TODO：加速器校验
		// 执行一条操作
		_controler.logic.doOneHandler(handleInfo);
	};
	this.checkNeedQuickOrGet = function (idx) {
		// TODO:判断是追进度还是请求序列
		var tmpIdx = idx - _currentHandleIdx;
		if (tmpIdx > 0 ) {
			for (var i = 0; i < tmpIdx; i++) {
				if (!_handleArr[_currentHandleIdx + i]) {
					// 请求进度
					return
				};
			};
			// 不在追进度状态就追进度
			// if (!_controler.checkIsInProgress()) {
			// 	_controler.runGameToTarget();
			// };
		};
	}
};
module.exports = HandleControler;