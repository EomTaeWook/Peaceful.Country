"use strict"

const req = require('request')
const charset = require('charset')
const iconv = require('iconv-lite')

module.exports = class RequestHelper
{
    constructor()
    {
    }

    Request(url)
    {
        return new Promise((resolve, reject)=>{
            const option = {
                url : url,
                method : 'GET',
                headers:{
                    'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
                    'Content-Type': 'text/plain;'
                },
                encoding : null
            }
            req(option, (err, res, body) =>{
                if(err) 
                {
                    reject(err);
                    return;
                }
                if(!res)
                {
                    reject(err);
                    return;
                } 
                if(!Object.prototype.hasOwnProperty.call(res, "headers")) 
                {
                    reject(undefined);
                    return;
                }
                resolve(iconv.decode(body, charset(res.headers, body)));
            });
        });        
    }
}