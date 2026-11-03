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
const { hasCfClearance, isCloudflareChallenge } = require("./beautyBlissWaitForProducts");

const HOMEPAGE = 'https://beautybliss.co.nz';
const MAX_GOTO_RETRIES = 3;
const CF_POLL_MS = 90000;

const waitForCloudflareClearance = async (page) => {
  const deadline = Date.now() + CF_POLL_MS;

  while (Date.now() < deadline) {
    const clearedCookie = await hasCfClearance(page);
    const onChallenge = await isCloudflareChallenge(page);

    if (clearedCookie || !onChallenge) {
      // Brief settle after challenge reload
      await waitForXTime(2000);
      if (!(await isCloudflareChallenge(page)) || (await hasCfClearance(page))) {
        return true;
      }
    }

    await waitForXTime(1500);
  }

  return false;
};

const warmupCloudflare = async (page) => {
  console.log("beauty bliss: warming up on homepage to get cf_clearance cookie...");

  for (let attempt = 1; attempt <= MAX_GOTO_RETRIES; attempt++) {
    try {
      await page.goto(HOMEPAGE, { waitUntil: 'domcontentloaded', timeout: 90000 });
      break;
    } catch (err) {
      const destroyed = (err.message || '').includes('Execution context was destroyed');
      console.log(`beauty bliss: warmup navigation error (attempt ${attempt}/${MAX_GOTO_RETRIES}):`, err.message);
      if (!destroyed || attempt === MAX_GOTO_RETRIES) {
        throw err;
      }
      await waitForXTime(2000);
    }
  }

  const passed = await waitForCloudflareClearance(page);
  if (!passed) {
    throw new Error('Cloudflare clearance not obtained within timeout');
  }

  console.log("beauty bliss: Cloudflare passed, cf_clearance cookie set");
};

const buildBeautyBlissBrowserArgs = () => {
    const args = [
        '--start-maximized',
        '--no-sandbox',
        '--disable-setuid-sandbox',
    ];

    // macOS has no Xvfb path — keep Chrome headed (CF-safe) but off-screen
    if (process.platform === 'darwin') {
        args.push('--window-position=-2400,-2400', '--window-size=1920,1080');
    }

    return args;
};

const scrapeBeautyBliss = async (start,end,state) =>{
    console.log("scraping started for beauty bliss at:"+Date.now());

    // Keep headless: false — Cloudflare Turnstile fails under true headless.
    // On Linux servers, puppeteer-real-browser starts Xvfb when disableXvfb is false
    // (requires system package: apt-get install -y xvfb). Set BEAUTY_BLISS_SHOW_BROWSER=1
    // to disable Xvfb and watch the browser on a machine with a display.
    const showBrowser = process.env.BEAUTY_BLISS_SHOW_BROWSER === '1';

    const { browser, page } = await connect({
        headless: false,
        turnstile: true,
        disableXvfb: showBrowser,
        args: buildBeautyBlissBrowserArgs(),
        connectOption: {
            defaultViewport: null,
        },
    });

    console.log("beauty bliss: real browser launched with turnstile bypass");

    try {
        await warmupCloudflare(page);
    } catch (err) {
        console.log("beauty bliss: Cloudflare warmup failed:", err.message);
        try { await page.close(); } catch (_) {}
        await browser.close();
        return true; // not done / retry later — zero items
    }

    // Keep at least one tab open. Closing the last tab under
    // puppeteer-real-browser + Xvfb often kills Chrome
    // ("Failed to open a new tab" / "Target closed").
    try {
        await page.goto('about:blank');
    } catch (_) {}

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
