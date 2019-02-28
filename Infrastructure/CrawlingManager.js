'use strict'
const RequestHelper = require("./RequestHelper.js");
const Time = require("../Model/Time.js")
const Cache = require("./Dictionary.js")

module.exports = class CrawlingManager
{
    constructor(config)
    {
        this._requestHelper = new RequestHelper();
        this._url = "https://cafe.naver.com/ArticleList.nhn?search.clubid=10050146&userDisplay=50&search.boardtype=L&search.specialmenutype=&search.questionTab=A&search.totalCount=501&search.page="
        this._config = config;
        this._beginPage = 1;
        this._caches = new Cache();
    }
    Init()
    {
        var date = new Date();
        this._beginTime = new Time(date.getHours(), date.getMinutes());
        this._endTime = this._beginTime.AddMinute(-this._config.PerMinute);
    }
    async RunCrawling()
    {
        console.log("RunCrawling!");
        while(true)
        {
            let index = 1;
            while(true)
            {
                console.log(`Page : ${index} Request >>>`);
                let result = await Process.bind(this)(index++);
                await Sleep(this._config.DelayMillisecond + Math.floor(Math.random() * 1000 + 1));
                if(!result || this._config.IsRecency)
                {
                    break;
                }
            }
        }
    }
}

async function Process(pageIndex)
{
    try
    {
        let url = this._url;
        url += pageIndex;
        let resultItems = await this._requestHelper.Request(url);
        if(resultItems.length == 0 || !resultItems)
        {
            return false;
        }
        if(resultItems.some(r =>{ r.Time.CompareTo(this._endTime) > 1 })) //|| r.Time === undefined }))
        {
            return false;
        }
        // if(!result.some(r=>/[0-9]{1,2}:[0-9]{1,2}/.exec(r.date)))
        // {
        //     return false;
        // }
        let items = resultItems.filter(r=>
            this._config.Keywords.some(k=>r.Title.includes(k))
        );
        for(let i=0; i<items.length; ++i)
        {
            this._caches.TryAdd(items[i].Index, items[i]);
        }
        console.log(items);
    }
    catch(err)
    {            
        console.log(err);
        return false;
    }
    return true;
}

async function Sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}