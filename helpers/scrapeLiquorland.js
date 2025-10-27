//scraping script imports
const dark_rum = require("../scripts/scraping_scripts/domestic/liquorland/dark_rum");
const scotch_whisky = require("../scripts/scraping_scripts/domestic/liquorland/scotch_whisky");
const white_rum = require("../scripts/scraping_scripts/domestic/liquorland/white_rum");
const irish_whisky = require("../scripts/scraping_scripts/domestic/liquorland/irish_whiskey");
const nz_whisky = require("../scripts/scraping_scripts/domestic/liquorland/nz_whisky");

//processing script imports
const processDataForSpirits = require("./data_processing/liquorland/spirits");

//db update imports
const updateDBEntry = require("./update_db_entry/liquorland/spirits");
const logError = require("./logError");

const scrapeLiquorland = async (start, end, state, browser) => {
  console.log("scraping started for liquorland at:" + Date.now());

  //variable initialization
  let darkRumData = [], whiteRumData = [], scotchWhiskyData = [] , irishWhiskyData = [], nzWhiskyData = [];

  if (!state.liquorland.dark_rum) {
    console.log("-----------dark rum------------");
    try {
      darkRumData = await dark_rum(start, end, browser);
      console.log(`${darkRumData?.length} data items scraped for dark rum`);
    } catch (err) {
      console.log("There was an error while scraping dark rum:", err.message);
      console.log("This is likely due to regional blocking or connection issues");
      logError(err);
      state.liquorland.dark_rum = true;
    }
  }

  if(!state.liquorland.dark_rum&&darkRumData?.length==0)
  try{
    darkRumData = await dark_rum(start, end, browser);
    if(darkRumData?.length==0){
      state.liquorland.dark_rum = true;
    }
  }catch(err){
    console.log("There was an error while scraping dark rum");
    logError(err);
  }

  if (!state.liquorland.white_rum) {
    console.log("-----------white rum------------");
    try {
      whiteRumData = await white_rum(start, end, browser);
      console.log(`${whiteRumData?.length} data items scraped for white rum`);
    } catch (err) {
      console.log("There was an error while scraping white rum");
      logError(err);
    }
  }

  if(!state.liquorland.white_rum&&whiteRumData?.length==0)
  try{
    whiteRumData = await white_rum(start, end, browser);
    if(whiteRumData?.length==0){
      state.liquorland.white_rum = true;
    }
  }catch(err){
  
    console.log("There was an error while scraping white rum");
    logError(err);
  }

  if (!state.liquorland.scotch_whisky) {
    console.log("-----------scotch whisky------------");
    try {
      scotchWhiskyData = await scotch_whisky(start, end, browser);
      console.log(`${scotchWhiskyData?.length} data items scraped for scotch whisky`);
    } catch (err) {
      console.log("There was an error while scraping scotch whisky");
      logError(err);
    }
  }

  if(!state.liquorland.scotch_whisky&&scotchWhiskyData?.length==0)
  try{
    scotchWhiskyData = await scotch_whisky(start, end, browser);
    if(scotchWhiskyData?.length==0){
      state.liquorland.scotch_whisky = true;
    }
  }catch(err){
    console.log("There was an error while scraping scotch whisky");
    logError(err);
  }

  if (!state.liquorland.irish_whisky) {
    console.log("-----------irish whisky------------");
    try {
      irishWhiskyData = await irish_whisky(start, end, browser);
      console.log(`${irishWhiskyData?.length} data items scraped for irish whisky`);
    } catch (err) {
      console.log("There was an error while scraping irish whisky");
      logError(err);
    }
  }

  if(!state.liquorland.irish_whisky&&irishWhiskyData?.length==0)
  try{
    irishWhiskyData = await irish_whisky(start, end, browser);
    if(irishWhiskyData?.length==0){
      state.liquorland.irish_whisky = true;
    }
  }catch(err){
    console.log("There was an error while scraping irish whisky");
    logError(err);
  }

   if (!state.liquorland.nz_whisky) {
    console.log("-----------nz whisky------------");
    try {
      nzWhiskyData = await nz_whisky(start, end, browser);
      console.log(`${nzWhiskyData?.length} data items scraped for nz whisky`);
    } catch (err) {
      console.log("There was an error while scraping nz whisky");
      logError(err);
    }
  }

  if(!state.liquorland.nz_whisky&&nzWhiskyData?.length==0)
  try{
    nzWhiskyData = await nz_whisky(start, end, browser);
    if(nzWhiskyData?.length==0){
      state.liquorland.nz_whisky = true;
    }
  }catch(err){
    console.log("There was an error while scraping nz whisky");
    logError(err);
  }


  //merge data
  let allData = [...darkRumData, ...whiteRumData, ...scotchWhiskyData, ...irishWhiskyData, ...nzWhiskyData];

  //process data
  try {
    allData = await processDataForSpirits(allData);
    console.log(`${allData?.length} data items processed`);
  } catch (err) {
    console.log("There was an error while processing data");
    logError(err);
  }

  // update db
  try {
    await updateDBEntry(allData);
    console.log(`data items updated`);
  } catch (err) {
    console.log("There was an error while updating data");
    logError(err);
  }

  console.log("entries updated for liquorland");
  return allData?.length == 0;
};

module.exports = scrapeLiquorland;
