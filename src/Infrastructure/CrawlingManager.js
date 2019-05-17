"use strict"

const RequestHelper = require("./RequestHelper.js");
const Cache = require("./Dictionary.js")
const Information = require("../Models/Information.js")

module.exports = class CrawlingManager
{
    constructor()
    {
        this._requestHelper = new RequestHelper();
        //this._url = "https://cafe.naver.com/ArticleList.nhn?search.clubid=10050146&userDisplay=50&search.boardtype=L&search.specialmenutype=&search.questionTab=A&search.totalCount=501&search.page="
        this._url = "https://cafe.naver.com/ArticleList.nhn?search.clubid=10286641&userDisplay=50&search.boardtype=L&search.specialmenutype=&search.questionTab=A&search.totalCount=501&search.page="
        
        this._beginPage = 1;
        this._caches = new Cache();
        this._isStart = false;
    }
    Init(eventEmit, config)
    {
        this._config = config;
        this._beginTime = new Date();
        this._endTime = new Date();
        this._endTime.setDate(this._beginTime.getDate() - this._config.PerDay);

        this._eventEmit = eventEmit;
    }
    Start()
    {
        RunCrawling.bind(this)();
    }
    Stop()
    {
        this._isStart = false;
    }
    Clear()
    {
        this._caches.Clear();
    }
    Page(page, row)
    {
        let index = (page - 1) * row;
        return this._caches.Values.sort((left, right) => parseInt(left.index) > parseInt(right.index)).slice(index, index + row);
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
async function RunCrawling()
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
            await Sleep(2000 + Math.floor(Math.random() * 500) + 1);
            return result;
        })());
        //이후 페이지들
        for (let i = 0; i < 10; i++)
        {
            promises.push((async ()=>
            {
                let result = await Process.bind(this)(index++);
                await Sleep(2000 + Math.floor(Math.random() * 500) + 1);
                return result;
            })());
        }
        let results = await Promise.all(promises);
        await Sleep(this._config.DelayMillisecond + Math.floor(Math.random() * 500) + 1);
        // console.log(results);
        if(!results.some(r=>r))
        {
            index = 1;
            this._beginTime = new Date();
        }
    }
}
async function Process(pageIndex)
{
    try
    {
        let url = this._url;
        url += pageIndex;
        let response = await this._requestHelper.Request(url);
        let bodyRegex = new RegExp("(?<=<div.* class=.*article[^>]+[>])([\\s\\S\\t]+)(?=<\\/div>)", "g");        
        let contentRegex = /(?<=<tr>)([\s\S\t]+?)(?=[\s]<\/tr>)/g;
        let dataArray = [];
        while(true)
        {
            let parseData = bodyRegex.exec(response);
            if(!parseData){
                break;
            }
            if(parseData.length > 1) {
                    let row = null;
                    while((row = contentRegex.exec(parseData[1])) != null){
                        let index = /(articleid=)(.*?)([&;'])\b/g.exec(row[1]);
                        if(!index){
                            continue;
                        }
                        if(index.length != 4){
                            continue;
                        }
                        let title = /\S.*/.exec(/(?<=<a.*atitle.*>)([^<]+[^<\/])(?=<\/a>)/g.exec(row[1])[1]);
                        let date = /[^"\s]+/.exec(/(?<=<td.*>)([\s]+?(\d{4}.\d{2}.\d{2}.)|(\d{2}:\d{2}))(?=([\s]+)?<\/td>)/g.exec(row[1])[1]);
                        // let writer = /<a.*class=.*m-tcol-c.*]*>(.*?)<\/a>/g.exec(row[1]);
                        let writer = /(?<=<td.*class="p-nick".*>)((?!<\/span>)([^\s]+))(?=((<img)|(<\/a)))/g.exec(row[1]);
                        if(!writer)
                        {
                            console.log("test");
                        }
                        console.log(index[2] + " : " + title[0] + " : " + writer[1] + " : " + date[0]);
                        dataArray.push(new Information(index[2], title[0], writer[1], date[0]));
                    }
                }
        }

        if(dataArray.length == 0)
        {
            return true;
        }
        if(!dataArray.some(Condition.bind(this)))
        {
            return false;
        }
        let items = dataArray.filter(r=>
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