'use strict'
const Config = require("./Time.js")

module.exports = class Information
{
    constructor(index, title, writer, date)
    {
        this.index = index;
        this.title = title;
        this.writer = writer;
        this.date = date;
    }
    get Writer(){
        return this.writer;
    }
    get Index(){
        return this.index;
    }
    get Title(){
        return this.title;
    }
    get Date(){
        return this.date;
    }
    get Time(){
        if(/[0-9]{1,2}:[0-9]{1,2}/.test(this.date))
        {
            let time = /[0-9]{1,2}/.exec(this.date);
            return new Time(time[0], time[1]);
        }
        else
        {
            return undefined;
        }
    }
}