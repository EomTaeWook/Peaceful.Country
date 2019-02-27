const fs = require("fs");
const CrawlingManager = require("./CrawlingManager.js");
const Config = require("./Model/Config.js")

fs.readFile("./config.json", async (err, data) => {
    if(err) throw err;
    let config = undefined;
    if(!data | data.length == 0){
        config = new Config(3000, [], [], 60);
        await fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
            if(err) throw err;
        });
    }
    else{
        config = JSON.parse(data);
    }
    let crawlingManager = new CrawlingManager(config);
    crawlingManager.Init();
    crawlingManager.RunCrawling();
});
