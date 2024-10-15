//scraping script imports
const fragrance = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/fragrance");
const makeup = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/makeup");
const skincare = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/skincare");
const spirits = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/spirits");
const spiritsMultibuy = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/spirits_multibuy");
const wine = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/wine");

//processing script imports
const processDataForSpirits = require("./data_processing/heinemann_sydney/spirits");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/heinemann/spirits");

const scrapeHeinemannSydney = async (start,end,state) =>{
    console.log("scraping started for heinemann sydney at:"+Date.now());

    //variable initialization
    let spiritsData=[],wineData=[],fragranceData=[],makeupData=[],skincareData=[];

    //scrape each category
    if(!state.sydney.spirits)
    try{
        spiritsData = await spirits(start,end);
        console.log(`${spiritsData?.length} data items scraped for spirits`);
    }catch(err){
        console.log("There was an error while scraping spirits");
        logError(err);
    }

    if(!state.sydney.spirits&&spiritsData?.length==0)
    try{
        spiritsData = await spirits(start,end);
        console.log(`${spiritsData?.length} data items scraped for spirits`);

        if(spiritsData?.length==0){
            state.sydney.spirits = true;
        }
    }catch(err){
        console.log("There was an error while scraping spirits");
        logError(err);
    }

    try{
        spiritsData = await spiritsMultibuy(spiritsData);
    }catch(err){
        logError(err);
    }

    if(!state.sydney.wine)
    try{
        wineData = await wine(start,end);
        console.log(`${wineData?.length} data items scraped for wine`);     
    }catch(err){
        console.log("There was an error while scraping wine");
        logError(err);
    }

    if(!state.sydney.wine&&wineData?.length==0)
    try{
        wineData = await wine(start,end);
        console.log(`${wineData?.length} data items scraped for wine`);

        if(wineData?.length==0){
            state.sydney.wine = true;
        }        
    }catch(err){
        console.log("There was an error while scraping wine");
        logError(err);
    }

    try{
        wineData = await spiritsMultibuy(wineData);
    }catch(err){
        logError(err);
    }

    if(!state.sydney.fragrance)
    try{
        fragranceData = await fragrance(start,end);
        console.log(`${fragranceData?.length} data items scraped for fragrance`);
    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }

    if(!state.sydney.fragrance&&fragranceData?.length==0)
    try{
        fragranceData = await fragrance(start,end);
        console.log(`${fragranceData?.length} data items scraped for fragrance`);

        if(fragranceData?.length==0){
            state.sydney.fragrance = true;
        }
    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }

    if(!state.sydney.makeup)
    try{
        makeupData = await makeup(start,end);
        console.log(`${makeupData?.length} data items scraped for makeup`);

    }catch(err){
        console.log("There was an error while scraping makeup");
        logError(err);
    }

    if(!state.sydney.makeup&&makeupData?.length==0)
    try{
        makeupData = await makeup(start,end);
        console.log(`${makeupData?.length} data items scraped for makeup`);

        if(makeupData?.length==0){
            state.sydney.makeup = true;
        }
    }catch(err){
        console.log("There was an error while scraping makeup");
        logError(err);
    }

    if(!state.sydney.skincare)
    try{
        skincareData = await skincare(start,end);
        console.log(`${skincareData?.length} data items scraped for skincare`);
    }catch(err){
        console.log("There was an error while scraping skincare");
        logError(err);
    }

    if(!state.sydney.skincare&&skincareData?.length==0)
    try{
        skincareData = await skincare(start,end);
        console.log(`${skincareData?.length} data items scraped for skincare`);

        if(skincareData?.length==0){
            state.sydney.skincare = true;
        }
    }catch(err){
        console.log("There was an error while scraping skincare");
        logError(err);
    }

    //merge data
    spiritsData = [...spiritsData,...wineData,...fragranceData,...makeupData,...skincareData];

    //process data
    try{
        spiritsData = await processDataForSpirits(spiritsData);
        console.log(`data items proccessed`);
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
    
    console.log("entries updated for heinemann sydney");
    return spiritsData?.length==0;
}

module.exports = scrapeHeinemannSydney;