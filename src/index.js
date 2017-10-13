class HtmlElement{
	constructor({tag}){
		this.tag=tag
	}
}


class Request{
	constructor({tag}){
		this.tag=tag
	}
}

class Response{
	constructor({tag}){
		this.tag=tag
	}
}
export default class nspider{
	

	constructor({name}){
		this.name=name
		this.htmlCallBacks={}
		this.requestCallBacks=[]
		this.responseCallBacks=[]
	}


	visit(url, tag=''){

	}

	scrape(){
		
	}

	get(){

	}

	post(){

	}

	onHtml(selector,cb){
		this.htmlCallBacks[selector]=cb
	}

	onRequest(cb){
		this.requestCallBacks.push(cb)
	}


	onResponse(cb){
		this.responseCallBacks.push(cb)
	}
}