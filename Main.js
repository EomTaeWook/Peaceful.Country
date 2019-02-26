const reqeust = require('request')
const charset = require('charset')
const iconv = require('iconv-lite')

const option = {
    url : 'https://cafe.naver.com/ArticleList.nhn?search.clubid=10050146&search.boardtype=L&search.menuid=&search.questionTab=A&search.marketBoardTab=D&search.specialmenutype=&userDisplay=50',
    method : 'GET',
    headers:{
        'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
        'Content-Type': 'text/plain;'
    },
    encoding : null
}

reqeust(option, (e,res, body) => {
    let encoding = charset(res.headers, body);
    let resultBody = iconv.decode(body, encoding);
    console.log(resultBody);
});
