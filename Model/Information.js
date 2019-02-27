'use strict'

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
}