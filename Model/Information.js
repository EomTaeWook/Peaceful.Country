'use strict'
const Time = require("./Time.js")

module.exports = class Information
{
    constructor(index, title, writer, date)
    {
        this._index = index;
        this._title = title;
        this._writer = writer;
        this._date = date;
    }
    get Writer(){
        return this._writer;
    }
    get Index(){
        return this._index;
    }
    get Title(){
        return this._title;
    }
    get Date(){
        return this._date;
    }
    get Time(){
        if(/[0-9]{1,2}:[0-9]{1,2}/g.test(this._date))
        {
            let regex = new RegExp(/[0-9]{1,2}/, "g");
            let time = [];
            let field = undefined;
            while(field = regex.exec(this._date))
            {
                time.push(field);
            }
            return new Time(time[0], time[1]);
        }
        else
        {
            return undefined;
        }
    }
}