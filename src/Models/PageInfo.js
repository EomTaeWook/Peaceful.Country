"use strict"

module.exports = class PageInfo
{
    constructor(total, currentPage, rows, datas)
    {
        this.total = total;
        this.currentPage = currentPage;
        this.rows = rows;
        this.datas = datas;

        this.MinPage = Math.floor((this.currentPage - 1) / 10) * 10 + 1;
        this.MaxPage = this.MinPage + 10;
        this.PageCount = Math.floor(this.total / this.rows);
        this.PageCount == this.MinPage ? this.MinPage + 1 : this.PageCount;
        this.MaxPage = this.PageCount < this.MaxPage ? this.PageCount + 1 : this.MaxPage;
    }
    get Row()
    {
        return this.rows;
    }
    get CurrentPage()
    {
        return this.currentPage;
    }
    get Total()
    {
        return this.total;
    }
    get Datas()
    {
        return this.datas;
    }
}