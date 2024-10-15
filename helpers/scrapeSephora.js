//scraping script imports
const bath = require("../scripts/scraping_scripts/domestic/sephora/bath");
const clean = require("../scripts/scraping_scripts/domestic/sephora/clean");
const fragrance = require("../scripts/scraping_scripts/domestic/sephora/fragrance");
const hair = require("../scripts/scraping_scripts/domestic/sephora/hair");
const makeup = require("../scripts/scraping_scripts/domestic/sephora/makeup");
const skincare = require("../scripts/scraping_scripts/domestic/sephora/skincare");
const tools = require("../scripts/scraping_scripts/domestic/sephora/tools");

//processing script imports
const processDataForBeauty = require("./data_processing/sephora/beauty");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/sephora/beauty");


const scrapeSephora = async (start,end,state) =>{
    console.log("scraping started for sephora at:"+Date.now());

    //variable initialization
    let makeupData=[],skincareData=[],toolsData=[],hairData=[],fragranceData=[],cleanData=[],bathData=[];

    //scrape each category
    if(!state.sephora.makeup)
    try{
        makeupData = await makeup(start,end);
        console.log(`${makeupData?.length} data items scraped for makeup`);

    }catch(err){
        console.log("There was an error while scraping makeup");
        logError(err);
    }

    if(!state.sephora.makeup&&makeupData?.length==0)
    try{
        makeupData = await makeup(start,end);
        console.log(`${makeupData?.length} data items scraped for makeup`);

        if(makeupData?.length==0){
            state.sephora.makeup = true;
        }
    }catch(err){
        console.log("There was an error while scraping makeup");
        logError(err);
    }

    if(!state.sephora.skincare)
    try{
        skincareData = await skincare(start,end);
        console.log(`${skincareData?.length} data items scraped for skincare`);
    }catch(err){
        console.log("There was an error while scraping skincare");
        logError(err);
    }

    if(!state.sephora.skincare&&skincareData?.length==0)
    try{
        skincareData = await skincare(start,end);
        console.log(`${skincareData?.length} data items scraped for skincare`);

        if(skincareData?.length==0){
            state.sephora.skincare = true;
        }
    }catch(err){
        console.log("There was an error while scraping skincare");
        logError(err);
    }

    if(!state.sephora.tools)
    try{
        toolsData = await tools(start,end);
        console.log(`${toolsData?.length} data items scraped for tools`);
    }catch(err){
        console.log("There was an error while scraping tools");
        logError(err);
    }

    if(!state.sephora.tools&&toolsData?.length==0)
    try{
        toolsData = await tools(start,end);
        console.log(`${toolsData?.length} data items scraped for tools`);

        if(toolsData?.length==0){
            state.sephora.tools = true;
        }
    }catch(err){
        console.log("There was an error while scraping tools");
        logError(err);
    }

    if(!state.sephora.hair)
    try{
        hairData = await hair(start,end);
        console.log(`${hairData?.length} data items scraped for hair`);
    }catch(err){
        console.log("There was an error while scraping hair");
        logError(err);
    }

    if(!state.sephora.hair&&hairData?.length==0)
    try{
        hairData = await hair(start,end);
        console.log(`${hairData?.length} data items scraped for hair`);

        if(hairData?.length==0){
            state.sephora.hair = true;
        }
    }catch(err){
        console.log("There was an error while scraping hair");
        logError(err);
    }

    if(!state.sephora.fragrance)
    try{
        fragranceData = await fragrance(start,end);
        console.log(`${fragranceData?.length} data items scraped for fragrance`);
    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }

    if(!state.sephora.fragrance&&fragranceData?.length==0)
    try{
        fragranceData = await fragrance(start,end);
        console.log(`${fragranceData?.length} data items scraped for fragrance`);

        if(fragranceData?.length==0){
            state.sephora.fragrance = true;
        }
    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }

    if(!state.sephora.clean)
    try{
        cleanData = await clean(start,end);
        console.log(`${cleanData?.length} data items scraped for clean`);
    }catch(err){
        console.log("There was an error while scraping clean");
        logError(err);
    }

    if(!state.sephora.clean&&cleanData?.length==0)
    try{
        cleanData = await clean(start,end);
        console.log(`${cleanData?.length} data items scraped for clean`);

        if(cleanData?.length==0){
            state.sephora.clean = true;
        }
    }catch(err){
        console.log("There was an error while scraping clean");
        logError(err);
    }

    if(!state.sephora.bath)
    try{
        bathData = await bath(start,end);
        console.log(`${bathData?.length} data items scraped for bath`);
    }catch(err){
        console.log("There was an error while scraping bath");
        logError(err);
    }

    if(!state.sephora.bath&&bathData?.length==0)
    try{
        bathData = await bath(start,end);
        console.log(`${bathData?.length} data items scraped for bath`);

        if(bathData?.length==0){
            state.sephora.bath = true;
        }
    }catch(err){
        console.log("There was an error while scraping bath");
        logError(err);
    }

    //merge data
    makeupData = [...makeupData,...skincareData,...toolsData,...hairData,...fragranceData,...cleanData,...bathData];

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
    
    console.log("entries updated for sephora");
    return makeupData?.length==0;
}

module.exports = scrapeSephora;