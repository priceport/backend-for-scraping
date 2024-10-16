//scraping script imports
const beauty = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/beauty");
const spirits = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/spirits");
const wine = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/wine");

//processing script imports
const processDataForSpirits = require("./data_processing/aelia/spirits");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/aelia_christchurch/spirits");


const scrapeAeliaChristchurch = async (start,end,state,browser) =>{
    console.log("scraping started for aelia christchurch at:"+Date.now());

    //variable initialization
    let spiritsData=[],wineData=[],beautyData=[];

    //scrape each category
    if(!state.christchurch.spirits)
    try{
        spiritsData = await spirits(start,end,browser);
        console.log(`${spiritsData?.length} data items scraped for spirits`);

    }catch(err){
        console.log("There was an error while scraping spirits");
        logError(err);
    }

    if(!state.christchurch.spirits&&spiritsData?.length==0)
    try{
        spiritsData = await spirits(start,end,browser);
        console.log(`${spiritsData?.length} data items scraped for spirits`);

        if(spiritsData?.length==0){
            state.christchurch.spirits = true;
        }
    }catch(err){
        console.log("There was an error while scraping spirits");
        logError(err);
    }

    if(!state.christchurch.wine)
    try{
        wineData = await wine(start,end,browser);
        console.log(`${wineData?.length} data items scraped for wine`);

    }catch(err){
        console.log("There was an error while scraping wine");
        logError(err);
    }

    if(!state.christchurch.wine&&wineData?.length==0)
    try{
        wineData = await wine(start,end,browser);
        console.log(`${wineData?.length} data items scraped for wine`);

        if(wineData?.length==0){
            state.christchurch.wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine");
        logError(err);
    }

    if(!state.christchurch.beauty)
    try{
        beautyData = await beauty(start,end,browser);
        console.log(`${beautyData?.length} data items scraped for beauty`);

    }catch(err){
        console.log("There was an error while scraping beauty");
        logError(err);
    }

    if(!state.christchurch.beauty&&beautyData?.length==0)
    try{
        beautyData = await beauty(start,end,browser);
        console.log(`${beautyData?.length} data items scraped for beauty`);

        if(beautyData?.length==0){
            state.christchurch.beauty = true;
        }
    }catch(err){
        console.log("There was an error while scraping beauty");
        logError(err);
    }

    //merge data
    spiritsData = [...spiritsData,...wineData,...beautyData];

    //process data
    try{
        spiritsData = await processDataForSpirits(spiritsData);
        console.log(`data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing data");
        logError(err);
    }

    try{
        await updateDBEntry(spiritsData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for aelia christchurch");
    return spiritsData?.length==0;
}

module.exports = scrapeAeliaChristchurch;