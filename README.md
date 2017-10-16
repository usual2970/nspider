# nspider

[![npm package](https://nodei.co/npm/nspider22.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nspider22/)


A lightweight crawling/scraping package for Node.

Features:

 * server-side DOM & automatic jQuery insertion with Cheerio
 * Control rate limit
 * Priority queue of requests
 * Compatible with 4.x or newer version

# Get started

## How to install

	$ npm install nspider22

## Usaget

```
var nspider=require('nspider22')

var nsp=new nspider({name:'baidu'});
nsp.onHtml('a',function(ele){
	console.log(ele.$.attr('href'));
})

nsp.visit("http://www.baidu.com");
```

# Rough todolist

 * Introducing zombie to deal with page with complex ajax
 * Refactoring the code to be more maintainable
 * Commander support
 * Middleware support


