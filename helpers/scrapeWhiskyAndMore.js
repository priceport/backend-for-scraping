//scraping script imports
const blended_whisky = require("../scripts/scraping_scripts/domestic/whisky_and_more/blended_whisky");
const craft_beer = require("../scripts/scraping_scripts/domestic/whisky_and_more/craft_beer");
const international_whisky = require("../scripts/scraping_scripts/domestic/whisky_and_more/international_whisky");
const single_malt = require("../scripts/scraping_scripts/domestic/whisky_and_more/single_malt");
const wine = require("../scripts/scraping_scripts/domestic/whisky_and_more/wine");

//processing script imports
const processDataForBlendedWhisky = require("./data_processing/whiskyandmore/blended_whisky");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/whiskyandmore/blended_whisky");

const puppeteer = require('puppeteer');

const scrapeWhiskyAndMore = async (start,end,state) =>{
    console.log("scraping started for whisky and more at:"+Date.now());

    const browser = await puppeteer.launch({headless:true,ignoreHTTPSErrors: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});

    //variable initialization
    let whiskyData=[],maltData=[],intlWhiskyData=[],beerData=[],wineData=[];

    //scrape each category
    if(!state.whiskyAndMore.whisky)
    try{
        whiskyData = await blended_whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.whiskyAndMore.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await blended_whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

        if(whiskyData?.length==0){
            state.whiskyAndMore.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.whiskyAndMore.malt)
    try{
        maltData = await single_malt(start,end,browser);
        console.log(`${maltData?.length} data items scraped for malt`);

    }catch(err){
        console.log("There was an error while scraping malt");
        logError(err);
    }

    if(!state.whiskyAndMore.malt&&maltData?.length==0)
    try{
        maltData = await single_malt(start,end,browser);
        console.log(`${maltData?.length} data items scraped for malt`);

        if(maltData?.length==0){
            state.whiskyAndMore.malt = true;
        }
    }catch(err){
        console.log("There was an error while scraping malt");
        logError(err);
    }

    if(!state.whiskyAndMore.intlWhisky)
    try{
        intlWhiskyData = await international_whisky(start,end,browser);
        console.log(`${intlWhiskyData?.length} data items scraped for intl whisky`);
    }catch(err){
        console.log("There was an error while scraping intl whisky");
        logError(err);
    }

    if(!state.whiskyAndMore.intlWhisky&&intlWhiskyData?.length==0)
    try{
        intlWhiskyData = await international_whisky(start,end,browser);
        console.log(`${intlWhiskyData?.length} data items scraped for intl whisky`);

        if(intlWhiskyData?.length==0){
            state.whiskyAndMore.intlWhisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping intl whisky");
        logError(err);
    }

    if(!state.whiskyAndMore.beer)
    try{
        beerData = await craft_beer(start,end,browser);
        console.log(`${beerData?.length} data items scraped for beer`);

    }catch(err){
        console.log("There was an error while scraping beer");
        logError(err);
    }

    if(!state.whiskyAndMore.beer&&beerData?.length==0)
    try{
        beerData = await craft_beer(start,end,browser);
        console.log(`${beerData?.length} data items scraped for beer`);

        if(beerData?.length==0){
            state.whiskyAndMore.beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer");
        logError(err);
    }

    if(!state.whiskyAndMore.wine)
    try{
        wineData = await wine(start,end,browser);
        console.log(`${wineData?.length} data items scraped for wine`);

    }catch(err){
        console.log("There was an error while scraping wine");
        logError(err);
    }

    if(!state.whiskyAndMore.wine&&whiskyData?.length==0)
    try{
        wineData = await wine(start,end,browser);
        console.log(`${wineData?.length} data items scraped for wine`);

        if(whiskyData?.length==0){
            state.whiskyAndMore.wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine");
        logError(err);
    }
  
    //merge data
    whiskyData = [...whiskyData,...maltData,...intlWhiskyData,...beerData,...wineData];

    //process data
    try{
        whiskyData = await processDataForBlendedWhisky(whiskyData);
        console.log(`spirits data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing spirits data");
        logError(err);
    }

    // update db
    try{
        await updateDBEntry(whiskyData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for whisky and more");
    await browser.close();
    return whiskyData?.length==0;
}

module.exports = scrapeWhiskyAndMore;