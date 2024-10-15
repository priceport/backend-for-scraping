//scraping script imports
const beauty = require("../scripts/scraping_scripts/duty_free/aelia_auckland/beauty");
const spirits = require("../scripts/scraping_scripts/duty_free/aelia_auckland/spirits");
const wine = require("../scripts/scraping_scripts/duty_free/aelia_auckland/wine");

//processing script imports
const processDataForSpirits = require("./data_processing/aelia/spirits");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/aelia/spirits");


const scrapeAelia = async (start,end,state) =>{
    console.log("scraping started for aelia auckland at:"+Date.now());

    //variable initialization
    let spiritsData=[],wineData=[],beautyData=[];

    //scrape each category
    if(!state.auckland.spirits)
    try{
        spiritsData = await spirits(start,end);
        console.log(`${spiritsData?.length} data items scraped for spirits`);

    }catch(err){
        console.log("There was an error while scraping spirits");
        logError(err);
    }


    if(!state.auckland.spirits&&spiritsData?.length==0)
    try{
        spiritsData = await spirits(start,end);
        console.log(`${spiritsData?.length} data items scraped for spirits`);

        if(spiritsData?.length==0){
            state.auckland.spirits = true;
        }
    }catch(err){
        console.log("There was an error while scraping spirits");
        logError(err);
    }

    if(!state.auckland.wine)
    try{
        wineData = await wine(start,end);
        console.log(`${wineData?.length} data items scraped for wine`);

    }catch(err){
        console.log("There was an error while scraping wine");
        logError(err);
    }

    if(!state.auckland.wine&&wineData?.length==0)
    try{
        wineData = await wine(start,end);
        console.log(`${wineData?.length} data items scraped for wine`);

        if(wineData?.length==0){
            state.auckland.wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine");
        logError(err);
    }

    if(!state.auckland.beauty)
    try{
        beautyData = await beauty(start,end);
        console.log(`${beautyData?.length} data items scraped for beauty`);

    }catch(err){
        console.log("There was an error while scraping beauty");
        logError(err);
    }

    if(!state.auckland.beauty&&beautyData?.length==0)
    try{
        beautyData = await beauty(start,end);
        console.log(`${beautyData?.length} data items scraped for beauty`);

        if(beautyData?.length==0){
            state.auckland.beauty = true;
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
        console.log(`${spiritsData.length} data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing data");
        logError(err);
    }

    //update db
    try{
        await updateDBEntry(spiritsData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for aelia auckland");
    return spiritsData?.length==0;
}

module.exports = scrapeAelia;