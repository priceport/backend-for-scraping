const skin_care = require("../scripts/scraping_scripts/domestic/ishopchangi/skin_care");
const makeup = require("../scripts/scraping_scripts/domestic/ishopchangi/makeup");
const hair_care = require("../scripts/scraping_scripts/domestic/ishopchangi/hair_care");
const fragrance = require("../scripts/scraping_scripts/domestic/ishopchangi/fragrance");
const bath_and_beauty = require("../scripts/scraping_scripts/domestic/ishopchangi/bath_and_beauty");
const logError = require("./logError");
const processDataForBeauty = require("./data_processing/ishopchangi/beauty");
const updateDBEntry = require("./update_db_entry/ishopchangi/beauty");

const scrapeIshopChangi = async (start,end,state,browser) =>{
    console.log("scraping started for ishop changi at:"+Date.now());

    let skinCareData = [], makeupData = [], hairCareData = [], fragranceData = [], bathAndBeautyData = [];
    let beautyData = [];

    if(!state.ishopchangi.skin_care)
        try{
            skinCareData = await skin_care(start,end,browser);
            console.log(`${skinCareData?.length} data items scraped for skin care`);
        }
        catch(err){
            console.log("There was an error while scraping skin care");
            logError(err);
        }

    if(!state.ishopchangi.skin_care&&skinCareData?.length==0)
        try{
            skinCareData = await skin_care(start,end,browser);
            console.log(`${skinCareData?.length} data items scraped for skin care`);

                if(baijiuData?.length==0){
                    state.auckland.baijiu = true;
                }
            }
            catch(err){
                console.log("There was an error while scraping skin care");
                logError(err);
            }    

    if(!state.ishopchangi.makeup)
        try{
            makeupData = await makeup(start,end,browser);
            console.log(`${makeupData?.length} data items scraped for makeup`);


            if(skinCareData?.length==0) {
                state.ishopchangi.skin_care=true;
            }
        }
        catch(err){
            console.log("There was an error while scraping makeup");
            logError(err);
        }

    if(!state.ishopchangi.makeup&&makeupData?.length==0)
        try{
            makeupData = await makeup(start,end,browser);
            console.log(`${makeupData?.length} data items scraped for makeup`);
            
            if(makeupData?.length==0) {
                state.ishopchangi.makeup=true;
            }
        }
        catch(err){
            console.log("There was an error while scraping makeup");
            logError(err);
        }    

    if(!state.ishopchangi.hair_care)
        try{
            hairCareData = await hair_care(start,end,browser);
            console.log(`${hairCareData?.length} data items scraped for hair care`);
        }
        catch(err){
            console.log("There was an error while scraping hair care");
            logError(err);
        }


    if(!state.ishopchangi.hair_care&&hairCareData?.length==0)
        try{
            hairCareData = await hair_care(start,end,browser);
            console.log(`${hairCareData?.length} data items scraped for hair care`);
            
            if(hairCareData?.length==0) {
                state.ishopchangi.hair_care=true;
            }
        }
        catch(err){
            console.log("There was an error while scraping hair care");
            logError(err);
        }

    if(!state.ishopchangi.fragrance)
        try{
            fragranceData = await fragrance(start,end,browser);
            console.log(`${fragranceData?.length} data items scraped for fragrance`);
        }
        catch(err){
            console.log("There was an error while scraping fragrance");
            logError(err);
        }

    if(!state.ishopchangi.fragrance)
        try{
            fragranceData = await fragrance(start,end,browser);
            console.log(`${fragranceData?.length} data items scraped for fragrance`);

            if(fragranceData?.length==0) {
                state.ishopchangi.fragrance=true;
            }
        }
        catch(err){
            console.log("There was an error while scraping fragrance");
            logError(err);
        }
    
    if(!state.ishopchangi.bath_and_beauty)
        try{
            bathAndBeautyData = await bath_and_beauty(start,end,browser);
            console.log(`${bathAndBeautyData?.length} data items scraped for bath and beauty`);
        }
        catch(err){
            console.log("There was an error while scraping bath and beauty");
            logError(err);
        }

    if(!state.ishopchangi.bath_and_beauty)
        try{
            bathAndBeautyData = await bath_and_beauty(start,end,browser);
            console.log(`${bathAndBeautyData?.length} data items scraped for bath and beauty`);
            
            if(bathAndBeautyData?.length==0) {
                state.ishopchangi.bath_and_beauty=true;
            }
        }
        catch(err){
            console.log("There was an error while scraping bath and beauty");
            logError(err);
        }

    //merge data
    beautyData = [...skinCareData, ...makeupData, ...hairCareData, ...fragranceData, ...bathAndBeautyData];

    //process data
    try{
        beautyData = await processDataForBeauty(beautyData);
        console.log(`${beautyData.length} data items processed`);
    }catch(err){
        console.log("There was an error while processing data");
        logError(err);
    }
    
    //update db
    try{
        await updateDBEntry(beautyData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for ishop changi");
    return beautyData?.length==0;
}

module.exports = scrapeIshopChangi;