"use strict"

const RequestHelper = require("./RequestHelper.js");
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
        this._isStart = false;
    }
    Init(eventEmit)
    {
        this._beginTime = new Date();
        this._endTime = new Date();
        this._endTime.setDate(this._beginTime.getDate() - this._config.PerDay);

        this._eventEmit = eventEmit;
    }
    async RunCrawling()
    {
        console.log("Run Crawling!");
        
        if(this._isStart)
        {
            return;
        }
        let index = 1;
        this._isStart = true;
        while(this._isStart)
        {
            let promises = [];
            //최신
            promises.push((async ()=>
            {
                let result = await Process.bind(this)(1);
                await Sleep(Math.floor(Math.random() * 500 + 1));
                return result;
            })());
            //이후 페이지들
            for (let i = 0; i < 10; i++)
            {
                promises.push((async ()=>
                {
                    let result = await Process.bind(this)(index++);
                    await Sleep(Math.floor(Math.random() * 500 + 1));
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
                this._beginTime = new Date();
            }
        }
    }
    Stop()
    {
        this._isStart = false;
    }
    Page(page, row)
    {
        return this._caches.Values.slice((page - 1) * row,  row);
    }
    Total()
    {
        return this._caches.Count;
    }
}

function Condition(item)
{
    if(item.Date === undefined)
    {
        return false;   
    }
    return item.Date - this._endTime >= 0;
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