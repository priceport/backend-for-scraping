const { connect } = require('puppeteer-real-browser');
const bath = require("../scripts/scraping_scripts/domestic/beauty_bliss/bath");
const hair = require("../scripts/scraping_scripts/domestic/beauty_bliss/hair");
const makeup = require("../scripts/scraping_scripts/domestic/beauty_bliss/makeup");
const skincare = require("../scripts/scraping_scripts/domestic/beauty_bliss/skincare");
const tools = require("../scripts/scraping_scripts/domestic/beauty_bliss/tools");

const processDataForBeauty = require("./data_processing/beauty_bliss/beauty");
const logError = require("./logError");
const updateDBEntry = require("./update_db_entry/beauty_bliss/beauty");
const waitForXTime = require("./waitForXTime");

const scrapeBeautyBliss = async (start,end,state) =>{
    console.log("scraping started for beauty bliss at:"+Date.now());

    const { browser, page } = await connect({
        headless: false,
        turnstile: true,
        disableXvfb: false,
        args: ['--start-maximized'],
        connectOption: {
            defaultViewport: null,
        },
    });

    console.log("beauty bliss: real browser launched with turnstile bypass");

    try {
        console.log("beauty bliss: warming up on homepage to get cf_clearance cookie...");
        await page.goto('https://beautybliss.co.nz', { waitUntil: 'networkidle2', timeout: 90000 });
        await waitForXTime(5000);

        const passed = await page.evaluate(() => !document.title.toLowerCase().includes('just a moment'));
        if (passed) {
            console.log("beauty bliss: Cloudflare passed, cf_clearance cookie set");
        } else {
            console.log("beauty bliss: waiting for Turnstile auto-click...");
            await waitForXTime(15000);
        }
    } catch (err) {
        console.log("beauty bliss: warmup navigation error:", err.message);
    }
    await page.close();

    let makeupData=[],skincareData=[],toolsData=[],hairData=[],bathData=[];

    if(!state.beautyBliss.makeup)
    try{
        makeupData = await makeup(start,end,browser);
        console.log(`${makeupData?.length} data items scraped for makeup`);
    }catch(err){
        console.log("There was an error while scraping makeup");
        logError(err);
    }

    if(!state.beautyBliss.makeup&&makeupData?.length==0)
    try{
        makeupData = await makeup(start,end,browser);
        console.log(`${makeupData?.length} data items scraped for makeup`);

        if(makeupData?.length==0){
            state.beautyBliss.makeup = true;
        }
    }catch(err){
        console.log("There was an error while scraping makeup");
        logError(err);
    }

    if(!state.beautyBliss.skincare)
    try{
        skincareData = await skincare(start,end,browser);
        console.log(`${skincareData?.length} data items scraped for skincare`);
    }catch(err){
        console.log("There was an error while scraping skincare");
        logError(err);
    }

    if(!state.beautyBliss.skincare&&skincareData?.length==0)
    try{
        skincareData = await skincare(start,end,browser);
        console.log(`${skincareData?.length} data items scraped for skincare`);

        if(skincareData?.length==0){
            state.beautyBliss.skincare = true;
        }
    }catch(err){
        console.log("There was an error while scraping skincare");
        logError(err);
    }

    if(!state.beautyBliss.tools)
    try{
        toolsData = await tools(start,end,browser);
        console.log(`${toolsData?.length} data items scraped for tools`);
    }catch(err){
        console.log("There was an error while scraping tools");
        logError(err);
    }

    if(!state.beautyBliss.tools&&toolsData?.length==0)
    try{
        toolsData = await tools(start,end,browser);
        console.log(`${toolsData?.length} data items scraped for tools`);

        if(toolsData?.length==0){
            state.beautyBliss.tools = true;
        }
    }catch(err){
        console.log("There was an error while scraping tools");
        logError(err);
    }

    if(!state.beautyBliss.hair)
    try{
        hairData = await hair(start,end,browser);
        console.log(`${hairData?.length} data items scraped for hair`);
    }catch(err){
        console.log("There was an error while scraping hair");
        logError(err);
    }

    if(!state.beautyBliss.hair&&hairData?.length==0)
    try{
        hairData = await hair(start,end,browser);
        console.log(`${hairData?.length} data items scraped for hair`);

        if(hairData?.length==0){
            state.beautyBliss.hair = true;
        }
    }catch(err){
        console.log("There was an error while scraping hair");
        logError(err);
    }

    if(!state.beautyBliss.bath)
    try{
        bathData = await bath(start,end,browser);
        console.log(`${bathData?.length} data items scraped for bath`);
    }catch(err){
        console.log("There was an error while scraping bath");
        logError(err);
    }

    if(!state.beautyBliss.bath&&bathData?.length==0)
    try{
        bathData = await bath(start,end,browser);
        console.log(`${bathData?.length} data items scraped for bath`);

        if(bathData?.length==0){
            state.beautyBliss.bath = true;
        }
    }catch(err){
        console.log("There was an error while scraping bath");
        logError(err);
    }

    makeupData = [...makeupData,...skincareData,...toolsData,...hairData,...bathData];

    try{
        makeupData = await processDataForBeauty(makeupData);
        console.log(`${makeupData?.length} data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing data");
        logError(err);
    }

    try{
        await updateDBEntry(makeupData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }

    await browser.close();
    
    console.log("entries updated for beauty bliss");
    return makeupData?.length==0;
}

module.exports = scrapeBeautyBliss;
