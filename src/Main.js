"use strict"

const electron = require("electron");
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const ipcMain = electron.ipcMain;

const fs = require("fs");
const CrawlingManager = require("./Infrastructure/CrawlingManager.js");
const AlertManager = require("./Infrastructure/AlertManager.js");
const Config = require("./Models/Config.js");
const EventEmitter = require("events").EventEmitter;
const PageInfo = require("./Models/PageInfo.js");

let data = fs.readFileSync("./config.json");
let config = undefined;
let _eventEmit = new EventEmitter();

if(data | data.length == 0)
{
    config = new Config(3000, [], [], 1, 60, 0, false, true);
    fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
}
else
{
    let jsonObject = JSON.parse(data);
    config = new Config(jsonObject.delayMillisecond,
                        jsonObject.keywords,
                        jsonObject.emails,
                        jsonObject.perDay,
                        jsonObject.alertPeriod,
                        jsonObject.index,
                        jsonObject.isRecency,
                        jsonObject.isAlert);

}

let crawlingManager = new CrawlingManager();
crawlingManager.Init(_eventEmit, config);
let alertManager = new AlertManager();
alertManager.Init(_eventEmit, config);

let mainWindow = null;

app.on("ready", ()=> {
    mainWindow = new BrowserWindow({width: 1270, height: 860});
    mainWindow.setMenu(null);
    mainWindow.loadURL(`file://${__dirname}/Views/index.html`);

    //mainWindow.webContents.openDevTools();

    mainWindow.on("closed", ()=> {
        mainWindow = null;
        alertManager.Stop();
        crawlingManager.Stop();
    });
});

app.on("window-all-closed", () => { 
  if (process.platform !== "darwin") {
    app.quit()
  }
  alertManager.Stop();
  crawlingManager.Stop();
});

_eventEmit.on("alert", ()=>{

    if(!config.isAlert) return false;
    let datas = crawlingManager.Page(1, crawlingManager.Total());
    config.Emails.forEach(email => {
        alertManager.SendMails(email, `[${config.Keywords.toString()}] 조회 결과`, MailContent(datas));
    });
    crawlingManager.Clear();
});

function MailContent(datas)
{
    let html = `
    <table style="border:1px solid; border-collapse: collapse;">
    <thead><tr>
    <th style="border:1px solid">Index</th>
    <th style="border:1px solid">Title</th>
    <th style="border:1px solid">Writer</th>
    <th style="border:1px solid">Date</th>
    <th style="border:1px solid">이동</th>
    </tr></thead>
    <tbody>`;

    for(let i=0; i<datas.length; ++i)
    {
        html += `<tr>
            <td style="border:1px solid">${datas[i].Index}</td>
            <td style="border:1px solid">${datas[i].Title}</td>
            <td style="border:1px solid">${datas[i].Writer}</td>
            <td style="border:1px solid">${datas[i].Date.toLocaleDateString()}</td>
            <td style="border:1px solid"><a href="https://cafe.naver.com/joonggonara/${datas[i].index}">이동</a></td></tr>`;
    }
    `</tbody>
    </table>`
    return html;
}

ipcMain.on("start", (event, status)=>{
    
    if(status === "true")
    {
        crawlingManager.Start();
        alertManager.Start();
    }
    else
    {
        alertManager.Stop();
        crawlingManager.Stop();
    }
});

ipcMain.on("getConfig", (event) =>{
    event.sender.send("getConfig", config);
});

ipcMain.on("setConfig", (event, args) =>{
    
    for(let i=0; i< args.keywords.length; ++i)
    {
        args.keywords[i] = args.keywords[i].trim();
    }
    config.Keywords = args.keywords;
    config.Emails = args.emails;
    config.PerDay = args.perDay;
    config.AlertPeriod = args.alertPeriod;
    config.isAlert = args.isAlert === "true";

    fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));

    crawlingManager.Init(_eventEmit, config);
    alertManager.Init(_eventEmit, config);
});
ipcMain.on("dataBind", (event, page)=>{
    
    if(mainWindow)
    {
        mainWindow.webContents.send("dataBind", new PageInfo(crawlingManager.Total(), page, 20, crawlingManager.Page(page, 20)));
    }
});