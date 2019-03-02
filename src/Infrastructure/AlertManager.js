'use strict'

const mailer = require("nodemailer");
const fs = require("fs");
const MailConfig = require("../Models/MailConfig.js");
const Time = require("../Models/Time.js")

module.exports = class AlertManager
{
    constructor()
    {
        
    }
    Init(eventEmit)
    {
        let path = "";
        if(fs.existsSync("mailConfig.json"))
        {
            path = "mailConfig.json";
        }
        else
        {
            fs.writeFileSync("mailConfig.json", JSON.stringify(new MailConfig("naver", "user", "password"), null, 2));
            path = "mailConfig.json";
        }
        let jsonObj = JSON.parse(fs.readFileSync(`${path}`));

        this._config = new MailConfig(jsonObj.service, jsonObj.auth.user, jsonObj.auth.password);

        let date = new Date();
        this._beginTime = new Time(date.getHours(), date.getMinutes());

        eventEmit.on("crawlingComplete", (datas) => 
        {
            console.log(datas);
        });
    }

}