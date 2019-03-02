'use strict'
const RequestHelper = require("./RequestHelper.js");
const Time = require("../Models/Time.js")
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
    Init(eventEmit)
    {
        let date = new Date();
        this._beginTime = new Time(date.getHours(), date.getMinutes());
        this._endTime = this._beginTime.AddMinute(-this._config.PerMinute);

        this._eventEmit = eventEmit;
    }
    async RunCrawling()
    {
        console.log("Run Crawling!");
        let index = 1;
        while(true)
        {
            let promises = [];
            for (let i = 0; i < 10; i++)
            {
                promises.push((async ()=>
                {
                    let result = await Process.bind(this)(index++);
                    await Sleep(Math.floor(Math.random() * 100 + 1));
                    return result;
                })());
            }
            let results = await Promise.all(promises);
            await Sleep(this._config.DelayMillisecond + Math.floor(Math.random() * 500 + 1));
            // console.log(results);
            if(!results.some(r=>r))
            {
                index = 1;
                this._eventEmit.emit("crawlingComplete", this._caches);

                let date = new Date();
                this._beginTime.Hour = date.getHours();
                this._beginTime.Minute = date.getMinutes();
            }
        }
    }
}

function Condition(item)
{
    if(item.Time === undefined)
    {
        return false;   
    }
    return item.Time.CompareTo(this._endTime) > 0;
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
        if(!resultItems.some(Condition.bind(this)))
        {
            return false;
        }
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