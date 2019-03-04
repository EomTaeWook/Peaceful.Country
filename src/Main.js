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
    config = new Config(3000, [], [], 1, 60, 0, false);
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
                        jsonObject.isRecency);

}

let crawlingManager = new CrawlingManager();
crawlingManager.Init(_eventEmit, config);
let alertManager = new AlertManager();
alertManager.Init(_eventEmit, config);

let mainWindow = null;

app.on('ready', ()=> {

    mainWindow = new BrowserWindow({width: 1270, height: 860});
    mainWindow.setMenu(null);
    mainWindow.loadURL(`file://${__dirname}/Views/index.html`);

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', ()=> {
        mainWindow = null;
        crawlingManager.Stop();
    });
});

app.on("window-all-closed", () => { 
  if (process.platform !== 'darwin') {
    app.quit()
  }
  crawlingManager.Stop();
});

ipcMain.on("start", (event, status)=>{
    if(status === "true")
    {
        crawlingManager.RunCrawling();
    }
    else
    {
        crawlingManager.Stop();
    }
});

ipcMain.on("getConfig", (event) =>{
    event.sender.send("getConfig", config);
});

ipcMain.on("setConfig", (event, args) =>{
    config.Keywords = args._keywords;
    config.Emails = args._emails;
    config.PerDay = args._perDay;
    config.AlertPeriod = args._alertPeriod;

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