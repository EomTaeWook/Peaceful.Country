"use strict"

module.exports = class Dictionary
{
    constructor()
    {
        this._objectTable = new Object();
    }
    Add(key, value)
    {
        this._objectTable[key] = value;
    }
    TryAdd(key, value)
    {
        if(!this.ContainsKey(key))
        {
            this.Add(key, value);
        }
    }
    Remove(key)
    {
        delete this._objectTable[key];
    }
    Clear()
    {
        Object.keys(this._objectTable).forEach(key => { delete this._objectTable[key]; });
    }
    ContainsKey(key)
    {
        return this._objectTable.hasOwnProperty(key);
    }
}