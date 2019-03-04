"use strict"

const mailer = require("nodemailer");
const fs = require("fs");
const MailConfig = require("../Models/MailConfig.js");

module.exports = class AlertManager
{
    
    constructor()
    {
        this._interval = undefined;
    }
    Init(eventEmit, config)
    {
        this._alertPeriod = config.AlertPeriod * 60 * 1000;
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

        this._eventEmit = eventEmit;
        this._config = new MailConfig(jsonObj.service, jsonObj.auth.user, jsonObj.auth.password);
        this._beginTime = new Date();
    }
    Start()
    {
        if(this._interval) return;
        this._interval = setInterval(()=>{
            this._eventEmit.emit("alert");
         }, this._alertPeriod);
    }
    Stop()
    {
        if(this._alertPeriod)
        {
            clearInterval(this._alertPeriod)
            this._alertPeriod = undefined;
        }
    }
    SendMails(toEmail, subject, content)
    {
        let trasport = mailer.createTransport(JSON.stringify(this._config));
        
        let mailOptions = {
            from: this._config.Auth.user,
            to: toEmail,
            subject: subject,
            text: content
        };

        trasport.sendMail(mailOptions, (err, resolve) => {
            if(err) throw err;
            trasport.close();
        });
    }
}