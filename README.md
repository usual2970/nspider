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

## Usage

### Basic use
```js
//basic use
var nspider=require('nspider22')

var nsp=new nspider({name:'baidu'});
nsp.onHtml('a',function(ele){
	console.log(ele.$.attr('href'));
})

nsp.visit("http://www.baidu.com");

```

### Set headers

```js
//set headers
var nspider=require('nspider22')

var nsp=new nspider({name:'zhihu'});

nsp.setHeaders({
    "Cache-Control":"private,no-store,max-age=0,no-cache,must-revalidate,post-check=0,pre-check=0",
    "Connection":"keep-alive",
    "Content-Encoding":"gzip",
    "Content-Security-Policy":"default-src * blob:;img-src * data: blob:;frame-src 'self' *.zhihu.com *.zhihu.dev getpocket.com note.youdao.com safari-extension://com.evernote.safari.clipper-Q79WDW8YH9 weixin: zhihujs: v.qq.com v.youku.com www.bilibili.com *.vzuu.com;script-src 'self' *.zhihu.com *.google-analytics.com zhstatic.zhihu.com res.wx.qq.com 'unsafe-eval' unpkg.zhimg.com unicom.zhimg.com blob:;style-src 'self' *.zhihu.com *.zhihu.dev unicom.zhimg.com 'unsafe-inline';connect-src * wss:",
    "Content-Type":"text/html; charset=utf-8",
    "Date":"Thu, 19 Oct 2017 02:37:30 GMT",
    "Expires":"Fri, 02 Jan 2000 00:00:00 GMT",
    "Pragma":"no-cache",
    "Server":"ZWS",
    "Set-Cookie":"",
    "Transfer-Encoding":"chunked",
    "Vary":"Accept-Encoding",
    "X-Backend-Server":"heifetz.heifetz.fba20226---10.3.183.2:31036[10.3.183.2:31036]",
    "X-Frame-Options":"DENY",
    "X-Req-ID":"3570E3F59E80FE9",
    "X-Req-SSL":"proto=TLSv1.2,sni=,cipher=ECDHE-RSA-AES256-GCM-SHA384"
})
    

nsp.onHtml('.tab-panel a.question_link',function(ele){
    if(ele.tag=='zhihu'){
        console.log(ele.$.attr('href'));
        nsp.visit('https://www.zhihu.com'+ele.$.attr('href'),'item')
    }
})

nsp.onHtml("body",function(ele){
    if(ele.tag=='item'){
        console.log(ele.$.text())
    }
})

nsp.visit("https://www.zhihu.com/explore","zhihu");
```


### set limiter

```js
var nspider=require('nspider22')

var nsp=new nspider({name:'baidu'});

var limitRule = new nspider.LimitRule({
        maxConnections:1,
        delayTime:1000
    })

nsp.setLimiter(limitRule)

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


