//scraping script imports
const beauty = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/beauty");
const spirits = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/spirits");

//processing script imports
const processDataForBeauty = require("./data_processing/lotte_brisbane/beauty");
const processDataForSpirits = require("./data_processing/lotte_brisbane/spirits");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/lotte_brisbane/spirits");

const scrapeLotteBrisbane = async (start,end,state,browser) =>{
    console.log("scraping started for lotte brisbane at:"+Date.now());

    //variable initialization
    let spiritsData=[],beautyData=[];

    //scrape each category
    if(!state.brisbane.spirits)
    try{
        spiritsData = await spirits(start,end,browser);
        console.log(`${spiritsData?.length} data items scraped for spirits`);

    }catch(err){
        console.log("There was an error while scraping spirits");
        logError(err);
    }

    if(!state.brisbane.spirits&&spiritsData?.length==0)
    try{
        spiritsData = await spirits(start,end,browser);
        console.log(`${spiritsData?.length} data items scraped for spirits`);

        if(spiritsData?.length==0){
            state.brisbane.spirits = true;
        }
    }catch(err){
        console.log("There was an error while scraping spirits");
        logError(err);
    }

    if(!state.brisbane.beauty)
    try{
        beautyData = await beauty(start,end,browser);
        console.log(`${beautyData?.length} data items scraped for beauty`);

    }catch(err){
        console.log("There was an error while scraping beauty");
        logError(err);
    }

    if(!state.brisbane.beauty&&beautyData?.length==0)
    try{
        beautyData = await beauty(start,end,browser);
        console.log(`${beautyData?.length} data items scraped for beauty`);

        if(beautyData?.length==0){
            state.brisbane.beauty = true;
        }
    }catch(err){
        console.log("There was an error while scraping beauty");
        logError(err);
    }

    //process data
    try{
        spiritsData = await processDataForSpirits(spiritsData);
        console.log(`spirits data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing spirits data");
        logError(err);
    }

    try{
        beautyData = await processDataForBeauty(beautyData);
        console.log(`beauty data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing beauty data");
        logError(err);
    }

    //merge data
    spiritsData = [...spiritsData,...beautyData];

    //update db
    try{
        await updateDBEntry(spiritsData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for lotte brisbane");
    return spiritsData?.length==0;
}

module.exports = scrapeLotteBrisbane;