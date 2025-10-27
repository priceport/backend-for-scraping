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
const premium_beer = require("../scripts/scraping_scripts/domestic/liquorland/premium_beer");
const lighter_beer = require("../scripts/scraping_scripts/domestic/liquorland/lighter_beer");
const mainstream_beer = require("../scripts/scraping_scripts/domestic/liquorland/mainstream_beer");
const budget_beer = require("../scripts/scraping_scripts/domestic/liquorland/budget_beer");
const low_carb_beer = require("../scripts/scraping_scripts/domestic/liquorland/low_carb_beer");
const nz_boutique = require("../scripts/scraping_scripts/domestic/liquorland/nz_boutique");
const commercial_brands = require("../scripts/scraping_scripts/domestic/liquorland/commercial_brands");
const australia_asia = require("../scripts/scraping_scripts/domestic/liquorland/australia_asia");
const european = require("../scripts/scraping_scripts/domestic/liquorland/european");
const us_mexico = require("../scripts/scraping_scripts/domestic/liquorland/us_mexico");

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
  let premiumBeerData = [], lighterBeerData = [], mainstreamBeerData = [], budgetBeerData = [], lowCarbBeerData = [], nzBoutiqueData = [];
  let commercialBrandsData = [], australiaAsiaData = [], europeanData = [], usMexicoData = [];

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

  if (!state.liquorland.premium_beer) {
    console.log("-----------premium beer------------");
    try {
      premiumBeerData = await premium_beer(start, end, browser);
      console.log(`${premiumBeerData?.length} data items scraped for premium beer`);
    } catch (err) {
      console.log("There was an error while scraping premium beer");
      logError(err);
    }
  }

  if(!state.liquorland.premium_beer&&premiumBeerData?.length==0)
  try{
    premiumBeerData = await premium_beer(start, end, browser);
    if(premiumBeerData?.length==0){
      state.liquorland.premium_beer = true;
    }
  }catch(err){
    console.log("There was an error while scraping premium beer");
    logError(err);
  }

  if (!state.liquorland.lighter_beer) {
    console.log("-----------lighter beer------------");
    try {
      lighterBeerData = await lighter_beer(start, end, browser);
      console.log(`${lighterBeerData?.length} data items scraped for lighter beer`);
    } catch (err) {
      console.log("There was an error while scraping lighter beer");
      logError(err);
    }
  }

  if(!state.liquorland.lighter_beer&&lighterBeerData?.length==0)
  try{
    lighterBeerData = await lighter_beer(start, end, browser);
    if(lighterBeerData?.length==0){
      state.liquorland.lighter_beer = true;
    }
  }catch(err){
    console.log("There was an error while scraping lighter beer");
    logError(err);
  }

  if (!state.liquorland.mainstream_beer) {
    console.log("-----------mainstream beer------------");
    try {
      mainstreamBeerData = await mainstream_beer(start, end, browser);
      console.log(`${mainstreamBeerData?.length} data items scraped for mainstream beer`);
    } catch (err) {
      console.log("There was an error while scraping mainstream beer");
      logError(err);
    }
  }

  if(!state.liquorland.mainstream_beer&&mainstreamBeerData?.length==0)
  try{
    mainstreamBeerData = await mainstream_beer(start, end, browser);
    if(mainstreamBeerData?.length==0){
      state.liquorland.mainstream_beer = true;
    }
  }catch(err){
    console.log("There was an error while scraping mainstream beer");
    logError(err);
  }

  if (!state.liquorland.budget_beer) {
    console.log("-----------budget beer------------");
    try {
      budgetBeerData = await budget_beer(start, end, browser);
      console.log(`${budgetBeerData?.length} data items scraped for budget beer`);
    } catch (err) {
      console.log("There was an error while scraping budget beer");
      logError(err);
    }
  }

  if(!state.liquorland.budget_beer&&budgetBeerData?.length==0)
  try{
    budgetBeerData = await budget_beer(start, end, browser);
    if(budgetBeerData?.length==0){
      state.liquorland.budget_beer = true;
    }
  }catch(err){
    console.log("There was an error while scraping budget beer");
    logError(err);
  }

  if (!state.liquorland.low_carb_beer) {
    console.log("-----------low carb beer------------");
    try {
      lowCarbBeerData = await low_carb_beer(start, end, browser);
      console.log(`${lowCarbBeerData?.length} data items scraped for low carb beer`);
    } catch (err) {
      console.log("There was an error while scraping low carb beer");
      logError(err);
    }
  }

  if(!state.liquorland.low_carb_beer&&lowCarbBeerData?.length==0)
  try{
    lowCarbBeerData = await low_carb_beer(start, end, browser);
    if(lowCarbBeerData?.length==0){
      state.liquorland.low_carb_beer = true;
    }
  }catch(err){
    console.log("There was an error while scraping low carb beer");
    logError(err);
  }

  if (!state.liquorland.nz_boutique) {
    console.log("-----------nz boutique------------");
    try {
      nzBoutiqueData = await nz_boutique(start, end, browser);
      console.log(`${nzBoutiqueData?.length} data items scraped for nz boutique`);
    } catch (err) {
      console.log("There was an error while scraping nz boutique");
      logError(err);
    }
  }

  if(!state.liquorland.nz_boutique&&nzBoutiqueData?.length==0)
  try{
    nzBoutiqueData = await nz_boutique(start, end, browser);
    if(nzBoutiqueData?.length==0){
      state.liquorland.nz_boutique = true;
    }
  }catch(err){
    console.log("There was an error while scraping nz boutique");
    logError(err);
  }

  if (!state.liquorland.commercial_brands) {
    console.log("-----------commercial brands------------");
    try {
      commercialBrandsData = await commercial_brands(start, end, browser);
      console.log(`${commercialBrandsData?.length} data items scraped for commercial brands`);
    } catch (err) {
      console.log("There was an error while scraping commercial brands");
      logError(err);
    }
  }

  if(!state.liquorland.commercial_brands&&commercialBrandsData?.length==0)
  try{
    commercialBrandsData = await commercial_brands(start, end, browser);
    if(commercialBrandsData?.length==0){
      state.liquorland.commercial_brands = true;
    }
  }catch(err){
    console.log("There was an error while scraping commercial brands");
    logError(err);
  }

  if (!state.liquorland.australia_asia) {
    console.log("-----------australia asia------------");
    try {
      australiaAsiaData = await australia_asia(start, end, browser);
      console.log(`${australiaAsiaData?.length} data items scraped for australia asia`);
    } catch (err) {
      console.log("There was an error while scraping australia asia");
      logError(err);
    }
  }

  if(!state.liquorland.australia_asia&&australiaAsiaData?.length==0)
  try{
    australiaAsiaData = await australia_asia(start, end, browser);
    if(australiaAsiaData?.length==0){
      state.liquorland.australia_asia = true;
    }
  }catch(err){
    console.log("There was an error while scraping australia asia");
    logError(err);
  }

  if (!state.liquorland.european) {
    console.log("-----------european------------");
    try {
      europeanData = await european(start, end, browser);
      console.log(`${europeanData?.length} data items scraped for european`);
    } catch (err) {
      console.log("There was an error while scraping european");
      logError(err);
    }
  }

  if(!state.liquorland.european&&europeanData?.length==0)
  try{
    europeanData = await european(start, end, browser);
    if(europeanData?.length==0){
      state.liquorland.european = true;
    }
  }catch(err){
    console.log("There was an error while scraping european");
    logError(err);
  }

  if (!state.liquorland.us_mexico) {
    console.log("-----------us mexico------------");
    try {
      usMexicoData = await us_mexico(start, end, browser);
      console.log(`${usMexicoData?.length} data items scraped for us mexico`);
    } catch (err) {
      console.log("There was an error while scraping us mexico");
      logError(err);
    }
  }

  if(!state.liquorland.us_mexico&&usMexicoData?.length==0)
  try{
    usMexicoData = await us_mexico(start, end, browser);
    if(usMexicoData?.length==0){
      state.liquorland.us_mexico = true;
    }
  }catch(err){
    console.log("There was an error while scraping us mexico");
    logError(err);
  }

  //merge data
  let allData = [...darkRumData, ...whiteRumData, ...scotchWhiskyData, ...irishWhiskyData, ...nzWhiskyData, ...aperitifsData, ...cocktailEssentialsData, ...cremeLiqueursData, ...schnappsData, ...vermouthData, ...premiumBeerData, ...lighterBeerData, ...mainstreamBeerData, ...budgetBeerData, ...lowCarbBeerData, ...nzBoutiqueData, ...commercialBrandsData, ...australiaAsiaData, ...europeanData, ...usMexicoData];

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
