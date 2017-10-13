import request from 'request'
import zlib from 'zlib'

function nrequest(options) {
    const req = request(options);

    return new Promise((resolve)=>{

        req.on('response', (res)=> {
            var chunks = [];
            res.on('data', (chunk)=> {
                chunks.push(chunk);
            });

            res.on('end', ()=> {
                var buffer = Buffer.concat(chunks);
                var encoding = res.headers['content-encoding'];
                if (encoding == 'gzip') {
                    zlib.gunzip(buffer, (err, decoded)=>{
                        if(err){
                            reject(err)
                        }
                        else{
                            resolve(decoded && decoded.toString())
                        }
                        
                    });
                } else if (encoding == 'deflate') {
                    zlib.inflate(buffer, (err, decoded)=>{
                        if(err){
                            reject(err)
                        }
                        else{
                            resolve(decoded && decoded.toString())
                        }
                    })
                } else {
                    resolve(buffer.toString())
                }
            });
        });

        req.on('error', (err)=>{
            reject(err)
        });




    })

    
}

export const doRequest= async (options)=>{

    try{
        const data=await nrequest(options)
        return {err:null,data}
        
    }catch(e){
        return {err:e,data:null}
    }
    
    
}