import nspider from '../src/index.js'
import {HtmlElement,LimitRule} from '../src/index.js'
import nrequest from '../src/request.js'
import chai from 'chai'
import fs from 'fs'

const expect=chai.expect

describe('测试onhtml',()=>{
	const nsp=new nspider('baidu')

	nsp.setHeaders({
		'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		'Accept-Encoding':'gzip, deflate, br',
		'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
		'Connection':'keep-alive',
		'Cookie':'TYCID=f67289e0a1ba11e7887c39a29bb8fd7d; uccid=8f1b28215a45ee53c7f8b3e11af0891d; ssuid=5290917696; tyc-user-info=%257B%2522token%2522%253A%2522eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxODI1NzE0MDU3MCIsImlhdCI6MTUwNjM5NDc4MSwiZXhwIjoxNTIxOTQ2NzgxfQ.Dg1ySqBAkXAHoA4dtHgtD7WpqUauZVWVRyoqgoZi_4vGyEKENRyE3ZnkWaTeeXiI6PInHsF1khKO55gmYLIjMQ%2522%252C%2522integrity%2522%253A%25220%2525%2522%252C%2522state%2522%253A%25220%2522%252C%2522vnum%2522%253A%25220%2522%252C%2522onum%2522%253A%25220%2522%252C%2522mobile%2522%253A%252218257140570%2522%257D; auth_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxODI1NzE0MDU3MCIsImlhdCI6MTUwNjM5NDc4MSwiZXhwIjoxNTIxOTQ2NzgxfQ.Dg1ySqBAkXAHoA4dtHgtD7WpqUauZVWVRyoqgoZi_4vGyEKENRyE3ZnkWaTeeXiI6PInHsF1khKO55gmYLIjMQ; aliyungf_tc=AQAAACdpDUVNgw4AP1R3fVxqTm0Z27c9; csrfToken=A14W-GdjZ_WSfNzWANzACvOX; _csrf=i0H9KR+yFHqMW/QCBapfWQ==; OA=HXWDWGWGpZo2WbGV6kG2xan4lhO0AQgJeW9bU1uVRSy075SR3OIOtFhP9BT9//1rWZYcCTa/LKGYUoT9TX7nkbBjVXWaqISjfqI6WXmG5T4=; _csrf_bk=c0cbbb82d94bc7f62830345805682fee; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1506649683,1506650550,1506650586,1507960110; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1507960254',
		'Host':'zj.tianyancha.com',
		'Referer':'https://www.tianyancha.com/search?key=%E5%BF%83%E7%90%86%E5%92%A8%E8%AF%A2',
		'Upgrade-Insecure-Requests':'1',
		'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
	})
	const limitRule = new LimitRule({
		maxConnections:1,
		delayTime:1000
	})
	nsp.setLimiter(limitRule)

	it("onhtml的参数应该是HtmlElement的实例",(done)=>{

		nsp.onHtml('.search_result_single a',(ele)=>{
	
			const link=ele.$.attr('href')
			if(/(.*?)company\/(\d+)/.test(link) && ele.tag=='search'){
				nsp.visit(link,'company');
			}
		})

		nsp.onHtml('body',(ele)=>{
			if(ele.tag!='company'){
				return false
			}

			const item = ele.$.find('.company_header_width').text();
			const desc =ele.$.find('.js-full-container').text();

			fs.appendFile("test.txt", item+' '+desc + '\n', (err) => {
		        console.log(err);
		    })
			
			
		})
		for(let i=0;i<5;i++){
			nsp.visit('https://zj.tianyancha.com/search/p'+i+'?key=%E5%BF%83%E7%90%86%E5%92%A8%E8%AF%A2','search');
		}
		
		//done()
	})


})

describe('测试request模块',()=>{
	it("简单的get测试",(done)=>{
		const request=new nrequest()
		const rs=request.doRequest(
			{
				url:'http://www.baidu.com'
			}
		)
		rs.then((data)=>{
			done()
		})
	})
})