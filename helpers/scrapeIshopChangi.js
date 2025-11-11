const skin_care = require("../scripts/scraping_scripts/domestic/ishopchangi/skin_care");
const makeup = require("../scripts/scraping_scripts/domestic/ishopchangi/makeup");
const hair_care = require("../scripts/scraping_scripts/domestic/ishopchangi/hair_care");
const fragrance = require("../scripts/scraping_scripts/domestic/ishopchangi/fragrance");
const bath_and_beauty = require("../scripts/scraping_scripts/domestic/ishopchangi/bath_and_beauty");
const computers_and_peripherals = require("../scripts/scraping_scripts/domestic/ishopchangi/computers_and_peripherals");
const mobile_and_smart_devices = require("../scripts/scraping_scripts/domestic/ishopchangi/mobile_and_smart_devices");
const audio_devices = require("../scripts/scraping_scripts/domestic/ishopchangi/audio_devices");
const cameras_and_drones = require("../scripts/scraping_scripts/domestic/ishopchangi/cameras_and_drones");
const logError = require("./logError");
const processDataForBeauty = require("./data_processing/ishopchangi/beauty");
const updateDBEntry = require("./update_db_entry/ishopchangi/beauty");

const scrapeIshopChangi = async (start,end,state,browser) =>{
    console.log("scraping started for ishop changi at:"+Date.now());

    let allData = [], skinCareData = [], makeupData = [], hairCareData = [], fragranceData = [], bathAndBeautyData = [], computersData = [], mobileDevicesData = [], audioDevicesData = [], camerasData = [];

    // Beauty categories
    if(!state.ishopchangi.skin_care)
        try{
            skinCareData = await skin_care(start,end,browser);
            console.log(`${skinCareData?.length} data items scraped for skin care`);
        }
        catch(err){
            console.log("There was an error while scraping skin care");
            logError(err);
        }

    if(!state.ishopchangi.skin_care && skinCareData?.length==0)
        try{
            skinCareData = await skin_care(start,end,browser);
            console.log(`${skinCareData?.length} data items scraped for skin care`);
            if(skinCareData?.length==0){
                state.ishopchangi.skin_care = true;
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

    if(!state.ishopchangi.hair_care && hairCareData?.length==0)
        try{
            hairCareData = await hair_care(start,end,browser);
            console.log(`${hairCareData?.length} data items scraped for hair care`);
            if(hairCareData?.length==0){
                state.ishopchangi.hair_care = true;
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

    if(!state.ishopchangi.fragrance && fragranceData?.length==0)
        try{
            fragranceData = await fragrance(start,end,browser);
            console.log(`${fragranceData?.length} data items scraped for fragrance`);
            if(fragranceData?.length==0){
                state.ishopchangi.fragrance = true;
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

    if(!state.ishopchangi.bath_and_beauty && bathAndBeautyData?.length==0)
        try{
            bathAndBeautyData = await bath_and_beauty(start,end,browser);
            console.log(`${bathAndBeautyData?.length} data items scraped for bath and beauty`);
            if(bathAndBeautyData?.length==0){
                state.ishopchangi.bath_and_beauty = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping bath and beauty");
            logError(err);
        }

    // Electronics categories
    if(!state.ishopchangi.computers_and_peripherals)
        try{
            computersData = await computers_and_peripherals(start,end,browser);
            console.log(`${computersData?.length} data items scraped for computers and peripherals`);
        }
        catch(err){
            console.log("There was an error while scraping computers and peripherals");
            logError(err);
        }

    if(!state.ishopchangi.computers_and_peripherals && computersData?.length==0)
        try{
            computersData = await computers_and_peripherals(start,end,browser);
            console.log(`${computersData?.length} data items scraped for computers and peripherals`);
            if(computersData?.length==0){
                state.ishopchangi.computers_and_peripherals = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping computers and peripherals");
            logError(err);
        }

    if(!state.ishopchangi.mobile_and_smart_devices)
        try{
            mobileDevicesData = await mobile_and_smart_devices(start,end,browser);
            console.log(`${mobileDevicesData?.length} data items scraped for mobile and smart devices`);
        }
        catch(err){
            console.log("There was an error while scraping mobile and smart devices");
            logError(err);
        }

    if(!state.ishopchangi.mobile_and_smart_devices && mobileDevicesData?.length==0)
        try{
            mobileDevicesData = await mobile_and_smart_devices(start,end,browser);
            console.log(`${mobileDevicesData?.length} data items scraped for mobile and smart devices`);
            if(mobileDevicesData?.length==0){
                state.ishopchangi.mobile_and_smart_devices = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping mobile and smart devices");
            logError(err);
        }

    if(!state.ishopchangi.audio_devices)
        try{
            audioDevicesData = await audio_devices(start,end,browser);
            console.log(`${audioDevicesData?.length} data items scraped for audio devices`);
        }
        catch(err){
            console.log("There was an error while scraping audio devices");
            logError(err);
        }

    if(!state.ishopchangi.audio_devices && audioDevicesData?.length==0)
        try{
            audioDevicesData = await audio_devices(start,end,browser);
            console.log(`${audioDevicesData?.length} data items scraped for audio devices`);
            if(audioDevicesData?.length==0){
                state.ishopchangi.audio_devices = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping audio devices");
            logError(err);
        }

    if(!state.ishopchangi.cameras_and_drones)
        try{
            camerasData = await cameras_and_drones(start,end,browser);
            console.log(`${camerasData?.length} data items scraped for cameras and drones`);
        }
        catch(err){
            console.log("There was an error while scraping cameras and drones");
            logError(err);
        }

    if(!state.ishopchangi.cameras_and_drones && camerasData?.length==0)
        try{
            camerasData = await cameras_and_drones(start,end,browser);
            console.log(`${camerasData?.length} data items scraped for cameras and drones`);
            if(camerasData?.length==0){
                state.ishopchangi.cameras_and_drones = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping cameras and drones");
            logError(err);
        }

    //merge all data (beauty + electronics)
    allData = [...skinCareData, ...makeupData, ...hairCareData, ...fragranceData, ...bathAndBeautyData, ...computersData, ...mobileDevicesData, ...audioDevicesData, ...camerasData];

    //process data
    try{
        allData = await processDataForBeauty(allData);
        console.log(`${allData.length} data items processed`);
    }catch(err){
        console.log("There was an error while processing data");
        logError(err);
    }
    
    //update db
    try{
        await updateDBEntry(allData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for ishop changi");
    return allData?.length==0;
}

module.exports = scrapeIshopChangi;