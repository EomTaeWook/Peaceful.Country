"use strict"

module.exports = class PageInfo
{
    constructor(total, currentPage, rows, datas)
    {
        this._total = total;
        this._currentPage = currentPage;
        this._rows = rows;
        this._datas = datas;

        this.MinPage = Math.floor((this._currentPage - 1) / 10) * 10 + 1;
        this.MaxPage = this.MinPage + 10;
        this.PageCount = Math.floor(this._total / this._rows);
        this.PageCount == this.MinPage ? this.MinPage + 1 : this.PageCount;
        this.MaxPage = this.PageCount < this.MaxPage ? this.PageCount + 1 : this.MaxPage;
    }
    get Row()
    {
        return this._rows;
    }
    get CurrentPage()
    {
        return this._currentPage;
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