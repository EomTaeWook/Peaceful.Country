"use strict"

module.exports = class Information
{
    constructor(index, title, writer, date)
    {
        this._index = index;
        this._title = title;
        this._writer = writer;
        if(/[0-9]{1,2}:[0-9]{1,2}/g.test(date))
        {
            let now = new Date().toLocaleDateString();
            this._date = new Date(`${now.substring(0, now.length - 1)}` + " " + `${date}`);
        }
        else if(/[0-9]{4}.[0-9]{1,2}.[0-9]{1,2}/g.test(date))
        {
            this._date = new Date(`${date.substring(0, date.length - 1)}`);
        }
        else
        {
            this._date = undefined;
        }
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
}