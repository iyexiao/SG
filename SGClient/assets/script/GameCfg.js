/*
 Author: YeXiao
 Date: 2018-05-01
 Info:游戏配置数据
*/
window.SERVICE_DUMMY = false; //是否是服务器纯跑逻辑
window.GAME_FRAME_RATE = 30;
//全局的事件
if (SERVICE_DUMMY) {
	G_EVENT = {};
}else{
	window.G_EVENT = new cc.EventTarget();
};