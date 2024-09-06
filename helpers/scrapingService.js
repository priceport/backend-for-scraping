const scrapeAelia = require("./scrapeAelia");

const scrapingService =async ()=>{
   //scraping engine logic
   console.log("scraping");
   await scrapeAelia();
}

module.exports = scrapingService;