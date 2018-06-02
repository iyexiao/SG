var ws = require("nodejs-websocket");
var shortId = require('shortid');
// 连接类型
var MsgType = {
	init:0,//初始化连接
	resComplete:1,//资源加载完成
	handle:2,//战斗操作序列
}
var NotifyType = {
	roomComplete:0,//初始化房间完成
	startBattle:1,//开始战斗广播
	handle:2,//双方操作广播
}
var HandleType = {
	resCmpl:1,//资源加载完成(开始进入战斗)
	upHero:2,//上阵一个伙伴
	heroAtk:3,//角色上去攻击
};
var clients = [];
var roomInfo = {};

var server = ws.createServer(function (conn) {
	console.log("one connect 。。。")
	var roomId
	// 接收消息
    conn.on("text", function (str) {
    	var tmpArr = JSON.parse(str);
    	switch(tmpArr.t){
    		case MsgType.init:
			    roomId = tmpArr.battleInfo.battleId;
    			checkEnterRoom(roomId,tmpArr,conn);
	    		break
    		case MsgType.resComplete:
	    		checkAllReady(roomId);
	    		break
    		case MsgType.handle:
	    		broadcastHandle(roomId,tmpArr.info);
	    		break
    		default:
    			console.log("错误的类型数据");
    	}
    	// var result = {rt:1,t:tmpArr.t}
     //    conn.sendText(JSON.stringify(result));//回调参数
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(3000);
// 初始化房间数据
function checkEnterRoom (roomId,args,conn) {
	var currClient ={id: shortId.generate(),conn:conn};
    // TODO:这个数据应该是去gameServer取战斗数据
    var battleInfo = args.battleInfo;
    // 房间不存在则创建房间
    if (!roomInfo[roomId]) {
    	// 初始化房间、存储battleInfo，operations 为了断线重连
    	roomInfo[roomId] = {users:[],battleInfo:battleInfo,operations:[],ready:0};
    };
    roomInfo[roomId].users.push(currClient);
	var result = {t:NotifyType.roomComplete,info:""};//发送房间初始化完成
	conn.sendText(JSON.stringify(result));
}
// 检查是否都准备好了
function checkAllReady (roomId) {

	var room = roomInfo[roomId];
	if (!room) {
		console.log("房间已经不存在");
		return
	};
	//TODO:这里应该判定两人都准备好才能开战
	room.ready += 1;
	if (room.ready >= 1) {
		for (var i = 0; i < room.users.length; i++) {
			var user = room.users[i];
			var info = {t:HandleType.resCmpl,idx:0}
			//发送资源加载完成,开始战斗
			var result = {t:NotifyType.startBattle,info:info};
			user.conn.sendText(JSON.stringify(result));
		};
	};
}
// 广播操作
function broadcastHandle (roomId,handleInfo) {
	var room = roomInfo[roomId];
	if (!room) {
		console.log("房间已经不存在");
	};
	room.operations.push(handleInfo);//将操作存储，用于断线重连
	// 重新获取长度
	handleInfo.idx = room.operations.length;
	for (var i = 0; i < room.users.length; i++) {
		var user = room.users[i];
		var result = {t:NotifyType.handle,info:handleInfo};//发送的是操作序列,handleInfo原封不动返回
		user.conn.sendText(JSON.stringify(result));//开始战斗
	};
}
	// server.connections.forEach(function(connection) {
 //        connection.sendText(str);
 //    })
console.log("start server successed! listen 3000 。。。")