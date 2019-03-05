"use strict"

module.exports = class MailConfig
{
    constructor(service, user, password)
    {
        this.service = service;
        this.user = user;
        this.password = password;
    }
    get Service(){
        return this.service;
    }
    get Auth()
    {
        return {
            user : this.user,
            pass: this.password
        };
    }
}