import nrequest from './request.js'
import cheerio from 'cheerio'
import Bottleneck from 'bottleneck'

export class HtmlElement {
	constructor({
		tag,
		$
	}) {
		this.tag = tag
		this.$ = $
	}
}


export class LimitRule {
	constructor({
		maxConnections = 0,
		delayTime = 0,
		highWater = -1,
	}) {
		this.maxConcurrent = maxConnections
		this.minTime = delayTime
		this.highWater = highWater
		this.strategy = Bottleneck.strategy.LEAK
		this.rejectOnDrop = false
	}
}


class Request {
	constructor({
		tag,
		requestOption,
		url
	}) {
		this.tag = tag
		this.requestOption = requestOption
		this.url = url

	}
}

class Response {
	constructor({
		tag,
		responseData
	}) {
		this.tag = tag
		this.data = responseData
	}
}
export default class nspider {


	constructor({
		name = '',
		headers = {}
	}) {
		this.name = name
		this.htmlCallBacks = new Map();
		this.requestCallBacks = []
		this.responseCallBacks = []
		this.headers = headers
		this.nrequest = new nrequest()
		this.limitRule = new LimitRule({})

		this.limiter = new Bottleneck(this.limitRule.maxConcurrent, this.limitRule.minTime)
	}


	visit(url, tag = '') {
		this.scrape(url, 'GET', tag)

	}

	post(url, tag) {
		this.scrape(url, 'POST', tag)
	}

	scrape(url, method, tag = '') {

		const options = {}

		options.method = method
		options.headers = this.headers
		options.url = url


		if (this.requestCallBacks.length > 0) {
			const req = new Request({
				tag,
				requestOption: options,
				url
			})
			this.handleRequest(req)
		}

		const rs = this.limiter.schedule(this.nrequest.nrequest, options)
		const that = this
		rs.then((data) => {

			if (this.responseCallBacks.length > 0) {
				const res = new Response({
					tag,
					responseData: data
				})
				that.handleResponse(res)
			}
			if (this.htmlCallBacks.size > 0) {
				const $ = cheerio.load(data)
				that.handleHtml({
					tag,
					$
				})
			}

		})



	}

	setHeaders(headers) {
		for (let key in headers) {
			this.setHeader(key, headers[key])
		}

		return this
	}

	setHeader(key, val) {
		this.headers[key] = val
		return this
	}


	setLimiter(limitRule) {
		this.limitRule = limitRule
		this.limiter = new Bottleneck(this.limitRule.maxConcurrent, this.limitRule.minTime)
		return this
	}



	onHtml(selector, cb) {
		this.htmlCallBacks.set(selector, cb)
	}

	onRequest(cb) {
		this.requestCallBacks.push(cb)
	}


	onResponse(cb) {
		this.responseCallBacks.push(cb)
	}


	handleRequest(req) {
		for (let cb of this.requestCallBacks) {
			cb(req)
		}
	}

	handleResponse(res) {
		for (let cb of this.responseCallBacks) {
			cb(res)
		}
	}

	handleHtml({
		tag,
		$
	}) {
		for (let [selector, cb] of this.htmlCallBacks) {
			const objects = $(selector)
			for (let i = 0; i < objects.length; i++) {
				const element = new HtmlElement({
					tag,
					$: $(objects[i])
				})
				cb(element)
			}
		}
	}
}