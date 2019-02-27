'use strict'
const RequestHelper = require("./RequestHelper.js");
const Time = require("./Model/Time.js")
const Cache = require("./Infrastructure/Dictionary.js")

module.exports = class CrawlingManager
{
    constructor(config)
    {
        this._requestHelper = new RequestHelper();
        this._url = "https://cafe.naver.com/ArticleList.nhn?search.clubid=10050146&userDisplay=50&search.boardtype=L&search.specialmenutype=&search.questionTab=A&search.totalCount=501&search.page="
        this._config = config;
        this._beginIndex = 0;
        this._caches = new Cache();
    }
    Init()
    {
        var date = new Date();
        this._beginTime = new Time(date.getHours().toString(), date.getMinutes().toString());
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
            if(result.length == 0)
            {
                break;
            }
            let items = result.filter(r=>
                this._config.keywords.some(k=>r.title.includes(k)));

            for(let i=0; i<items.length; ++i)
            {
                this._caches.TryAdd(items[i].index, items[i]);
            }
            console.log(items);
            
            await Sleep(2000 + Math.floor(Math.random() * 500));
        }
        catch(err)
        {            
            console.log(err);
            break;
        }
    }
}

async function Sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}