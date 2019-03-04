"use strict"

window.$ = window.jQuery = require("../wwwroot/js/jquery-3.3.1.min.js");
const ipcRenderer = require("electron").ipcRenderer;

 let btnConfig = document.getElementById("btnConfig");
 btnConfig.addEventListener("click", (event)=>{
     event.preventDefault();
     Metro.dialog.open(".dialog");
 });

 let page = 1;
 let reqeustData = undefined;

 let btnStart = document.getElementById("btnStart");
 btnStart.addEventListener("click", (event)=>{
     event.preventDefault();
     btnStart.parentElement.hidden = true;
     btnStop.parentElement.hidden = false;
     ipcRenderer.send("start", "true");
     if(!reqeustData)
     {
        reqeustData = setInterval(()=>{
            ipcRenderer.send("dataBind", page);
         }, 2000);
     }
 });

 let btnStop = document.getElementById("btnStop");
 btnStop.addEventListener("click", (event)=>{
     event.preventDefault();
     btnStop.parentElement.hidden = true;
     btnStart.parentElement.hidden = false;
     ipcRenderer.send("start", "false");
     if(reqeustData !== undefined)
     {
        clearInterval(reqeustData);
     }
 });

 ipcRenderer.on("dataBind", (event, args) =>{
    console.log(args);
    // let body = document.getElementById("body");
    // body.innerHTML = "";
    // for(let i=args.length - 1; i>=0; --i)
    // {
    //     let row = body.insertRow(body.rows.length);
    //     let index = row.insertCell(0);
    //     index.innerHTML = args[i]._index;
    //     let title = row.insertCell(1);
    //     title.innerHTML = args[i]._title;
    //     let date = row.insertCell(2);
    //     date.innerHTML = new Date(args[i]._date).toLocaleDateString();
    //     let move = row.insertCell(3);
    //     move.innerHTML = "<a href=\"#\" onclick=\"window.open(\"https://cafe.naver.com/joonggonara/" + args[i]._index + "\"', '_blank', 'width=600 height=600')\">이동</a>"        
    // }
 });