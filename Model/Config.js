'use strict'

module.exports = class Config
{
    constructor(delayMilliSecond, keywords, emails, perMinute)
    {
        this.delayMilliSecond = delayMilliSecond;
        this.keywords = keywords;        
        this.emails = emails;
        this.perMinute = perMinute;
    }
    get DelayMilliSecond(){
        return this.delayMilliSecond;
    }
    set DelayMilliSecond(value){
        this.delayMilliSecond = value;
    }
    get Keywords(){
        return this.keywords;
    }
    set Keywords(value){
        this.keywords = value;
    }
    get Emails(){
        return this.emails;
    }
    set Emails(value){
        this.emails = value;
    }
    get PerMinute(){
        return this.perMinute;
    }
    set PerMinute(value){
        this.perMinute = value;
    }
}