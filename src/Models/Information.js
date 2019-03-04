"use strict"

module.exports = class Information
{
    constructor(index, title, writer, date)
    {
        this.index = index;
        this.title = title;
        this.writer = writer;
        if(/[0-9]{1,2}:[0-9]{1,2}/g.test(date))
        {
            let now = new Date().toLocaleDateString();
            this.date = new Date(`${now.substring(0, now.length - 1)}` + " " + `${date}`);
        }
        else if(/[0-9]{4}.[0-9]{1,2}.[0-9]{1,2}/g.test(date))
        {
            this.date = new Date(`${date.substring(0, date.length - 1)}`);
        }
        else
        {
            this.date = undefined;
        }
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
}