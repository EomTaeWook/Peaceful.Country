'use strict'

module.exports = class Config
{
    constructor(delayMillisecond, keywords, emails, perMinute, index, isRecency)
    {
        this._delayMillisecond = delayMillisecond;
        this._keywords = keywords;        
        this._emails = emails;
        this._perMinute = perMinute;
        this._index = index;
        this._isRecency = isRecency;
    }
    get DelayMillisecond(){
        return this._delayMillisecond;
    }
    set DelayMillisecond(value){
        this._delayMillisecond = value;
    }
    get Keywords(){
        return this._keywords;
    }
    set Keywords(value){
        this._keywords = value;
    }
    get Emails(){
        return this._emails;
    }
    set Emails(value){
        this._emails = value;
    }
    get PerMinute(){
        return this._perMinute;
    }
    set PerMinute(value){
        this._perMinute = value;
    }
    get Index(){
        return this._index;
    }
    set Index(value){
        this._index = value;
    }
    get IsRecency(){
        return this._isRecency;
    }
    set IsRecency(value){
        this._isRecency = value;
    }
}