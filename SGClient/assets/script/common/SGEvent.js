/*
 Author: YeXiao
 Date: 2018-05-01
 Info:事件分发处理
*/

var SGEvent = {};
SGEvent.BATTLE_ENTER = "BATTLE_ENTER"; //进入战斗
// SGEvent.HAND_CARD_UPDATE = "HAND_CARD_UPDATE"; //手牌更新
SGEvent.BATTLE_UP_HERO = "BATTLE_UP_HERO";//上阵一个英雄
SGEvent.BATTLE_STATE_CHANGE = "BATTLE_STATE_CHANGE";// 游戏状态更新
SGEvent.BATTLE_BUFF_UPDATE = "BATTLE_BUFF_UPDATE";//角色身上刷新
SGEvent.BATTLE_HERO_ATTACK = "BATTLE_HERO_ATTACK";//英雄开始攻击

SGEvent.BATTLE_INIT = "BATTLE_INIT"; //场景初始化完成

module.exports = SGEvent;