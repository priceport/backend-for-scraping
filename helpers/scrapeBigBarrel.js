//scraping script imports
const spirits = require("../scripts/scraping_scripts/domestic/bigbarrel/spirits");
const wine = require("../scripts/scraping_scripts/domestic/bigbarrel/wine");
const beer = require("../scripts/scraping_scripts/domestic/bigbarrel/beer");

//processing script imports
const processDataForSpirits = require("./data_processing/bigbarrel/spirits");

//db update imports
const updateDBEntry = require("./update_db_entry/bigbarrel/spirits");
const special = require("../scripts/scraping_scripts/domestic/bigbarrel/special");
const logError = require("./logError");


const scrapeBigBarrel = async (start,end,state) =>{
    console.log("scraping started for big barrel at:"+Date.now());

    //variable initialization
    let spiritsData=[],beerData=[],wineData=[],specialData=[];

    // //scrape each category
    if(!state.bigBarrel.spirits)
    try{
        spiritsData = await spirits(start,end);
        console.log(`${spiritsData?.length} data items scraped for spirits`);
    }catch(err){
        console.log("There was an error while scraping spirits");
        logError(err);
    }

    if(!state.bigBarrel.spirits&&spiritsData?.length==0)
    try{
        spiritsData = await spirits(start,end);
        console.log(`${spiritsData?.length} data items scraped for spirits`);

        if(spiritsData?.length==0){
            state.bigBarrel.spirits = true;
        }
    }catch(err){
        console.log("There was an error while scraping spirits");
        logError(err);
    }

    if(!state.bigBarrel.wine)
    try{
        wineData = await wine(start,end);
        console.log(`${wineData?.length} data items scraped for wine`);
    }catch(err){
        console.log("There was an error while scraping wine");
        logError(err);
    }

    if(!state.bigBarrel.wine&&wineData?.length==0)
    try{
        wineData = await wine(start,end);
        console.log(`${wineData?.length} data items scraped for wine`);

        if(wineData?.length==0){
            state.bigBarrel.wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine");
        logError(err);
    }

    if(!state.bigBarrel.beer)
    try{
        beerData = await beer(start,end);
        console.log(`${beerData?.length} data items scraped for beer`);
    }catch(err){
        console.log("There was an error while scraping beer");
        logError(err);
    }

    if(!state.bigBarrel.beer&&beerData?.length==0)
    try{
        beerData = await beer(start,end);
        console.log(`${beerData?.length} data items scraped for beer`);

        if(beerData?.length==0){
            state.bigBarrel.beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer");
        logError(err);
    }

    if(!state.bigBarrel.special&&specialData?.length==0)
    try{
        specialData = await special(start,end);
        console.log(`${specialData?.length} data items scraped for special`);
    }catch(err){
        console.log("There was an error while scraping special");
        logError(err);
    }

    if(!state.bigBarrel.special)
    try{
        specialData = await special(start,end);
        console.log(`${specialData?.length} data items scraped for special`);

        if(specialData?.length==0){
            state.bigBarrel.special = true;
        }
    }catch(err){
        console.log("There was an error while scraping special");
        logError(err);
    }
  
    //merge data
    spiritsData = [...spiritsData,...beerData,...wineData,...specialData];

    //process data
    try{
        spiritsData = await processDataForSpirits(spiritsData);
        console.log(`${spiritsData.length} data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing spirits data");
        logError(err);
    }

    // update db
    try{
        await updateDBEntry(spiritsData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for big barrel");
    return spiritsData?.length==0;
}

module.exports = scrapeBigBarrel;