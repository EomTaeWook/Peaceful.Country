const reqeust = require('request')
const charset = require('charset')
const iconv = require('iconv-lite')

const option = {
    url : 'https://cafe.naver.com/ArticleList.nhn?search.clubid=10050146&userDisplay=50&search.boardtype=L&search.specialmenutype=&search.questionTab=A&search.totalCount=501&search.page=1',
    method : 'GET',
    headers:{
        'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
        'Content-Type': 'text/plain;'
    },
    encoding : null
}


reqeust(option, (e,res, body) => {
    if(e != null)
    {
        throw e;
    }    

    let encoding = charset(res.headers, body);
    let resultBody = iconv.decode(body, encoding);
    let regex = new RegExp("<a[^>]*>([\\t\\s\\S]+?)<\/*a>", "g");
    let contentList = [];
    //console.log(resultBody);
    while(true)
    {
        contentList = regex.exec(resultBody);
        if(contentList)
        {
            if(contentList.length > 1)
            {
                //console.log(contentList[0]);
                if(contentList[0].includes("cmt") || contentList[0].includes("m-tcol-c") || contentList[0].includes("article_noti")){
                    continue;
                }
                if(contentList[0].includes("article"))
                {
                    //console.log(contentList[0]);
                    let index = /(articleid=)(.*?)([&;'])\b/.exec(contentList[0]);
                    let content = /\S.*/.exec(contentList[1]);
                    console.log(index[2] + " : " + content[0]);
                }
            }
        }
        else{
            break;
        }
    }
});
