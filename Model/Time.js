'use strict'

module.exports = class Time
{
    constructor(hour, minute)
    {
        this.hour = hour;
        this.minute = minute;        
    }
    get Hour(){
        return this.hour;
    }
    get Minute(){
        return this.minute;
    }
    CompareTo(other)
    {
        if(this.hour < other.Hour)
        {
            return -1;
        }
        else if(this.hour === other.Hour)
        {
            if(this.minute < other.Minute)
            {
                return -1;
            }
            else if(this.minute === other.minute)
            {
                return 0;
            }
            else if(this.minute > other.Minute)
            {
                return 1;
            }
        }
        else if(this.hour > other.Hour)
        {
            return 1
        }
    }
}