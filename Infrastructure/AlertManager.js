'use strict'

const mailer = require("nodemailer");
const fs = require("fs");
const MailConfig = require("../Model/MailConfig.js");

module.exports = class AlertManager
{
    constructor()
    {
    }
    Init(isDebug)
    {
        let path = "";
        if(isDebug && fs.existsSync("mailConfig_Debug.json"))
        {
            path = "mailConfig_Debug.json";
        }
        else if(fs.existsSync("mailConfig.json"))
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
        
    }

}