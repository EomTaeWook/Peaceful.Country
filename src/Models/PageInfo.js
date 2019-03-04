"use strict"

module.exports = class PageInfo
{
    constructor(total, page, rows, datas)
    {
        this._total = total;
        this._page = page;
        this._rows = rows;
        this._datas = datas;
    }
    get Row()
    {
        return this._rows;
    }
    get Page()
    {
        return this._page;
    }
    get Total()
    {
        return this._total;
    }
    get Datas()
    {
        return this._datas;
    }
}