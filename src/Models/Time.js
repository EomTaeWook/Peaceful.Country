'use strict'

module.exports = class Time
{
    constructor(hour, minute)
    {
        this._hour = parseInt(hour) % 24;
        this._minute = parseInt(minute) % 60;
    }
    set Hour(value){
        this._hour = value;
    }
    get Hour(){
        return this._hour;
    }
    set Minute(value){
        this._minute = value;
    }
    get Minute(){
        return this._minute;
    }
    AddMinute(minute)
    {
        let minValue = parseInt(minute);
        if(!minValue)
        {
            return undefined;
        }
        
        let min = this.Minute;
        let hour = this.Hour;

        if(min + minValue > 0)
        {
            min += minValue;
            hour += Math.floor(min / 60);
            min %= 60;
        }
        else if(min + minValue <= 0)
        {
            min = Math.abs((60 + min) + minValue % 60);
            hour -= Math.floor(minValue / 60) + Math.floor(min / 60);
            min  %= 60;
        }

        hour = Math.abs(Math.floor(hour % 24));

        return new Time(hour, min);
    }
    CompareTo(other)
    {
        if(this._hour < other.Hour)
        {
            return -1;
        }
        else if(this._hour === other.Hour)
        {
            if(this._minute < other.Minute)
            {
                return -1;
            }
            else if(this._minute === other.minute)
            {
                return 0;
            }
            else if(this._minute > other.Minute)
            {
                return 1;
            }
        }
        else if(this._hour > other.Hour)
        {
            return 1
        }
    }
}