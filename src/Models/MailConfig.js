'use strict'

module.exports = class MailConfig
{
    constructor(service, user, password)
    {
        this._service = service;
        this._user = user;
        this._password = password;
    }
    get Service(){
        return this._service;
    }
    get Auth()
    {
        return {
            user : this._user,
            pass: this._password
        };
    }
}