'use strict'
const RequestHelper = require("./RequestHelper.js");

module.exports = class CrawlingManager
{
    constructor(config)
    {
        this._requestHelper = new RequestHelper();
        this._url = "https://cafe.naver.com/ArticleList.nhn?search.clubid=10050146&userDisplay=50&search.boardtype=L&search.specialmenutype=&search.questionTab=A&search.totalCount=501&search.page="
        this._config = config;
    }
    Init()
    {

    }
    RunCrawling()
    {
        RecencyCrawling.bind(this)(1);
    }
}


async function RecencyCrawling(index)
{
    let isComplete = false;
    while(!isComplete)
    {
        try
        {
            let url = this._url;
            url += index++;
            let result = await this._requestHelper.Request(url);
            if(result.length == 0){
                break;
            }
            
            await Sleep(2000);
        }
        catch(err)
        {            
            console.err(err);
            break;
        }
    }
}

async function Sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}