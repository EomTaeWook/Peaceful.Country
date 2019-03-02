window.$ = window.jQuery = require("../wwwroot/js/jquery-3.3.1.min.js");
const ipcRenderer = require("electron").ipcRenderer;

 let btnConfig = document.getElementById("btnConfig");
 btnConfig.addEventListener("click", (event)=>{
     event.preventDefault();
     Metro.dialog.open(".dialog");
 });

 let btnStart = document.getElementById("btnStart");
 btnStart.addEventListener("click", (event)=>{
     event.preventDefault();
     btnStart.parentElement.hidden = true;
     btnStop.parentElement.hidden = false;
     ipcRenderer.send("start", "true");
 });

 let btnStop = document.getElementById("btnStop");
 btnStop.addEventListener("click", (event)=>{
     event.preventDefault();
     btnStop.parentElement.hidden = true;
     btnStart.parentElement.hidden = false;
     ipcRenderer.send("start", "false");
 });

 ipcRenderer.on("dataBind", (event, args) =>{
     console.log(args);
 });