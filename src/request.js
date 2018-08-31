import request from 'request'
import zlib from 'zlib'


export default class Nrequest {

    constructor() {

    }

    nrequest(options) {
        const req = request(options);

        return new Promise((resolve) => {

            req.on('response', (res) => {
                var chunks = [];
                res.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                res.on('end', () => {
                    var buffer = Buffer.concat(chunks);
                    var encoding = res.headers['content-encoding'];
                    if (encoding == 'gzip') {
                        zlib.gunzip(buffer, (err, decoded) => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(decoded && decoded.toString())
                            }

                        });
                    } else if (encoding == 'deflate') {
                        zlib.inflate(buffer, (err, decoded) => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(decoded && decoded.toString())
                            }
                        })
                    } else {
                        resolve(buffer.toString())
                    }
                });
            });

            req.on('error', (err) => {
                reject(err)
            });


        })


    }

    async doRequest(options) {
        let err, data = null
        try {
            data = await this.nrequest(options)
        } catch (e) {
            err = e
        }
        return {
            err,
            data
        }


    }
}
