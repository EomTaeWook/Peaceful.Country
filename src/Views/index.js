window.$ = window.jQuery = require("../wwwroot/js/jquery-3.3.1.min.js");
 
 let btnConfig = document.getElementById("btnConfig");
 btnConfig.addEventListener("click", (event)=>{
     event.preventDefault();
     Metro.dialog.open(".dialog");
 });

