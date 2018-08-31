import nspider from '../src/index.js'
import {HtmlElement, LimitRule} from '../src/index.js'
import nrequest from '../src/request.js'
import chai from 'chai'
import fs from 'fs'

const expect = chai.expect

describe('测试onhtml', () => {
    const nsp = new nspider('baidu')

    nsp.setHeaders({
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Cookie': 'aliyungf_tc=AQAAAIaZ+iY/iwsAoFUKcL59MECjJFXf; csrfToken=A7jW2DMQgvoz5y194MIp2jYE; TYCID=1ba19700acab11e8aaa3279e2d34909c; undefined=1ba19700acab11e8aaa3279e2d34909c; Hm_lvt_e92c8d65d92d534b0fc290df538b4758=1535671155; ssuid=6614904378; Hm_lpvt_e92c8d65d92d534b0fc290df538b4758=1535671168; _ga=GA1.2.223629567.1535671169; _gid=GA1.2.1038262680.1535671169; _gat_gtag_UA_123487620_1=1',
        'Host': 'zj.tianyancha.com',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
    })
    const limitRule = new LimitRule({
        maxConnections: 0,
        delayTime: 0
    })
    nsp.setLimiter(limitRule)

    it("onhtml的参数应该是HtmlElement的实例", (done) => {

        nsp.onHtml('.search-result-single a.name', (ele) => {

            const link = ele.$.attr('href')
            console.log(link)
            if (/(.*?)company\/(\d+)/.test(link) && ele.tag == 'search') {
                nsp.visit(link, 'company');
            }
        })

        nsp.onHtml('body', (ele) => {
            if (ele.tag != 'company') {
                return false
            }

            const item = ele.$.find('.company_header_width').text();
            const desc = ele.$.find('.js-full-container').text();

            fs.appendFile("test.txt", item + ' ' + desc + '\n', (err) => {
                console.log(err);
            })


        })
        for (let i = 0; i < 5; i++) {
            nsp.visit('https://zj.tianyancha.com/search/p' + i + '?key=%E5%BF%83%E7%90%86%E5%92%A8%E8%AF%A2', 'search');
        }

        done()
    })


})

describe('测试request模块', () => {
    it("简单的get测试", () => {
        const request = new nrequest()
        const rs = request.doRequest(
            {
                url: 'http://www.baidu.com'

            }
        )
        return rs
    })
})
