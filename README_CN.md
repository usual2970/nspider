# nspider

[![npm package](https://nodei.co/npm/nspider22.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nspider22/)


node版的轻量级爬虫框架

特性:

 * 在服务端进行dom处理，默认使用的jquery语法
 * 请求控制
 * 优先请求队列
 * 兼容node4.x或更高版本

# 快速开始

## 如何安装

	$ npm install nspider22

## 使用示例

```
var nspider=require('nspider22')

var nsp=new nspider({name:'baidu'});
nsp.onHtml('a',function(ele){
	console.log(ele.$.attr('href'));
})

nsp.visit("http://www.baidu.com");
```

# todolist

 * 处理复杂的ajax请求
 * 重构代码
 * 命令支持
 * 中间件支持


