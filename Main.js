'use strict'

const fs = require("fs");
const CrawlingManager = require("./Infrastructure/CrawlingManager.js");
const AlertManager = require("./Infrastructure/AlertManager.js");
const Config = require("./Model/Config.js");

let isDebug = false;
const args = process.argv;
if(args.length > 2)
{
    if(args[2].toLowerCase() === "debug")
    {
        isDebug = true;
    }
}

process.on('exit', ()=>{
    if(crawlingManager)
    {
        console.log("exit event call");
    }
});

let data = fs.readFileSync("./config.json");
let config = undefined;

if(data | data.length == 0)
{
    config = new Config(3000, [], [], 60, 0, false);
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
}
else
{
    let jsonObject = JSON.parse(data);
    config = new Config(jsonObject.delayMillisecond,
                        jsonObject.keywords,
                        jsonObject.emails,
                        jsonObject.perMinute,
                        jsonObject.index,
                        jsonObject.isRecency);
}

let crawlingManager = new CrawlingManager(config);
crawlingManager.Init();
let alertManager = new AlertManager();
alertManager.Init(isDebug);
crawlingManager.RunCrawling();