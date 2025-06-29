const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const logError = require("./logError");
const fragrance = require("../scripts/scraping_scripts/domestic/au_chemist_warehouse/fragrance");
const cosmetics = require("../scripts/scraping_scripts/domestic/au_chemist_warehouse/cosmetics");
const skincare = require("../scripts/scraping_scripts/domestic/au_chemist_warehouse/skincare");
const haircare = require("../scripts/scraping_scripts/domestic/au_chemist_warehouse/haircare");
const personal_care = require("../scripts/scraping_scripts/domestic/au_chemist_warehouse/personcal_care");
const processDataForBeauty = require("./data_processing/au_chemist_warehouse/beauty");
const updateDBEntry = require("./update_db_entry/au_chemist_warehouse/beauty");

puppeteer.use(StealthPlugin());

const scrapeAuChemistWarehouse = async (start, end, state) => {
  console.log("scraping started for au chemist warehouse at:" + Date.now());

  //variable initialization
  let fragranceData = [],
    personalCareData = [],
    skincareData = [],
    cosmeticsData = [],
    haircareData = [];

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
    defaultViewport: null,
  });

  //scrape each category
  if (!state.auChemistWarehouse.fragrance)
    try {
      fragranceData = await fragrance(start, end, browser);
      console.log(`${fragranceData?.length} data items scraped for fragrance`);
    } catch (err) {
      console.log("There was an error while scraping fragrance");
      logError(err);
    }

  if (!state.auChemistWarehouse.fragrance && fragranceData?.length == 0)
    try {
      fragranceData = await fragrance(start, end, browser);
      console.log(`${fragranceData?.length} data items scraped for fragrance`);

      if (fragranceData?.length == 0) state.auChemistWarehouse.fragrance = true;
    } catch (err) {
      console.log("There was an error while scraping fragrance");
      logError(err);
    }

  if (!state.auChemistWarehouse.cosmetics)
    try {
      cosmeticsData = await cosmetics(start, end, browser);
      console.log(`${cosmeticsData?.length} data items scraped for cosmetics`);
    } catch (err) {
      console.log("There was an error while scraping cosmetics");
      logError(err);
    }

  if (!state.auChemistWarehouse.cosmetics && cosmeticsData?.length == 0)
    try {
      cosmeticsData = await cosmetics(start, end, browser);
      console.log(`${cosmeticsData?.length} data items scraped for cosmetics`);

      if (cosmeticsData?.length == 0) state.auChemistWarehouse.cosmetics = true;
    } catch (err) {
      console.log("There was an error while scraping cosmetics");
      logError(err);
    }

  if (!state.auChemistWarehouse.skincare)
    try {
      skincareData = await skincare(start, end, browser);
      console.log(`${skincareData?.length} data items scraped for skincare`);
    } catch (err) {
      console.log("There was an error while scraping skincare");
      logError(err);
    }

  if (!state.auChemistWarehouse.skincare && skincareData?.length == 0)
    try {
      skincareData = await skincare(start, end, browser);
      console.log(`${skincareData?.length} data items scraped for skincare`);

      if (skincareData?.length == 0) state.auChemistWarehouse.skincare = true;
    } catch (err) {
      console.log("There was an error while scraping skincare");
      logError(err);
    }

  if (!state.auChemistWarehouse.haircare)
    try {
      haircareData = await haircare(start, end, browser);
      console.log(`${haircareData?.length} data items scraped for haircare`);
    } catch (err) {
      console.log("There was an error while scraping haircare");
      logError(err);
    }

  if (!state.auChemistWarehouse.haircare && haircareData?.length == 0)
    try {
      haircareData = await haircare(start, end, browser);
      console.log(`${haircareData?.length} data items scraped for haircare`);

      if (haircareData?.length == 0) state.auChemistWarehouse.haircare = true;
    } catch (err) {
      console.log("There was an error while scraping haircare");
      logError(err);
    }

  if (!state.auChemistWarehouse.personal_care)
    try {
      personalCareData = await personal_care(start, end, browser);
      console.log(
        `${personalCareData?.length} data items scraped for personal_care`
      );
    } catch (err) {
      console.log("There was an error while scraping personal_care");
      logError(err);
    }

  if (!state.auChemistWarehouse.personal_care && personalCareData?.length == 0)
    try {
      personalCareData = await personal_care(start, end, browser);
      console.log(
        `${personalCareData?.length} data items scraped for personal_care`
      );

      if (personalCareData?.length == 0)
        state.auChemistWarehouse.personal_care = true;
    } catch (err) {
      console.log("There was an error while scraping personal_care");
      logError(err);
    }

  fragranceData = [
    ...fragranceData,
    ...personalCareData,
    ...skincareData,
    ...cosmeticsData,
    ...haircareData,
  ];

  //process data
  try {
    fragranceData = await processDataForBeauty(fragranceData);
    console.log(`${fragranceData?.length} data items proccessed`);
  } catch (err) {
    console.log("There was an error while proccessing data");
    logError(err);
  }

  //update db
  try {
    await updateDBEntry(fragranceData);
    console.log(`data items updated`);
  } catch (err) {
    console.log("There was an error while updating data");
    logError(err);
  }

  await browser.close();

  console.log("entries updated for au chemist warehouse");

  return fragranceData?.length == 0;
};

module.exports = scrapeAuChemistWarehouse;
