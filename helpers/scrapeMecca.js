//scraping script imports
const fragrance = require("../scripts/scraping_scripts/domestic/mecca/fragrance");
const hair = require("../scripts/scraping_scripts/domestic/mecca/hair");
const makeup = require("../scripts/scraping_scripts/domestic/mecca/makeup");
const skincare = require("../scripts/scraping_scripts/domestic/mecca/skincare");
const body = require("../scripts/scraping_scripts/domestic/mecca/body");


//processing script imports
const processDataForBeauty = require("./data_processing/mecca/beauty");

//db update imports
const updateDBEntry = require("./update_db_entry/mecca/beauty");
const logError = require("./logError");


const scrapeMecca = async (start,end,state) =>{
    console.log("scraping started for mecca at:"+Date.now());

    //variable initialization
    let makeupData=[],skincareData=[],hairData=[],fragranceData=[],bodyData=[];

    //scrape each category
    if(!state.mecca.makeup)
    try{
        makeupData = await makeup(start,end);
        console.log(`${makeupData?.length} data items scraped for makeup`);

    }catch(err){
        console.log("There was an error while scraping makeup");
        logError(err);
    }

    if(!state.mecca.makeup&&makeupData?.length==0)
    try{
        makeupData = await makeup(start,end);
        console.log(`${makeupData?.length} data items scraped for makeup`);

        if(makeupData?.length==0){
            state.mecca.makeup = true;
        }
    }catch(err){
        console.log("There was an error while scraping makeup");
        logError(err);
    }

    if(!state.mecca.skincare)
    try{
        skincareData = await skincare(start,end);
        console.log(`${skincareData?.length} data items scraped for skincare`);
    }catch(err){
        console.log("There was an error while scraping skincare");
        logError(err);
    }

    if(!state.mecca.skincare&&skincareData?.length==0)
    try{
        skincareData = await skincare(start,end);
        console.log(`${skincareData?.length} data items scraped for skincare`);

        if(skincareData?.length==0){
            state.mecca.skincare = true;
        }
    }catch(err){
        console.log("There was an error while scraping skincare");
        logError(err);
    }

    if(!state.mecca.hair)
    try{
        hairData = await hair(start,end);
        console.log(`${hairData?.length} data items scraped for hair`);
    }catch(err){
        console.log("There was an error while scraping hair");
        logError(err);
    }

    if(!state.mecca.hair&&hairData?.length==0)
    try{
        hairData = await hair(start,end);
        console.log(`${hairData?.length} data items scraped for hair`);

        if(hairData?.length==0){
            state.mecca.hair = true;
        }
    }catch(err){
        console.log("There was an error while scraping hair");
        logError(err);
    }

    if(!state.mecca.fragrance)
    try{
        fragranceData = await fragrance(start,end);
        console.log(`${fragranceData?.length} data items scraped for fragrance`);
    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }

    if(!state.mecca.fragrance&&fragranceData?.length==0)
    try{
        fragranceData = await fragrance(start,end);
        console.log(`${fragranceData?.length} data items scraped for fragrance`);

        if(fragranceData?.length==0){
            state.mecca.fragrance = true;
        }
    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }

    if(!state.mecca.body)
    try{
        bodyData = await body(start,end);
        console.log(`${bodyData?.length} data items scraped for body`);
    }catch(err){
        console.log("There was an error while scraping body");
        logError(err);
    }

    if(!state.mecca.body&&bodyData?.length==0)
    try{
        bodyData = await body(start,end);
        console.log(`${bodyData?.length} data items scraped for body`);

        if(bodyData?.length==0){
            state.mecca.body = true;
        }
    }catch(err){
        console.log("There was an error while scraping body");
        logError(err);
    }

    //merge data
    makeupData = [...makeupData,...skincareData,...hairData,...fragranceData,...bodyData];

    //process data
    try{
        makeupData = await processDataForBeauty(makeupData);
        console.log(`${makeupData?.length} data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing data");
        logError(err);
    }

    //update db
    try{
        await updateDBEntry(makeupData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for mecca");
    return makeupData?.length==0;
}

module.exports = scrapeMecca;