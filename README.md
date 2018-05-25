
一个基于三国的H5卡牌游戏
## 关于配置表excel   
### [win]  
	1.安装python   
	2.安装xlrd插件https://pypi.python.org/pypi/xlrd (进入对应目录执行python setup.py install)   
	3.安装openpyxl插件https://pypi.python.org/pypi/openpyxl   
### [win/mac]  
    3.运行python excel2json.py excel json   


## Client架构  
### 一、客户端与战斗服同一套代码  
* 1.带视图：通过BattleUpdate内的update驱动gamecontroler中的startloop。  
* 2.纯跑逻辑：通过操作序列和startloop帧数走逻辑。  


  
### 二、相关代码解读  
    BattleControler -- 战斗控制器，战斗的入口  
    GameControler -- 游戏控制器，负责游戏的调度  
    LogicControler -- 逻辑控制器，负责游戏逻辑的处理 
    StaControl -- 战斗统计    
    Formula -- 伤害公式  
    AttackChooseType -- 获取技能攻击对象     
    LevelInfo -- 关卡数据，用于创建角色等 
    Fight -- 战斗内变量、枚举等  
    BattleServer -- 战斗内与网络相关  
    BattleRandom -- 战斗随机种子、随机数获取  
    ModelBasic -- 角色基础类，Modelxxx都是其子类  
    ObjectHero -- 角色数据内容，__init、__sta等都是其属性   
### 三、对应模块区分  
* battle 文件夹内是战斗相关的  
	--model	战斗模型数据  
	--view	视图表现  
* sys 系统相关  
	--controler	系统相关控制器  
	--view	视图相关表现  
* user 用户先关数据  