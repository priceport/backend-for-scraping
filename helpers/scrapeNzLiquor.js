//scraping script imports
const spirits = require("../scripts/scraping_scripts/domestic/nz_liquor/spirits");
const wine = require("../scripts/scraping_scripts/domestic/nz_liquor/wine");
const beer = require("../scripts/scraping_scripts/domestic/nz_liquor/beer");

//processing script imports
const processDataForSpirits = require("./data_processing/nzliquor/spirits");

//db update imports
const updateDBEntry = require("./update_db_entry/nzliquor/spirits");
const logError = require("./logError");


const scrapeNzLiquor = async (start,end,state) =>{
    console.log("scraping started for nz liquor at:"+Date.now());

    //variable initialization
    let spiritsData=[],beerData=[],wineData=[];

    // //scrape each category
    if(!state.nzLiquor.spirits)
    try{
        spiritsData = await spirits(start,end);
        console.log(`${spiritsData?.length} data items scraped for spirits`);
    }catch(err){
        console.log("There was an error while scraping spirits");
        logError(err);
    }

    if(!state.nzLiquor.spirits&&spiritsData?.length==0)
    try{
        spiritsData = await spirits(start,end);
        console.log(`${spiritsData?.length} data items scraped for spirits`);

        if(spiritsData?.length==0){
            state.nzLiquor.spirits = true;
        }
    }catch(err){
        console.log("There was an error while scraping spirits");
        logError(err);
    }

    if(!state.nzLiquor.beer)
    try{
        beerData = await beer(start,end);
        console.log(`${beerData?.length} data items scraped for beer`);
    }catch(err){
        console.log("There was an error while scraping beer");
        logError(err);
    }

    if(!state.nzLiquor.beer&&beerData?.length==0)
    try{
        beerData = await beer(start,end);
        console.log(`${beerData?.length} data items scraped for beer`);

        if(beerData?.length==0){
            state.nzLiquor.beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer");
        logError(err);
    }

    if(!state.nzLiquor.wine)
    try{
        wineData = await wine(start,end);
        console.log(`${wineData?.length} data items scraped for wine`);
    }catch(err){
        console.log("There was an error while scraping wine");
        logError(err);
    }

    if(!state.nzLiquor.wine&&wineData?.length==0)
    try{
        wineData = await wine(start,end);
        console.log(`${wineData?.length} data items scraped for wine`);

        if(wineData?.length==0){
            state.nzLiquor.wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine");
        logError(err);
    }
  
    //merge data
    spiritsData = [...spiritsData,...beerData,...wineData];

    //process data
    try{
        spiritsData = await processDataForSpirits(spiritsData);
        console.log(`${spiritsData?.length} data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing data");
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
    
    console.log("entries updated for nz liquor");
    return spiritsData?.length==0;
}

module.exports = scrapeNzLiquor;