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
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

//processing script imports
const processDataForBeauty = require("./data_processing/chemist_warehouse/beauty");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/chemist_warehouse/beauty");

puppeteer.use(StealthPlugin());

const scrapeChemistWarehouse = async (start,end,state) =>{
    console.log("scraping started for chemist warehouse at:"+Date.now());

    //variable initialization
    let fragranceData=[],beautyData=[],skincareData=[],cosmeticsData=[],haircareData=[];

    const browser = await puppeteer.launch({headless:true ,args: ['--no-sandbox', '--disable-setuid-sandbox']});

    //scrape each category
    if(!state.chemistWarehouse.fragrance)
    try{
        fragranceData = await fragrance(start,end,browser);
        console.log(`${fragranceData?.length} data items scraped for fragrance`);
    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }

    if(!state.chemistWarehouse.fragrance&&fragranceData?.length==0)
    try{
        fragranceData = await fragrance(start,end,browser);
        console.log(`${fragranceData?.length} data items scraped for fragrance`);

        if(fragranceData?.length==0) state.chemistWarehouse.fragrance=true;
    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }

    if(!state.chemistWarehouse.beauty)
    try{
        beautyData = await beauty(start,end,browser);
        console.log(`${beautyData?.length} data items scraped for beauty`);
    }catch(err){
        console.log("There was an error while scraping beauty");
        logError(err);
    }

    if(!state.chemistWarehouse.beauty&&beautyData?.length==0)
    try{
        beautyData = await beauty(start,end,browser);
        console.log(`${beautyData?.length} data items scraped for beauty`);

        if(beautyData?.length==0) state.chemistWarehouse.beauty=true;
    }catch(err){
        console.log("There was an error while scraping beauty");
        logError(err);
    }

    if(!state.chemistWarehouse.skincare)
    try{
        skincareData = await skin_care(start,end,browser);
        console.log(`${skincareData?.length} data items scraped for skincare`);
    }catch(err){
        console.log("There was an error while scraping skincare");
        logError(err);
    }

    if(!state.chemistWarehouse.skincare&&skincareData?.length==0)
    try{
        skincareData = await skin_care(start,end,browser);
        console.log(`${skincareData?.length} data items scraped for skincare`);

        if(skincareData?.length==0) state.chemistWarehouse.skincare=true;
    }catch(err){
        console.log("There was an error while scraping skincare");
        logError(err);
    }

    if(!state.chemistWarehouse.cosmetics)
    try{
        cosmeticsData = await cosmetics(start,end,browser);
        console.log(`${cosmeticsData?.length} data items scraped for cosmetics`);
    }catch(err){
        console.log("There was an error while scraping cosmetics");
        logError(err);
    }

    if(!state.chemistWarehouse.cosmetics&&cosmeticsData?.length==0)
    try{
        cosmeticsData = await cosmetics(start,end,browser);
        console.log(`${cosmeticsData?.length} data items scraped for cosmetics`);

        if(cosmeticsData?.length==0) state.chemistWarehouse.cosmetics=true;
    }catch(err){
        console.log("There was an error while scraping cosmetics");
        logError(err);
    }

    if(!state.chemistWarehouse.haircare)
    try{
        haircareData = await hair_care(start,end,browser);
        console.log(`${haircareData?.length} data items scraped for hair care`);
    }catch(err){
        console.log("There was an error while scraping hair care");
        logError(err);
    }

    if(!state.chemistWarehouse.haircare&&haircareData?.length==0)
    try{
        haircareData = await hair_care(start,end,browser);
        console.log(`${haircareData?.length} data items scraped for hair care`);

        if(haircareData?.length==0) state.chemistWarehouse.haircare=true;
    }catch(err){
        console.log("There was an error while scraping hair care");
        logError(err);
    }
    
    fragranceData=[...fragranceData,...beautyData,...skincareData,...cosmeticsData,...haircareData];

    //process data
    try{
        fragranceData = await processDataForBeauty(fragranceData);
        console.log(`${fragranceData?.length} data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing data");
        logError(err);
    }

    //update db
    try{
        await updateDBEntry(fragranceData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }

    await browser.close();
    
    console.log("entries updated for chemist warehouse");

    return fragranceData?.length==0;
}

module.exports = scrapeChemistWarehouse;