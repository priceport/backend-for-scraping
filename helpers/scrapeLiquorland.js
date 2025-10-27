//scraping script imports
const dark_rum = require("../scripts/scraping_scripts/domestic/liquorland/dark_rum");
const scotch_whisky = require("../scripts/scraping_scripts/domestic/liquorland/scotch_whisky");
const white_rum = require("../scripts/scraping_scripts/domestic/liquorland/white_rum");
const irish_whisky = require("../scripts/scraping_scripts/domestic/liquorland/irish_whiskey");
const nz_whisky = require("../scripts/scraping_scripts/domestic/liquorland/nz_whisky");
const aperitifs = require("../scripts/scraping_scripts/domestic/liquorland/aperitifs");
const cocktail_essentials = require("../scripts/scraping_scripts/domestic/liquorland/cocktail_essentials");
const creme_liqueurs = require("../scripts/scraping_scripts/domestic/liquorland/creme_liqueurs");
const schnapps = require("../scripts/scraping_scripts/domestic/liquorland/schnapps");
const vermouth = require("../scripts/scraping_scripts/domestic/liquorland/vermouth");

//processing script imports
const processDataForSpirits = require("./data_processing/liquorland/spirits");

//db update imports
const updateDBEntry = require("./update_db_entry/liquorland/spirits");
const logError = require("./logError");

const scrapeLiquorland = async (start, end, state, browser) => {
  console.log("scraping started for liquorland at:" + Date.now());

  //variable initialization
  let darkRumData = [], whiteRumData = [], scotchWhiskyData = [] , irishWhiskyData = [], nzWhiskyData = [];
  let aperitifsData = [], cocktailEssentialsData = [], cremeLiqueursData = [], schnappsData = [], vermouthData = [];

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

  if (!state.liquorland.aperitifs) {
    console.log("-----------aperitifs------------");
    try {
      aperitifsData = await aperitifs(start, end, browser);
      console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
    } catch (err) {
      console.log("There was an error while scraping aperitifs");
      logError(err);
    }
  }

  if(!state.liquorland.aperitifs&&aperitifsData?.length==0)
  try{
    aperitifsData = await aperitifs(start, end, browser);
    if(aperitifsData?.length==0){
      state.liquorland.aperitifs = true;
    }
  }catch(err){
    console.log("There was an error while scraping aperitifs");
    logError(err);
  }

  if (!state.liquorland.cocktail_essentials) {
    console.log("-----------cocktail essentials------------");
    try {
      cocktailEssentialsData = await cocktail_essentials(start, end, browser);
      console.log(`${cocktailEssentialsData?.length} data items scraped for cocktail essentials`);
    } catch (err) {
      console.log("There was an error while scraping cocktail essentials");
      logError(err);
    }
  }

  if(!state.liquorland.cocktail_essentials&&cocktailEssentialsData?.length==0)
  try{
    cocktailEssentialsData = await cocktail_essentials(start, end, browser);
    if(cocktailEssentialsData?.length==0){
      state.liquorland.cocktail_essentials = true;
    }
  }catch(err){
    console.log("There was an error while scraping cocktail essentials");
    logError(err);
  }

  if (!state.liquorland.creme_liqueurs) {
    console.log("-----------creme liqueurs------------");
    try {
      cremeLiqueursData = await creme_liqueurs(start, end, browser);
      console.log(`${cremeLiqueursData?.length} data items scraped for creme liqueurs`);
    } catch (err) {
      console.log("There was an error while scraping creme liqueurs");
      logError(err);
    }
  }

  if(!state.liquorland.creme_liqueurs&&cremeLiqueursData?.length==0)
  try{
    cremeLiqueursData = await creme_liqueurs(start, end, browser);
    if(cremeLiqueursData?.length==0){
      state.liquorland.creme_liqueurs = true;
    }
  }catch(err){
    console.log("There was an error while scraping creme liqueurs");
    logError(err);
  }

  if (!state.liquorland.schnapps) {
    console.log("-----------schnapps------------");
    try {
      schnappsData = await schnapps(start, end, browser);
      console.log(`${schnappsData?.length} data items scraped for schnapps`);
    } catch (err) {
      console.log("There was an error while scraping schnapps");
      logError(err);
    }
  }

  if(!state.liquorland.schnapps&&schnappsData?.length==0)
  try{
    schnappsData = await schnapps(start, end, browser);
    if(schnappsData?.length==0){
      state.liquorland.schnapps = true;
    }
  }catch(err){
    console.log("There was an error while scraping schnapps");
    logError(err);
  }

  if (!state.liquorland.vermouth) {
    console.log("-----------vermouth------------");
    try {
      vermouthData = await vermouth(start, end, browser);
      console.log(`${vermouthData?.length} data items scraped for vermouth`);
    } catch (err) {
      console.log("There was an error while scraping vermouth");
      logError(err);
    }
  }

  if(!state.liquorland.vermouth&&vermouthData?.length==0)
  try{
    vermouthData = await vermouth(start, end, browser);
    if(vermouthData?.length==0){
      state.liquorland.vermouth = true;
    }
  }catch(err){
    console.log("There was an error while scraping vermouth");
    logError(err);
  }

  //merge data
  let allData = [...darkRumData, ...whiteRumData, ...scotchWhiskyData, ...irishWhiskyData, ...nzWhiskyData, ...aperitifsData, ...cocktailEssentialsData, ...cremeLiqueursData, ...schnappsData, ...vermouthData];

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
