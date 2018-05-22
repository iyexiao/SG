/*
 Author: YeXiao
 Date: 2018-05-01
 Info:公共的Array类
*/

var SGArray = {
	// 是否是数组类型
	isArray:function(o){
		var _t = Object.prototype.toString.call(o);
		return (_t =='[object Array]');
	},
	// 是否是对象类型
	isObject:function(o){
		var _t = Object.prototype.toString.call(o);
		return (_t =='[object Object]');
	},
	// 去重
	dedupe:function(array) {
	  return [...new Set(array)];
	},
	// 替换数组内index的值，默认会删除当前index位置的元素
	insert:function (array,index,item,count) {
		var c = count || 1
		array.splice(index, c, item);
	},
	// 移除数组里面的元素
	remove:function (array,index) {
		array.splice(index,1);
	},
	// 深拷贝
	deepCopy:function (obj) {
		var result;
		if(this.isObject(obj)){
		    result={};
		}else if(this.isArray(obj)){
		    result=[];
		}else{
		    return obj;
		}
		for(var key in obj){
		   var copy=obj[key];
		   if(this.isObject(obj)){
		       result[key]=this.deepCopy(copy);//this.arguments.callee(copy);//递归调用
		    }else if(this.isArray(obj)){
		       result[key]=this.deepCopy(copy);
		    }else{
		        result[key]=obj[key];
		    }
		}
		return result;
	}
};


module.exports = SGArray;