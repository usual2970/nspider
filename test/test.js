import nspider from '../src/index.js'
import {HtmlElement} from '../src/index.js'
import nrequest from '../src/request.js'
import chai from 'chai'

const expect=chai.expect

describe('测试onhtml',()=>{
	const nsp=new nspider('baidu')
	it("onhtml的参数应该是HtmlElement的实例",(done)=>{

		nsp.onHtml('a[href]',(ele)=>{
	

			console.log(ele.$.attr('href'))
			nsp.visit(ele.$.attr('href'));
			
		})
		
		nsp.visit('http://www.baidu.com');
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