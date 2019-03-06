"use strict"

window.$ = window.jQuery = require("../wwwroot/js/jquery-3.3.1.min.js");
const ipcRenderer = require("electron").ipcRenderer;
const Config = require("../Models/Config.js");
const Shell = require("electron").shell;

 let btnConfig = document.getElementById("btnConfig");
 btnConfig.addEventListener("click", (event)=>{
     event.preventDefault();
     btnStop.click();
     ipcRenderer.send("getConfig");
 });

 let page = 1;
 let reqeustData = undefined;


let btnGithub = document.getElementById("btnGithub");
btnGithub.addEventListener("click", (event) =>{
    event.preventDefault();
    Shell.openExternal(`https://github.com/EomTaeWook/Peaceful.Country`);
});

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
        reqeustData = undefined;
     }
 });

let btnEmailAdd = document.getElementById("btnEmailAdd");
btnEmailAdd.addEventListener("click", (event)=>{
    event.preventDefault();
    let input = document.getElementById("txtEmail").value;
    if(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g.test(input))
    {
        CreateEmail(input);
    }
    else
    {
        Metro.dialog.create({
            title: "잘못된 Email 형식입니다."
        });
    }
});

let btnEmailDelete = document.getElementById("btnEmailDelete");
btnEmailDelete.addEventListener("click", (event)=>{
    event.preventDefault();
    let email = document.getElementById("emails");
    let item = document.querySelector(".current");
    if(item)
    {
        email.removeChild(item);
    }
});

let btnSave = document.getElementById("btnSave");
btnSave.addEventListener("click", (event)=>{
    event.preventDefault();

    let keywordsHtml = document.getElementById("keywoards");
    if(keywordsHtml.value === undefined || keywordsHtml.value === "")
    {
        Metro.dialog.create({
            title: "키워드는 한개 이상 입력하세요."
        });
    }
    let keywords = keywordsHtml.value.split(",");
    let perDay = document.getElementById("numPerDay").value;
    let alertPeriod = document.getElementById("numAlertPeriod").value;
    let emailHtml = document.getElementById("emails");
    let emailDatas= emailHtml.querySelectorAll(".caption");
    let emails = [];
    emailDatas.forEach(item =>{
        emails.push(item.innerHTML);
    });
    let isAlert = $("#selIsAlert").data("select").val();
    let config = new Config(-1, keywords, emails, perDay, alertPeriod, 0, false,  isAlert);
    //console.log(config);
    ipcRenderer.send("setConfig", config);
    Metro.dialog.close(".dialog");
});

ipcRenderer.on("getConfig",(event, args)=>{
    //console.log(args);
    let keywords = document.getElementById("keywoards");
    keywords.innerHTML = args.keywords.toString();
    let perDay = document.getElementById("numPerDay");
    perDay.value = args.perDay;
    let alertPeriod = document.getElementById("numAlertPeriod");
    alertPeriod.value = args.alertPeriod;
    $("#selIsAlert").data("select").val(args.isAlert);

    let email = document.getElementById("emails");
    email.innerHTML = "";

    args.emails.forEach(CreateEmail);
    Metro.dialog.open(".dialog");
});



 ipcRenderer.on("dataBind", (event, args) =>{
    //console.log(args);
    let pageHtml = document.getElementsByClassName("pagination")[0];
    pageHtml.innerHTML = "";
    CreatePage(args, pageHtml);

    let body = document.getElementById("body");
    body.innerHTML = "";
    //console.log(`datas Count : ${args.datas.length}`);
    for(let i=args.datas.length - 1; i>=0; --i)
    {
        let row = body.insertRow(body.rows.length);
        let index = row.insertCell(0);
        index.innerHTML = args.datas[i].index;
        let title = row.insertCell(1);
        title.innerHTML = args.datas[i].title;
        let date = row.insertCell(2);
        date.innerHTML = new Date(args.datas[i].date).toLocaleDateString();

        let move = row.insertCell(3);
        let a = document.createElement("a");
        a.href = "#";
        a.onclick = ()=>{
            window.open(`https://cafe.naver.com/joonggonara/${args.datas[i].index}`, "_blank", "width=600 height = 600");
            return false;
        }
        a.innerText = "이동";
        move.appendChild(a);
    }
 });

function CreateEmail(value)
{
    let email = document.getElementById("emails");
    let li = document.createElement("li");
    li.className = "node";
    li.dataset.caption = value;
    let div = document.createElement("div");
    div.className = "data";
    let divCaption = document.createElement("div");
    divCaption.className = "caption";
    divCaption.innerHTML = value;
    div.appendChild(divCaption);
    li.appendChild(div);
    email.appendChild(li);
}

 function SelectPage(item)
 {
     page = item;
     ipcRenderer.send("dataBind", page);
     return false;
 }
 function CreatePage(pageInfo, parentHtml)
 {
     if(pageInfo.currentPage > 10)
     {
        let prev = document.createElement("a");
        prev.innerHTML = "&laquo;";
        prev.onclick = () =>{
            SelectPage(pageInfo.MinPage - 10);
        }
        parentHtml.appendChild(prev);
     }
     for(let i=pageInfo.MinPage; i<pageInfo.MaxPage; ++i)
     {
        let a = document.createElement("a");
        if(i === pageInfo.currentPage)
        {
            a.className = "active";
        }
        a.onclick = ()=>{
            SelectPage(i);
        };
        a.innerHTML = `${i}`;
        parentHtml.appendChild(a);
     }
     if(pageInfo.MaxPage < pageInfo.PageCount)
     {
        let next = document.createElement("a");
        next.innerHTML = "&raquo;";
        next.onclick = () =>{
            SelectPage(pageInfo.MaxPage);
        }
        parentHtml.appendChild(next);
     }
 }