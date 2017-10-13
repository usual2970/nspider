import nspider from '../src/index.js'
import {HtmlElement} from '../src/index.js'
import {doRequest} from '../src/request.js'
import chai from 'chai'

const expect=chai.expect

describe('测试onhtml',()=>{
	const nsp=new nspider('baidu')
	it("onhtml的参数应该是HtmlElement的实例",(done)=>{

		nsp.onHtml('a[href]',(ele)=>{
			expect(ele).to.be.an.instanceof(HtmlElement);
			done();
		})

		nsp.visit('http://www.baidu.com');
	})
})

describe('测试request模块',()=>{
	it("简单的get测试",(done)=>{
		const rs=doRequest(
			{
				url:'http://www.baidu.com'
			}
		)
		rs.then((data)=>{
			done()
		})
	})
})