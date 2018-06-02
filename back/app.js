var express = require('express')();
var http = require('http').Server(express);
var io = require('socket.io')(http);
var shortId = require('shortid');

var clients = [];
var roomInfo = {};
/*
// send to current request socket client
socket.emit('message', "this is a test");
// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");
// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');
// sending to all clients, include sender
io.sockets.emit('message', "this is a test");
// sending to all clients in 'game' room(channel), include sender
io.sockets.in('game').emit('message', 'cool game');
*/
io.on('connection', function (socket) {
	// 如: http://localhost:1234/battle/room_1, roomId为room_1
	var url = socket.request.headers.referer;
	var splited = url.split('/');
	var roomId = splited[splited.length - 1];   // 获取房间ID
	console.log("one connect 。。。")
	var currClient;
	// 开始连接战斗服
	socket.on('init', function (data) {
		currClient ={
            id: shortId.generate(),
        };
        // TODO:这个数据应该是去gameServer取战斗数据
        var battleInfo = data.battleInfo;
        // 房间不存在则创建房间
        if (!roomInfo[roomId]) {
        	// 初始化房间、存储battleInfo，operations 为了断线重连
        	roomInfo[roomId] = {users:[],battleInfo:battleInfo,operations:[],ready:[]};
        };
        roomInfo[roomId].push(currClient);
        socket.join(roomId);
	});
	// 战斗加载资源完成,等待双方都加载完成然后推送进入战斗阶段(切换战斗服状态机)
	socket.on('resComplete',function () {
        // socket.emit('resComplete', {});
        // 如果两人都加载资源完成，则需要广播进入战斗状态
        if (roomInfo[roomId].ready.length == 2) {
		    socket.broadcast.to(roomId).emit('battleStart',{});
        };
	})
	// 断开
	socket.on('disconnect', function (){
		//从房间中移除
		var index = roomInfo[roomId].indexof(currClient)
		if (index != -1) {
			roomInfo[roomId].splice(index, 1);
			//TODO: 此处判定房间还有人么，没人，则启动计时器销毁房间
		};
	});
	// 操作序列,负责分发
	socket.on('handle',function (handleInfo) {
		// 验证如果用户不在房间内则不给发送
	    if (roomInfo[roomId].indexOf(currClient) === -1) {  
	      return false;
	    }
	    // 将操作序列存储
	    roomInfo[roomId].operations.push(handleInfo);
	    // 广播消息
	    socket.broadcast.to(roomId).emit('operation',handleInfo);
	})
});
http.listen(3000,function () {
	console.log("Start Server Success! listen on port 3000 ...");
})

