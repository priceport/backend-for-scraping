const body = require("../scripts/scraping_scripts/domestic/au_mecca/body");
const fragrance = require("../scripts/scraping_scripts/domestic/au_mecca/fragrance");
const hair = require("../scripts/scraping_scripts/domestic/au_mecca/hair");
const makeup = require("../scripts/scraping_scripts/domestic/au_mecca/makeup");
const skincare = require("../scripts/scraping_scripts/domestic/au_mecca/skincare");
const processDataForBeauty = require("./data_processing/au_mecca/beauty");
const logError = require("./logError");
const updateDBEntry = require("./update_db_entry/au_mecca/beauty");

const scrapeAuMecca = async (start, end, state, browser) => {
  console.log("scraping started for mecca at:" + Date.now());

  //variable initialization
  let makeupData = [],
    skincareData = [],
    hairData = [],
    fragranceData = [],
    bodyData = [];

  //scrape each category
  if (!state.auMecca.makeup)
    try {
      makeupData = await makeup(start, end, browser);
      console.log(`${makeupData?.length} data items scraped for makeup`);
    } catch (err) {
      console.log("There was an error while scraping makeup");
      logError(err);
    }

  if (!state.auMecca.makeup && makeupData?.length == 0)
    try {
      makeupData = await makeup(start, end, browser);
      console.log(`${makeupData?.length} data items scraped for makeup`);

      if (makeupData?.length == 0) {
        state.auMecca.makeup = true;
      }
    } catch (err) {
      console.log("There was an error while scraping makeup");
      logError(err);
    }

  if (!state.auMecca.skincare)
    try {
      skincareData = await skincare(start, end, browser);
      console.log(`${skincareData?.length} data items scraped for skincare`);
    } catch (err) {
      console.log("There was an error while scraping skincare");
      logError(err);
    }

  if (!state.auMecca.skincare && skincareData?.length == 0)
    try {
      skincareData = await skincare(start, end, browser);
      console.log(`${skincareData?.length} data items scraped for skincare`);

      if (skincareData?.length == 0) {
        state.auMecca.skincare = true;
      }
    } catch (err) {
      console.log("There was an error while scraping skincare");
      logError(err);
    }

  if (!state.auMecca.hair)
    try {
      hairData = await hair(start, end, browser);
      console.log(`${hairData?.length} data items scraped for hair`);
    } catch (err) {
      console.log("There was an error while scraping hair");
      logError(err);
    }

  if (!state.auMecca.hair && hairData?.length == 0)
    try {
      hairData = await hair(start, end, browser);
      console.log(`${hairData?.length} data items scraped for hair`);

      if (hairData?.length == 0) {
        state.auMecca.hair = true;
      }
    } catch (err) {
      console.log("There was an error while scraping hair");
      logError(err);
    }

  if (!state.auMecca.fragrance)
    try {
      fragranceData = await fragrance(start, end, browser);
      console.log(`${fragranceData?.length} data items scraped for fragrance`);
    } catch (err) {
      console.log("There was an error while scraping fragrance");
      logError(err);
    }

  if (!state.auMecca.fragrance && fragranceData?.length == 0)
    try {
      fragranceData = await fragrance(start, end, browser);
      console.log(`${fragranceData?.length} data items scraped for fragrance`);

      if (fragranceData?.length == 0) {
        state.auMecca.fragrance = true;
      }
    } catch (err) {
      console.log("There was an error while scraping fragrance");
      logError(err);
    }

  if (!state.auMecca.body)
    try {
      bodyData = await body(start, end, browser);
      console.log(`${bodyData?.length} data items scraped for body`);
    } catch (err) {
      console.log("There was an error while scraping body");
      logError(err);
    }

  if (!state.auMecca.body && bodyData?.length == 0)
    try {
      bodyData = await body(start, end, browser);
      console.log(`${bodyData?.length} data items scraped for body`);

      if (bodyData?.length == 0) {
        state.auMecca.body = true;
      }
    } catch (err) {
      console.log("There was an error while scraping body");
      logError(err);
    }

  //merge data
  makeupData = [
    ...makeupData,
    ...skincareData,
    ...hairData,
    ...fragranceData,
    ...bodyData,
  ];

  //process data
  try {
    makeupData = await processDataForBeauty(makeupData);
    console.log(`${makeupData?.length} data items proccessed`);
  } catch (err) {
    console.log("There was an error while proccessing data");
    logError(err);
  }
  //update db
  try {
    await updateDBEntry(makeupData);
    console.log(`data items updated`);
  } catch (err) {
    console.log("There was an error while updating data");
    logError(err);
  }

  console.log("entries updated for au_mecca");
  return makeupData?.length == 0;
};

module.exports = scrapeAuMecca;
