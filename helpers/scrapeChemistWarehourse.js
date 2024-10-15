//scraping script imports
const bath = require("../scripts/scraping_scripts/domestic/beauty_bliss/bath");
const hair = require("../scripts/scraping_scripts/domestic/beauty_bliss/hair");
const makeup = require("../scripts/scraping_scripts/domestic/beauty_bliss/makeup");
const tools = require("../scripts/scraping_scripts/domestic/beauty_bliss/tools");
const beauty = require("../scripts/scraping_scripts/domestic/chemist_warehourse/beauty");
const cosmetics = require("../scripts/scraping_scripts/domestic/chemist_warehourse/cosmetics");
const fragrance = require("../scripts/scraping_scripts/domestic/chemist_warehourse/fragrance");
const hair_care = require("../scripts/scraping_scripts/domestic/chemist_warehourse/hair_care");
const skin_care = require("../scripts/scraping_scripts/domestic/chemist_warehourse/skin_care");


//processing script imports
const processDataForBeauty = require("./data_processing/chemist_warehouse/beauty");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/chemist_warehouse/beauty");


const scrapeChemistWarehouse = async (start,end) =>{
    console.log("scraping started for chemist warehouse at:"+Date.now());

    //variable initialization
    let data=[];

    //scrape each category
    if(start==1)
    try{
        data = await fragrance(start,end);
        console.log(`${data?.length} data items scraped for fragrance`);
    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }

    if(start==2)
    try{
        data = await beauty(start,end);
        console.log(`${data?.length} data items scraped for beauty`);
    }catch(err){
        console.log("There was an error while scraping beauty");
        logError(err);
    }

    if(start==3)
    try{
        data = await skin_care(start,end);
        console.log(`${data?.length} data items scraped for skincare`);
    }catch(err){
        console.log("There was an error while scraping skincare");
        logError(err);
    }

    if(start==4)
    try{
        data = await cosmetics(start,end);
        console.log(`${data?.length} data items scraped for cosmetics`);
    }catch(err){
        console.log("There was an error while scraping cosmetics");
        logError(err);
    }

    if(start==5)
    try{
        data = await hair_care(start,end);
        console.log(`${data?.length} data items scraped for hair care`);
    }catch(err){
        console.log("There was an error while scraping hair care");
        logError(err);
    }

    //process data
    try{
        data = await processDataForBeauty(data);
        console.log(`${data?.length} data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing data");
        logError(err);
    }

    //update db
    try{
        await updateDBEntry(data);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for chemist warehouse");
    return true;
}

module.exports = scrapeChemistWarehouse;