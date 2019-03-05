"use strict"

module.exports = class Config
{
    constructor(delayMillisecond, keywords, emails, perDay, alertPeriod, index, isRecency, isAlert)
    {
        this.delayMillisecond = delayMillisecond;
        this.keywords = keywords;        
        this.emails = emails;
        this.perDay = perDay;
        this.alertPeriod = alertPeriod;
        this.index = index;
        this.isRecency = isRecency;
        this.isAlert = isAlert;
    }
    get DelayMillisecond()
    {
        return this.delayMillisecond;
    }
    set DelayMillisecond(value)
    {
        this.delayMillisecond = value;
    }
    get Keywords()
    {
        return this.keywords;
    }
    set Keywords(value)
    {
        this.keywords = value;
    }
    get Emails()
    {
        return this.emails;
    }
    set Emails(value)
    {
        this.emails = value;
    }
    get PerDay()
    {
        return this.perDay;
    }
    set PerDay(value)
    {
        this.perDay = value;
    }
    get AlertPeriod()
    {
        return this.alertPeriod;
    }
    set AlertPeriod(value)
    {
        this.alertPeriod = value;
    }
    get Index()
    {
        return this.index;
    }
    set Index(value)
    {
        this.index = value;
    }
    get IsRecency()
    {
        return this.isRecency;
    }
    set IsRecency(value)
    {
        this.isRecency = value;
    }
    get IsAlert()
    {
        return this.isAlert;
    }
    set IsAlert(value)
    {
        this.isAlert = value;
    }
}