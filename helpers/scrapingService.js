const scrapeAelia = require("./scrapeAelia");
const scrapeAeliaQueensland = require("./scrapeAeliaQueensland");
const scrapeHeinemannSydney = require("./scrapeHeinemannSydney");
const scrapeLanewayMelbourne = require("./scrapeLanewayMelbourne");

const scrapingService =async ()=>{
   //scraping engine logic
   console.log("scraping");
   await scrapeAelia();
   // await scrapeAeliaQueensland();
   // await scrapeHeinemannSydney();
   // await scrapeLanewayMelbourne();
}

module.exports = scrapingService;