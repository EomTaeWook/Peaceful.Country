"use strict"

const req = require('request')
const charset = require('charset')
const iconv = require('iconv-lite')
const Information = require("../Models/Information.js")

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
            let dataArray = [];
            req(option, (err, res, body) =>{
                if(err) reject(err);

                let encoding = charset(res.headers, body);
                let resultBody = iconv.decode(body, encoding);

                //console.log(resultBody);
                let bodyRegex = new RegExp("<tr.*>([\\s\\S\\t]+?)<td.*>(.*?)<\\/td>([\\s\\t]+)<\\/tr>","g");
                let row = [];
                while(true)
                {
                    row = bodyRegex.exec(resultBody);
                    if(row)
                    {
                        if(row.length > 1)
                        {
                            // console.log(row[1]);
                            let content = /<a.*class="article".*>[\s\S\t]+?<\/a>/g.exec(row[1]);
                            if(content)
                            {
                                //console.log(content[0]);
                                let index = /(articleid=)(.*?)([&;'])\b/g.exec(content[0]);
                                let title = /\S.*/.exec(/(?<=(<a.*>))[\t\s\S]+?(?=<\/a>)/g.exec(content[0]));
                                let date = /(?<=<td.*class=.td_date.*>)(.*?)(?=<\/td>)/g.exec(row[1]);
                                let writer = /<a.*class=.*m-tcol-c.*]*>(.*?)<\/a>/g.exec(row[1]);
                                console.log(index[2] + " : " + title[0] + " : " +writer[1] + " : " + date[0]);
                                dataArray.push(new Information(index[2], title[0], writer[1], date[0]));
                            }     
                        }
                    }
                    else{
                        break;
                    }
                }
                resolve(dataArray);
            });
        });        
    }
}