const { connect } = require('puppeteer-real-browser');

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
const waitForXTime = require("./waitForXTime");

//db update imports
const updateDBEntry = require("./update_db_entry/sephora/beauty");

const HOMEPAGE = 'https://www.sephora.nz';
const WARMUP_ATTEMPTS = 3;

/** Optional residential proxy — Akamai often Access-Denies bare EC2/datacenter IPs. */
const getSephoraProxy = () => {
    const host = process.env.SEPHORA_PROXY_HOST;
    const port = process.env.SEPHORA_PROXY_PORT;
    if (!host || !port) return undefined;
    return {
        host,
        port,
        username: process.env.SEPHORA_PROXY_USERNAME,
        password: process.env.SEPHORA_PROXY_PASSWORD,
    };
};

const isSephoraBlocked = async (page) => {
    try {
        const title = (await page.title()).toLowerCase();
        return (
            title.includes('access denied') ||
            title.includes('just a moment') ||
            title.includes('attention required')
        );
    } catch {
        return true;
    }
};

const scrapeSephora = async (start,end,state) =>{
    console.log("scraping started for sephora at:"+Date.now());

    // Akamai blocks normal puppeteer/stealth; real browser + headed mode is required.
    // On Linux servers, keep disableXvfb false and install xvfb.
    // If title stays "Access Denied" on EC2, set SEPHORA_PROXY_HOST/PORT
    // (and optional USERNAME/PASSWORD) to a residential proxy.
    const showBrowser = process.env.SEPHORA_SHOW_BROWSER === '1';
    const proxy = getSephoraProxy();
    const args = [
        '--start-maximized',
        '--no-sandbox',
        '--disable-setuid-sandbox',
    ];
    if (process.platform === 'darwin') {
        args.push('--window-position=-2400,-2400', '--window-size=1920,1080');
    }

    const connectOptions = {
        headless: false,
        turnstile: true,
        disableXvfb: showBrowser,
        args,
        connectOption: { defaultViewport: null },
    };
    if (proxy) {
        connectOptions.proxy = proxy;
        console.log(`sephora: using proxy ${proxy.host}:${proxy.port}`);
    }

    const { browser, page } = await connect(connectOptions);

    console.log("sephora: real browser launched");

    try {
        console.log("sephora: warming up on homepage...");
        let passed = false;
        for (let attempt = 1; attempt <= WARMUP_ATTEMPTS; attempt++) {
            await page.goto(HOMEPAGE, { waitUntil: 'domcontentloaded', timeout: 90000 });
            await waitForXTime(8000);
            const title = await page.title();
            if (!(await isSephoraBlocked(page))) {
                console.log("sephora: warmup ok, title=", title);
                passed = true;
                break;
            }
            console.log(`sephora: blocked after warmup attempt ${attempt}/${WARMUP_ATTEMPTS}, title=`, title);
            await waitForXTime(5000);
        }

        if (!passed) {
            console.log(
                "sephora: Akamai Access Denied after retries. EC2/datacenter IPs are often blocked — set SEPHORA_PROXY_HOST and SEPHORA_PROXY_PORT (optional SEPHORA_PROXY_USERNAME / SEPHORA_PROXY_PASSWORD)."
            );
            try { await page.close(); } catch (_) {}
            await browser.close();
            return true;
        }
    } catch (err) {
        console.log("sephora: warmup error:", err.message);
        try { await page.close(); } catch (_) {}
        await browser.close();
        return true;
    }

    // Keep at least one tab open. Closing the last tab under
    // puppeteer-real-browser + Xvfb often kills Chrome
    // ("Failed to open a new tab" / "Target closed").
    try {
        await page.goto('about:blank');
    } catch (_) {}

    //variable initialization
    let makeupData=[],skincareData=[],toolsData=[],hairData=[],fragranceData=[],cleanData=[],bathData=[];

    //scrape each category
    if(!state.sephora.makeup)
    try{
        makeupData = await makeup(start,end,browser);
        console.log(`${makeupData?.length} data items scraped for makeup`);

    }catch(err){
        console.log("There was an error while scraping makeup");
        logError(err);
    }

    if(!state.sephora.makeup&&makeupData?.length==0)
    try{
        makeupData = await makeup(start,end,browser);
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
        skincareData = await skincare(start,end,browser);
        console.log(`${skincareData?.length} data items scraped for skincare`);
    }catch(err){
        console.log("There was an error while scraping skincare");
        logError(err);
    }

    if(!state.sephora.skincare&&skincareData?.length==0)
    try{
        skincareData = await skincare(start,end,browser);
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
        toolsData = await tools(start,end,browser);
        console.log(`${toolsData?.length} data items scraped for tools`);
    }catch(err){
        console.log("There was an error while scraping tools");
        logError(err);
    }

    if(!state.sephora.tools&&toolsData?.length==0)
    try{
        toolsData = await tools(start,end,browser);
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
        hairData = await hair(start,end,browser);
        console.log(`${hairData?.length} data items scraped for hair`);
    }catch(err){
        console.log("There was an error while scraping hair");
        logError(err);
    }

    if(!state.sephora.hair&&hairData?.length==0)
    try{
        hairData = await hair(start,end,browser);
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
        fragranceData = await fragrance(start,end,browser);
        console.log(`${fragranceData?.length} data items scraped for fragrance`);
    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }

    if(!state.sephora.fragrance&&fragranceData?.length==0)
    try{
        fragranceData = await fragrance(start,end,browser);
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
        cleanData = await clean(start,end,browser);
        console.log(`${cleanData?.length} data items scraped for clean`);
    }catch(err){
        console.log("There was an error while scraping clean");
        logError(err);
    }

    if(!state.sephora.clean&&cleanData?.length==0)
    try{
        cleanData = await clean(start,end,browser);
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
        bathData = await bath(start,end,browser);
        console.log(`${bathData?.length} data items scraped for bath`);
    }catch(err){
        console.log("There was an error while scraping bath");
        logError(err);
    }

    if(!state.sephora.bath&&bathData?.length==0)
    try{
        bathData = await bath(start,end,browser);
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

    await browser.close();
    
    console.log("entries updated for sephora");
    return makeupData?.length==0;
}

module.exports = scrapeSephora;
