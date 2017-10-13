import {doRequest} from './request.js' 


export class HtmlElement{
	constructor({tag,html}){
		this.tag=tag
		this.html=html
	}
}


class Request{
	constructor({tag,requestOption,url}){
		this.tag=tag
		this.requestOption=requestOption
		this.url=url
	}
}

class Response{
	constructor({tag,responseData}){
		this.tag=tag
		this.data=responseData
	}
}
export default class nspider{
	

	constructor({name,headers={}}){
		this.name=name
		this.htmlCallBacks=new Map();
		this.requestCallBacks=[]
		this.responseCallBacks=[]
		this.headers=headers
	}


	visit(url, tag=''){
		this.scrape(url,'GET',tag)
		
	}

	post(url, tag){
		this.scrape(url,'POST',tag)
	}

	scrape(url,method,tag=''){

		const options={}

		options.method=method
		options.headers=this.headers
		options.url=url
		

		if(this.requestCallBacks.length>0){
			const req=new Request({tag,requestOption:options,url})
			this.handleRequest(req)
		}

		const rs=doRequest(options)
		const that=this
		rs.then((data)=>{
			


			if(this.responseCallBacks.length>0){
				const res=new Response({tag,responseData:data})
				that.handleResponse(res)
			}
			if(this.htmlCallBacks.size>0){
				const element=new HtmlElement({tag,html:data.data})
				that.handleHtml(element)
			}

		})

		

		
	}

	setHeaders(headers){
		for(let key in headers){
			this.setHeader(key,headers[key])
		}

		return this
	}

	setHeader(key,val){
		this.headers[key]=val
		return this
	}

	

	onHtml(selector,cb){
		this.htmlCallBacks.set(selector,cb)
	}

	onRequest(cb){
		this.requestCallBacks.push(cb)
	}


	onResponse(cb){
		this.responseCallBacks.push(cb)
	}


	handleRequest(){
		for(let cb of this.requestCallBacks){

		}
	}

	handleResponse(){
		for(let cb of this.responseCallBacks){
			
		}
	}

	handleHtml(element){
		for(let [selector,cb] of this.htmlCallBacks){
			cb(element)
		}
	}
}