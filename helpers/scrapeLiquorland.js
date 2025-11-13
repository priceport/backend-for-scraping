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
const standard_liqueurs = require("../scripts/scraping_scripts/domestic/liquorland/standard_liqueurs");
const premium_beer = require("../scripts/scraping_scripts/domestic/liquorland/premium_beer");
const lighter_beer = require("../scripts/scraping_scripts/domestic/liquorland/lighter_beer");
const mainstream_beer = require("../scripts/scraping_scripts/domestic/liquorland/mainstream_beer");
const budget_beer = require("../scripts/scraping_scripts/domestic/liquorland/budget_beer");
const low_carb_beer = require("../scripts/scraping_scripts/domestic/liquorland/low_carb_beer");
const kiwi_classics = require("../scripts/scraping_scripts/domestic/liquorland/kiwi_classics");
const international_beer = require("../scripts/scraping_scripts/domestic/liquorland/international_beer");
const low_alc_beer = require("../scripts/scraping_scripts/domestic/liquorland/low_alc_beer");
const non_alc_beer = require("../scripts/scraping_scripts/domestic/liquorland/non_alc_beer");
const nz_boutique = require("../scripts/scraping_scripts/domestic/liquorland/nz_boutique");
const kiwi_craft = require("../scripts/scraping_scripts/domestic/liquorland/kiwi_craft");
const commercial_brands = require("../scripts/scraping_scripts/domestic/liquorland/commercial_brands");
const australia_asia = require("../scripts/scraping_scripts/domestic/liquorland/australia_asia");
const european = require("../scripts/scraping_scripts/domestic/liquorland/european");
const us_mexico = require("../scripts/scraping_scripts/domestic/liquorland/us_mexico");
const pinot_noir = require("../scripts/scraping_scripts/domestic/liquorland/pinot_noir");
const shiraz_syrah = require("../scripts/scraping_scripts/domestic/liquorland/shiraz_syrah");
const cabernet = require("../scripts/scraping_scripts/domestic/liquorland/cabernet");
const merlot = require("../scripts/scraping_scripts/domestic/liquorland/merlot");
const international_red = require("../scripts/scraping_scripts/domestic/liquorland/international_red");
const other_red = require("../scripts/scraping_scripts/domestic/liquorland/other_red");
const sauvignon_blanc = require("../scripts/scraping_scripts/domestic/liquorland/sauvignon_blanc");
const pinot_gris = require("../scripts/scraping_scripts/domestic/liquorland/pinot_gris");
const chardonnay = require("../scripts/scraping_scripts/domestic/liquorland/chardonnay");
const riesling = require("../scripts/scraping_scripts/domestic/liquorland/riesling");
const viognier = require("../scripts/scraping_scripts/domestic/liquorland/viognier");
const gewurztraminer = require("../scripts/scraping_scripts/domestic/liquorland/gewurztraminer");
const dessert = require("../scripts/scraping_scripts/domestic/liquorland/dessert");
const international_white = require("../scripts/scraping_scripts/domestic/liquorland/international_white");
const other_white = require("../scripts/scraping_scripts/domestic/liquorland/other_white");
const water = require("../scripts/scraping_scripts/domestic/liquorland/water");
const juice = require("../scripts/scraping_scripts/domestic/liquorland/juice");
const carbonated = require("../scripts/scraping_scripts/domestic/liquorland/carbonated");
const cordials = require("../scripts/scraping_scripts/domestic/liquorland/cordials");
const energy_sports = require("../scripts/scraping_scripts/domestic/liquorland/energy_sports");
const confectionery = require("../scripts/scraping_scripts/domestic/liquorland/confectionery");
const chips_nuts = require("../scripts/scraping_scripts/domestic/liquorland/chips_nuts");
const flavoured_whisky = require("../scripts/scraping_scripts/domestic/liquorland/flavoured_whisky");
const bourbon = require("../scripts/scraping_scripts/domestic/liquorland/bourbon");
const gin = require("../scripts/scraping_scripts/domestic/liquorland/gin");
const vodka = require("../scripts/scraping_scripts/domestic/liquorland/vodka");
const tequila = require("../scripts/scraping_scripts/domestic/liquorland/tequila");
const ready_made_cocktails = require("../scripts/scraping_scripts/domestic/liquorland/ready_made_cocktails");
const all_spirits = require("../scripts/scraping_scripts/domestic/liquorland/all_spirits");
const rose = require("../scripts/scraping_scripts/domestic/liquorland/rose");
const sparkling = require("../scripts/scraping_scripts/domestic/liquorland/sparkling");
const spritz = require("../scripts/scraping_scripts/domestic/liquorland/spritz");
const port_and_sherry = require("../scripts/scraping_scripts/domestic/liquorland/port_and_sherry");
const cask = require("../scripts/scraping_scripts/domestic/liquorland/cask");
const non_alcoholic = require("../scripts/scraping_scripts/domestic/liquorland/non_alcoholic");
const vodka_rtd = require("../scripts/scraping_scripts/domestic/liquorland/vodka_rtd");
const gin_rtd = require("../scripts/scraping_scripts/domestic/liquorland/gin_rtd");
const bourbon_rtd = require("../scripts/scraping_scripts/domestic/liquorland/bourbon_rtd");
const whisky_rtd = require("../scripts/scraping_scripts/domestic/liquorland/whisky_rtd");
const rum_rtd = require("../scripts/scraping_scripts/domestic/liquorland/rum_rtd");
const tequila_rtd = require("../scripts/scraping_scripts/domestic/liquorland/tequila_rtd");
const cider = require("../scripts/scraping_scripts/domestic/liquorland/cider");
//processing script imports
const processDataForSpirits = require("./data_processing/liquorland/spirits");

//db update imports
const updateDBEntry = require("./update_db_entry/liquorland/spirits");
const logError = require("./logError");

const scrapeLiquorland = async (start, end, state, browser) => {
  console.log("scraping started for liquorland at:" + Date.now());

  //variable initialization
  let darkRumData = [], whiteRumData = [], scotchWhiskyData = [] , irishWhiskyData = [], nzWhiskyData = [];
  let aperitifsData = [], cocktailEssentialsData = [], cremeLiqueursData = [], schnappsData = [], vermouthData = [], standardLiqueursData = [];
  let premiumBeerData = [], lighterBeerData = [], mainstreamBeerData = [], budgetBeerData = [], lowCarbBeerData = [], kiwiClassicsData = [], internationalBeerData = [], lowAlcBeerData = [], nonAlcBeerData = [], nzBoutiqueData = [], kiwiCraftData = [];
  let commercialBrandsData = [], australiaAsiaData = [], europeanData = [], usMexicoData = [];
  let pinotNoirData = [], shirazSyrahData = [], cabernetData = [], merlotData = [], internationalRedData = [], otherRedData = [];
  let sauvignonBlancData = [], pinotGrisData = [], chardonnayData = [], rieslingData = [], viognierData = [], gewurztraminerData = [], dessertData = [], internationalWhiteData = [], otherWhiteData = [];
  let roseData = [], sparklingData = [], spritzData = [], portAndSherryData = [], caskData = [], nonAlcoholicData = [];
  let waterData = [], juiceData = [], carbonatedData = [], cordialsData = [], energySportsData = [];
  let confectioneryData = [], chipsNutsData = [], flavouredWhiskyData = [];
  let bourbonData = [], ginData = [], vodkaData = [], tequilaData = [], readyMadeCocktailsData = [], allSpiritsData = [];
  let vodkaRtdData = [], ginRtdData = [], bourbonRtdData = [], whiskyRtdData = [], rumRtdData = [], tequilaRtdData = [];
  let ciderData = [];

  if (!state.liquorland.dark_rum) {
    console.log("-----------dark rum------------");
    try {
      darkRumData = await dark_rum(start, end, browser);
      console.log(`${darkRumData?.length} data items scraped for dark rum`);
    } catch (err) {
      console.log("There was an error while scraping dark rum:", err.message);
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

  if (!state.liquorland.standard_liqueurs) {
    console.log("-----------standard liqueurs------------");
    try {
      standardLiqueursData = await standard_liqueurs(start, end, browser);
      console.log(`${standardLiqueursData?.length} data items scraped for standard liqueurs`);
    } catch (err) {
      console.log("There was an error while scraping standard liqueurs");
      logError(err);
    }
  }

  if(!state.liquorland.standard_liqueurs&&standardLiqueursData?.length==0)
  try{
    standardLiqueursData = await standard_liqueurs(start, end, browser);
    if(standardLiqueursData?.length==0){
      state.liquorland.standard_liqueurs = true;
    }
  }catch(err){
    console.log("There was an error while scraping standard liqueurs");
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

  if (!state.liquorland.kiwi_classics) {
    console.log("-----------kiwi classics------------");
    try {
      kiwiClassicsData = await kiwi_classics(start, end, browser);
      console.log(`${kiwiClassicsData?.length} data items scraped for kiwi classics`);
    } catch (err) {
      console.log("There was an error while scraping kiwi classics");
      logError(err);
    }
  }

  if(!state.liquorland.kiwi_classics&&kiwiClassicsData?.length==0)
  try{
    kiwiClassicsData = await kiwi_classics(start, end, browser);
    if(kiwiClassicsData?.length==0){
      state.liquorland.kiwi_classics = true;
    }
  }catch(err){
    console.log("There was an error while scraping kiwi classics");
    logError(err);
  }

  if (!state.liquorland.international_beer) {
    console.log("-----------international beer------------");
    try {
      internationalBeerData = await international_beer(start, end, browser);
      console.log(`${internationalBeerData?.length} data items scraped for international beer`);
    } catch (err) {
      console.log("There was an error while scraping international beer");
      logError(err);
    }
  }

  if(!state.liquorland.international_beer&&internationalBeerData?.length==0)
  try{
    internationalBeerData = await international_beer(start, end, browser);
    if(internationalBeerData?.length==0){
      state.liquorland.international_beer = true;
    }
  }catch(err){
    console.log("There was an error while scraping international beer");
    logError(err);
  }

  if (!state.liquorland.low_alc_beer) {
    console.log("-----------low alc beer------------");
    try {
      lowAlcBeerData = await low_alc_beer(start, end, browser);
      console.log(`${lowAlcBeerData?.length} data items scraped for low alc beer`);
    } catch (err) {
      console.log("There was an error while scraping low alc beer");
      logError(err);
    }
  }

  if(!state.liquorland.low_alc_beer&&lowAlcBeerData?.length==0)
  try{
    lowAlcBeerData = await low_alc_beer(start, end, browser);
    if(lowAlcBeerData?.length==0){
      state.liquorland.low_alc_beer = true;
    }
  }catch(err){
    console.log("There was an error while scraping low alc beer");
    logError(err);
  }

  if (!state.liquorland.non_alc_beer) {
    console.log("-----------non alc beer------------");
    try {
      nonAlcBeerData = await non_alc_beer(start, end, browser);
      console.log(`${nonAlcBeerData?.length} data items scraped for non alc beer`);
    } catch (err) {
      console.log("There was an error while scraping non alc beer");
      logError(err);
    }
  }

  if(!state.liquorland.non_alc_beer&&nonAlcBeerData?.length==0)
  try{
    nonAlcBeerData = await non_alc_beer(start, end, browser);
    if(nonAlcBeerData?.length==0){
      state.liquorland.non_alc_beer = true;
    }
  }catch(err){
    console.log("There was an error while scraping non alc beer");
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

  if (!state.liquorland.kiwi_craft) {
    console.log("-----------kiwi craft------------");
    try {
      kiwiCraftData = await kiwi_craft(start, end, browser);
      console.log(`${kiwiCraftData?.length} data items scraped for kiwi craft`);
    } catch (err) {
      console.log("There was an error while scraping kiwi craft");
      logError(err);
    }
  }

  if(!state.liquorland.kiwi_craft&&kiwiCraftData?.length==0)
  try{
    kiwiCraftData = await kiwi_craft(start, end, browser);
    if(kiwiCraftData?.length==0){
      state.liquorland.kiwi_craft = true;
    }
  }catch(err){
    console.log("There was an error while scraping kiwi craft");
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

  if (!state.liquorland.pinot_noir) {
    console.log("-----------pinot noir------------");
    try {
      pinotNoirData = await pinot_noir(start, end, browser);
      console.log(`${pinotNoirData?.length} data items scraped for pinot noir`);
    } catch (err) {
      console.log("There was an error while scraping pinot noir");
      logError(err);
    }
  }

  if(!state.liquorland.pinot_noir&&pinotNoirData?.length==0)
  try{
    pinotNoirData = await pinot_noir(start, end, browser);
    if(pinotNoirData?.length==0){
      state.liquorland.pinot_noir = true;
    }
  }catch(err){
    console.log("There was an error while scraping pinot noir");
    logError(err);
  }

  if (!state.liquorland.shiraz_syrah) {
    console.log("-----------shiraz syrah------------");
    try {
      shirazSyrahData = await shiraz_syrah(start, end, browser);
      console.log(`${shirazSyrahData?.length} data items scraped for shiraz syrah`);
    } catch (err) {
      console.log("There was an error while scraping shiraz syrah");
      logError(err);
    }
  }

  if(!state.liquorland.shiraz_syrah&&shirazSyrahData?.length==0)
  try{
    shirazSyrahData = await shiraz_syrah(start, end, browser);
    if(shirazSyrahData?.length==0){
      state.liquorland.shiraz_syrah = true;
    }
  }catch(err){
    console.log("There was an error while scraping shiraz syrah");
    logError(err);
  }

  if (!state.liquorland.cabernet) {
    console.log("-----------cabernet------------");
    try {
      cabernetData = await cabernet(start, end, browser);
      console.log(`${cabernetData?.length} data items scraped for cabernet`);
    } catch (err) {
      console.log("There was an error while scraping cabernet");
      logError(err);
    }
  }

  if(!state.liquorland.cabernet&&cabernetData?.length==0)
  try{
    cabernetData = await cabernet(start, end, browser);
    if(cabernetData?.length==0){
      state.liquorland.cabernet = true;
    }
  }catch(err){
    console.log("There was an error while scraping cabernet");
    logError(err);
  }

  if (!state.liquorland.merlot) {
    console.log("-----------merlot------------");
    try {
      merlotData = await merlot(start, end, browser);
      console.log(`${merlotData?.length} data items scraped for merlot`);
    } catch (err) {
      console.log("There was an error while scraping merlot");
      logError(err);
    }
  }

  if(!state.liquorland.merlot&&merlotData?.length==0)
  try{
    merlotData = await merlot(start, end, browser);
    if(merlotData?.length==0){
      state.liquorland.merlot = true;
    }
  }catch(err){
    console.log("There was an error while scraping merlot");
    logError(err);
  }

  if (!state.liquorland.international_red) {
    console.log("-----------international red------------");
    try {
      internationalRedData = await international_red(start, end, browser);
      console.log(`${internationalRedData?.length} data items scraped for international red`);
    } catch (err) {
      console.log("There was an error while scraping international red");
      logError(err);
    }
  }

  if(!state.liquorland.international_red&&internationalRedData?.length==0)
  try{
    internationalRedData = await international_red(start, end, browser);
    if(internationalRedData?.length==0){
      state.liquorland.international_red = true;
    }
  }catch(err){
    console.log("There was an error while scraping international red");
    logError(err);
  }

  if (!state.liquorland.other_red) {
    console.log("-----------other red------------");
    try {
      otherRedData = await other_red(start, end, browser);
      console.log(`${otherRedData?.length} data items scraped for other red`);
    } catch (err) {
      console.log("There was an error while scraping other red");
      logError(err);
    }
  }

  if(!state.liquorland.other_red&&otherRedData?.length==0)
  try{
    otherRedData = await other_red(start, end, browser);
    if(otherRedData?.length==0){
      state.liquorland.other_red = true;
    }
  }catch(err){
    console.log("There was an error while scraping other red");
    logError(err);
  }

  if (!state.liquorland.sauvignon_blanc) {
    console.log("-----------sauvignon blanc------------");
    try {
      sauvignonBlancData = await sauvignon_blanc(start, end, browser);
      console.log(`${sauvignonBlancData?.length} data items scraped for sauvignon blanc`);
    } catch (err) {
      console.log("There was an error while scraping sauvignon blanc");
      logError(err);
    }
  }

  if(!state.liquorland.sauvignon_blanc&&sauvignonBlancData?.length==0)
  try{
    sauvignonBlancData = await sauvignon_blanc(start, end, browser);
    if(sauvignonBlancData?.length==0){
      state.liquorland.sauvignon_blanc = true;
    }
  }catch(err){
    console.log("There was an error while scraping sauvignon blanc");
    logError(err);
  }

  if (!state.liquorland.pinot_gris) {
    console.log("-----------pinot gris------------");
    try {
      pinotGrisData = await pinot_gris(start, end, browser);
      console.log(`${pinotGrisData?.length} data items scraped for pinot gris`);
    } catch (err) {
      console.log("There was an error while scraping pinot gris");
      logError(err);
    }
  }

  if(!state.liquorland.pinot_gris&&pinotGrisData?.length==0)
  try{
    pinotGrisData = await pinot_gris(start, end, browser);
    if(pinotGrisData?.length==0){
      state.liquorland.pinot_gris = true;
    }
  }catch(err){
    console.log("There was an error while scraping pinot gris");
    logError(err);
  }

  if (!state.liquorland.chardonnay) {
    console.log("-----------chardonnay------------");
    try {
      chardonnayData = await chardonnay(start, end, browser);
      console.log(`${chardonnayData?.length} data items scraped for chardonnay`);
    } catch (err) {
      console.log("There was an error while scraping chardonnay");
      logError(err);
    }
  }

  if(!state.liquorland.chardonnay&&chardonnayData?.length==0)
  try{
    chardonnayData = await chardonnay(start, end, browser);
    if(chardonnayData?.length==0){
      state.liquorland.chardonnay = true;
    }
  }catch(err){
    console.log("There was an error while scraping chardonnay");
    logError(err);
  }

  if (!state.liquorland.riesling) {
    console.log("-----------riesling------------");
    try {
      rieslingData = await riesling(start, end, browser);
      console.log(`${rieslingData?.length} data items scraped for riesling`);
    } catch (err) {
      console.log("There was an error while scraping riesling");
      logError(err);
    }
  }

  if(!state.liquorland.riesling&&rieslingData?.length==0)
  try{
    rieslingData = await riesling(start, end, browser);
    if(rieslingData?.length==0){
      state.liquorland.riesling = true;
    }
  }catch(err){
    console.log("There was an error while scraping riesling");
    logError(err);
  }

  if (!state.liquorland.viognier) {
    console.log("-----------viognier------------");
    try {
      viognierData = await viognier(start, end, browser);
      console.log(`${viognierData?.length} data items scraped for viognier`);
    } catch (err) {
      console.log("There was an error while scraping viognier");
      logError(err);
    }
  }

  if(!state.liquorland.viognier&&viognierData?.length==0)
  try{
    viognierData = await viognier(start, end, browser);
    if(viognierData?.length==0){
      state.liquorland.viognier = true;
    }
  }catch(err){
    console.log("There was an error while scraping viognier");
    logError(err);
  }

  if (!state.liquorland.gewurztraminer) {
    console.log("-----------gewurztraminer------------");
    try {
      gewurztraminerData = await gewurztraminer(start, end, browser);
      console.log(`${gewurztraminerData?.length} data items scraped for gewurztraminer`);
    } catch (err) {
      console.log("There was an error while scraping gewurztraminer");
      logError(err);
    }
  }

  if(!state.liquorland.gewurztraminer&&gewurztraminerData?.length==0)
  try{
    gewurztraminerData = await gewurztraminer(start, end, browser);
    if(gewurztraminerData?.length==0){
      state.liquorland.gewurztraminer = true;
    }
  }catch(err){
    console.log("There was an error while scraping gewurztraminer");
    logError(err);
  }

  if (!state.liquorland.dessert) {
    console.log("-----------dessert------------");
    try {
      dessertData = await dessert(start, end, browser);
      console.log(`${dessertData?.length} data items scraped for dessert`);
    } catch (err) {
      console.log("There was an error while scraping dessert");
      logError(err);
    }
  }

  if(!state.liquorland.dessert&&dessertData?.length==0)
  try{
    dessertData = await dessert(start, end, browser);
    if(dessertData?.length==0){
      state.liquorland.dessert = true;
    }
  }catch(err){
    console.log("There was an error while scraping dessert");
    logError(err);
  }

  if (!state.liquorland.international_white) {
    console.log("-----------international white------------");
    try {
      internationalWhiteData = await international_white(start, end, browser);
      console.log(`${internationalWhiteData?.length} data items scraped for international white`);
    } catch (err) {
      console.log("There was an error while scraping international white");
      logError(err);
    }
  }

  if(!state.liquorland.international_white&&internationalWhiteData?.length==0)
  try{
    internationalWhiteData = await international_white(start, end, browser);
    if(internationalWhiteData?.length==0){
      state.liquorland.international_white = true;
    }
  }catch(err){
    console.log("There was an error while scraping international white");
    logError(err);
  }

  if (!state.liquorland.other_white) {
    console.log("-----------other white------------");
    try {
      otherWhiteData = await other_white(start, end, browser);
      console.log(`${otherWhiteData?.length} data items scraped for other white`);
    } catch (err) {
      console.log("There was an error while scraping other white");
      logError(err);
    }
  }

  if(!state.liquorland.other_white&&otherWhiteData?.length==0)
  try{
    otherWhiteData = await other_white(start, end, browser);
    if(otherWhiteData?.length==0){
      state.liquorland.other_white = true;
    }
  }catch(err){
    console.log("There was an error while scraping other white");
    logError(err);
  }

  if (!state.liquorland.water) {
    console.log("-----------water------------");
    try {
      waterData = await water(start, end, browser);
      console.log(`${waterData?.length} data items scraped for water`);
    } catch (err) {
      console.log("There was an error while scraping water");
      logError(err);
    }
  }

  if(!state.liquorland.water&&waterData?.length==0)
  try{
    waterData = await water(start, end, browser);
    if(waterData?.length==0){
      state.liquorland.water = true;
    }
  }catch(err){
    console.log("There was an error while scraping water");
    logError(err);
  }

  if (!state.liquorland.juice) {
    console.log("-----------juice------------");
    try {
      juiceData = await juice(start, end, browser);
      console.log(`${juiceData?.length} data items scraped for juice`);
    } catch (err) {
      console.log("There was an error while scraping juice");
      logError(err);
    }
  }

  if(!state.liquorland.juice&&juiceData?.length==0)
  try{
    juiceData = await juice(start, end, browser);
    if(juiceData?.length==0){
      state.liquorland.juice = true;
    }
  }catch(err){
    console.log("There was an error while scraping juice");
    logError(err);
  }

  if (!state.liquorland.carbonated) {
    console.log("-----------carbonated------------");
    try {
      carbonatedData = await carbonated(start, end, browser);
      console.log(`${carbonatedData?.length} data items scraped for carbonated`);
    } catch (err) {
      console.log("There was an error while scraping carbonated");
      logError(err);
    }
  }

  if(!state.liquorland.carbonated&&carbonatedData?.length==0)
  try{
    carbonatedData = await carbonated(start, end, browser);
    if(carbonatedData?.length==0){
      state.liquorland.carbonated = true;
    }
  }catch(err){
    console.log("There was an error while scraping carbonated");
    logError(err);
  }

  if (!state.liquorland.cordials) {
    console.log("-----------cordials------------");
    try {
      cordialsData = await cordials(start, end, browser);
      console.log(`${cordialsData?.length} data items scraped for cordials`);
    } catch (err) {
      console.log("There was an error while scraping cordials");
      logError(err);
    }
  }

  if(!state.liquorland.cordials&&cordialsData?.length==0)
  try{
    cordialsData = await cordials(start, end, browser);
    if(cordialsData?.length==0){
      state.liquorland.cordials = true;
    }
  }catch(err){
    console.log("There was an error while scraping cordials");
    logError(err);
  }

  if (!state.liquorland.energy_sports) {
    console.log("-----------energy sports------------");
    try {
      energySportsData = await energy_sports(start, end, browser);
      console.log(`${energySportsData?.length} data items scraped for energy sports`);
    } catch (err) {
      console.log("There was an error while scraping energy sports");
      logError(err);
    }
  }

  if(!state.liquorland.energy_sports&&energySportsData?.length==0)
  try{
    energySportsData = await energy_sports(start, end, browser);
    if(energySportsData?.length==0){
      state.liquorland.energy_sports = true;
    }
  }catch(err){
    console.log("There was an error while scraping energy sports");
    logError(err);
  }

  if (!state.liquorland.confectionery) {
    console.log("-----------confectionery------------");
    try {
      confectioneryData = await confectionery(start, end, browser);
      console.log(`${confectioneryData?.length} data items scraped for confectionery`);
    } catch (err) {
      console.log("There was an error while scraping confectionery");
      logError(err);
    }
  }

  if(!state.liquorland.confectionery&&confectioneryData?.length==0)
  try{
    confectioneryData = await confectionery(start, end, browser);
    if(confectioneryData?.length==0){
      state.liquorland.confectionery = true;
    }
  }catch(err){
    console.log("There was an error while scraping confectionery");
    logError(err);
  }

  if (!state.liquorland.chips_nuts) {
    console.log("-----------chips nuts------------");
    try {
      chipsNutsData = await chips_nuts(start, end, browser);
      console.log(`${chipsNutsData?.length} data items scraped for chips nuts`);
    } catch (err) {
      console.log("There was an error while scraping chips nuts");
      logError(err);
    }
  }

  if(!state.liquorland.chips_nuts&&chipsNutsData?.length==0)
  try{
    chipsNutsData = await chips_nuts(start, end, browser);
    if(chipsNutsData?.length==0){
      state.liquorland.chips_nuts = true;
    }
  }catch(err){
    console.log("There was an error while scraping chips nuts");
    logError(err);
  }

  if (!state.liquorland.flavoured_whisky) {
    console.log("-----------flavoured whisky------------");
    try {
      flavouredWhiskyData = await flavoured_whisky(start, end, browser);
      console.log(`${flavouredWhiskyData?.length} data items scraped for flavoured whisky`);
    } catch (err) {
      console.log("There was an error while scraping flavoured whisky");
      logError(err);
    }
  }

  if(!state.liquorland.flavoured_whisky&&flavouredWhiskyData?.length==0)
  try{
    flavouredWhiskyData = await flavoured_whisky(start, end, browser);
    if(flavouredWhiskyData?.length==0){
      state.liquorland.flavoured_whisky = true;
    }
  }catch(err){
    console.log("There was an error while scraping flavoured whisky");
    logError(err);
  }

  if (!state.liquorland.bourbon) {
    console.log("-----------bourbon------------");
    try {
      bourbonData = await bourbon(start, end, browser);
      console.log(`${bourbonData?.length} data items scraped for bourbon`);
    } catch (err) {
      console.log("There was an error while scraping bourbon");
      logError(err);
    }
  }

  if(!state.liquorland.bourbon&&bourbonData?.length==0)
  try{
    bourbonData = await bourbon(start, end, browser);
    if(bourbonData?.length==0){
      state.liquorland.bourbon = true;
    }
  }catch(err){
    console.log("There was an error while scraping bourbon");
    logError(err);
  }

  if (!state.liquorland.gin) {
    console.log("-----------gin------------");
    try {
      ginData = await gin(start, end, browser);
      console.log(`${ginData?.length} data items scraped for gin`);
    } catch (err) {
      console.log("There was an error while scraping gin");
      logError(err);
    }
  }

  if(!state.liquorland.gin&&ginData?.length==0)
  try{
    ginData = await gin(start, end, browser);
    if(ginData?.length==0){
      state.liquorland.gin = true;
    }
  }catch(err){
    console.log("There was an error while scraping gin");
    logError(err);
  }

  if (!state.liquorland.vodka) {
    console.log("-----------vodka------------");
    try {
      vodkaData = await vodka(start, end, browser);
      console.log(`${vodkaData?.length} data items scraped for vodka`);
    } catch (err) {
      console.log("There was an error while scraping vodka");
      logError(err);
    }
  }

  if(!state.liquorland.vodka&&vodkaData?.length==0)
  try{
    vodkaData = await vodka(start, end, browser);
    if(vodkaData?.length==0){
      state.liquorland.vodka = true;
    }
  }catch(err){
    console.log("There was an error while scraping vodka");
    logError(err);
  }

  if (!state.liquorland.tequila) {
    console.log("-----------tequila------------");
    try {
      tequilaData = await tequila(start, end, browser);
      console.log(`${tequilaData?.length} data items scraped for tequila`);
    } catch (err) {
      console.log("There was an error while scraping tequila");
      logError(err);
    }
  }

  if(!state.liquorland.tequila&&tequilaData?.length==0)
  try{
    tequilaData = await tequila(start, end, browser);
    if(tequilaData?.length==0){
      state.liquorland.tequila = true;
    }
  }catch(err){
    console.log("There was an error while scraping tequila");
    logError(err);
  }

  if (!state.liquorland.ready_made_cocktails) {
    console.log("-----------ready made cocktails------------");
    try {
      readyMadeCocktailsData = await ready_made_cocktails(start, end, browser);
      console.log(`${readyMadeCocktailsData?.length} data items scraped for ready made cocktails`);
    } catch (err) {
      console.log("There was an error while scraping ready made cocktails");
      logError(err);
    }
  }

  if(!state.liquorland.ready_made_cocktails&&readyMadeCocktailsData?.length==0)
  try{
    readyMadeCocktailsData = await ready_made_cocktails(start, end, browser);
    if(readyMadeCocktailsData?.length==0){
      state.liquorland.ready_made_cocktails = true;
    }
  }catch(err){
    console.log("There was an error while scraping ready made cocktails");
    logError(err);
  }

  if (!state.liquorland.all_spirits) {
    console.log("-----------all spirits------------");
    try {
      allSpiritsData = await all_spirits(start, end, browser);
      console.log(`${allSpiritsData?.length} data items scraped for all spirits`);
    } catch (err) {
      console.log("There was an error while scraping all spirits");
      logError(err);
    }
  }

  if(!state.liquorland.all_spirits&&allSpiritsData?.length==0)
  try{
    allSpiritsData = await all_spirits(start, end, browser);
    if(allSpiritsData?.length==0){
      state.liquorland.all_spirits = true;
    }
  }catch(err){
    console.log("There was an error while scraping all spirits");
    logError(err);
  }

  if (!state.liquorland.rose) {
    console.log("-----------rose------------");
    try {
      roseData = await rose(start, end, browser);
      console.log(`${roseData?.length} data items scraped for rose`);
    } catch (err) {
      console.log("There was an error while scraping rose");
      logError(err);
    }
  }

  if(!state.liquorland.rose&&roseData?.length==0)
  try{
    roseData = await rose(start, end, browser);
    if(roseData?.length==0){
      state.liquorland.rose = true;
    }
  }catch(err){
    console.log("There was an error while scraping rose");
    logError(err);
  }

  if (!state.liquorland.sparkling) {
    console.log("-----------sparkling------------");
    try {
      sparklingData = await sparkling(start, end, browser);
      console.log(`${sparklingData?.length} data items scraped for sparkling`);
    } catch (err) {
      console.log("There was an error while scraping sparkling");
      logError(err);
    }
  }

  if(!state.liquorland.sparkling&&sparklingData?.length==0)
  try{
    sparklingData = await sparkling(start, end, browser);
    if(sparklingData?.length==0){
      state.liquorland.sparkling = true;
    }
  }catch(err){
    console.log("There was an error while scraping sparkling");
    logError(err);
  }

  if (!state.liquorland.spritz) {
    console.log("-----------spritz------------");
    try {
      spritzData = await spritz(start, end, browser);
      console.log(`${spritzData?.length} data items scraped for spritz`);
    } catch (err) {
      console.log("There was an error while scraping spritz");
      logError(err);
    }
  }

  if(!state.liquorland.spritz&&spritzData?.length==0)
  try{
    spritzData = await spritz(start, end, browser);
    if(spritzData?.length==0){
      state.liquorland.spritz = true;
    }
  }catch(err){
    console.log("There was an error while scraping spritz");
    logError(err);
  }

  if (!state.liquorland.port_and_sherry) {
    console.log("-----------port and sherry------------");
    try {
      portAndSherryData = await port_and_sherry(start, end, browser);
      console.log(`${portAndSherryData?.length} data items scraped for port and sherry`);
    } catch (err) {
      console.log("There was an error while scraping port and sherry");
      logError(err);
    }
  }

  if(!state.liquorland.port_and_sherry&&portAndSherryData?.length==0)
  try{
    portAndSherryData = await port_and_sherry(start, end, browser);
    if(portAndSherryData?.length==0){
      state.liquorland.port_and_sherry = true;
    }
  }catch(err){
    console.log("There was an error while scraping port and sherry");
    logError(err);
  }

  if (!state.liquorland.cask) {
    console.log("-----------cask------------");
    try {
      caskData = await cask(start, end, browser);
      console.log(`${caskData?.length} data items scraped for cask`);
    } catch (err) {
      console.log("There was an error while scraping cask");
      logError(err);
    }
  }

  if(!state.liquorland.cask&&caskData?.length==0)
  try{
    caskData = await cask(start, end, browser);
    if(caskData?.length==0){
      state.liquorland.cask = true;
    }
  }catch(err){
    console.log("There was an error while scraping cask");
    logError(err);
  }

  if (!state.liquorland.non_alcoholic) {
    console.log("-----------non alcoholic------------");
    try {
      nonAlcoholicData = await non_alcoholic(start, end, browser);
      console.log(`${nonAlcoholicData?.length} data items scraped for non alcoholic`);
    } catch (err) {
      console.log("There was an error while scraping non alcoholic");
      logError(err);
    }
  }

  if(!state.liquorland.non_alcoholic&&nonAlcoholicData?.length==0)
  try{
    nonAlcoholicData = await non_alcoholic(start, end, browser);
    if(nonAlcoholicData?.length==0){
      state.liquorland.non_alcoholic = true;
    }
  }catch(err){
    console.log("There was an error while scraping non alcoholic");
    logError(err);
  }

  if (!state.liquorland.vodka_rtd) {
    console.log("-----------vodka rtd------------");
    try {
      vodkaRtdData = await vodka_rtd(start, end, browser);
      console.log(`${vodkaRtdData?.length} data items scraped for vodka rtd`);
    } catch (err) {
      console.log("There was an error while scraping vodka rtd");
      logError(err);
    }
  }

  if(!state.liquorland.vodka_rtd&&vodkaRtdData?.length==0)
  try{
    vodkaRtdData = await vodka_rtd(start, end, browser);
    if(vodkaRtdData?.length==0){
      state.liquorland.vodka_rtd = true;
    }
  }catch(err){
    console.log("There was an error while scraping vodka rtd");
    logError(err);
  }

  if (!state.liquorland.gin_rtd) {
    console.log("-----------gin rtd------------");
    try {
      ginRtdData = await gin_rtd(start, end, browser);
      console.log(`${ginRtdData?.length} data items scraped for gin rtd`);
    } catch (err) {
      console.log("There was an error while scraping gin rtd");
      logError(err);
    }
  }

  if(!state.liquorland.gin_rtd&&ginRtdData?.length==0)
  try{
    ginRtdData = await gin_rtd(start, end, browser);
    if(ginRtdData?.length==0){
      state.liquorland.gin_rtd = true;
    }
  }catch(err){
    console.log("There was an error while scraping gin rtd");
    logError(err);
  }

  if (!state.liquorland.bourbon_rtd) {
    console.log("-----------bourbon rtd------------");
    try {
      bourbonRtdData = await bourbon_rtd(start, end, browser);
      console.log(`${bourbonRtdData?.length} data items scraped for bourbon rtd`);
    } catch (err) {
      console.log("There was an error while scraping bourbon rtd");
      logError(err);
    }
  }

  if(!state.liquorland.bourbon_rtd&&bourbonRtdData?.length==0)
  try{
    bourbonRtdData = await bourbon_rtd(start, end, browser);
    if(bourbonRtdData?.length==0){
      state.liquorland.bourbon_rtd = true;
    }
  }catch(err){
    console.log("There was an error while scraping bourbon rtd");
    logError(err);
  }

  if (!state.liquorland.whisky_rtd) {
    console.log("-----------whisky rtd------------");
    try {
      whiskyRtdData = await whisky_rtd(start, end, browser);
      console.log(`${whiskyRtdData?.length} data items scraped for whisky rtd`);
    } catch (err) {
      console.log("There was an error while scraping whisky rtd");
      logError(err);
    }
  }

  if(!state.liquorland.whisky_rtd&&whiskyRtdData?.length==0)
  try{
    whiskyRtdData = await whisky_rtd(start, end, browser);
    if(whiskyRtdData?.length==0){
      state.liquorland.whisky_rtd = true;
    }
  }catch(err){
    console.log("There was an error while scraping whisky rtd");
    logError(err);
  }

  if (!state.liquorland.rum_rtd) {
    console.log("-----------rum rtd------------");
    try {
      rumRtdData = await rum_rtd(start, end, browser);
      console.log(`${rumRtdData?.length} data items scraped for rum rtd`);
    } catch (err) {
      console.log("There was an error while scraping rum rtd");
      logError(err);
    }
  }

  if(!state.liquorland.rum_rtd&&rumRtdData?.length==0)
  try{
    rumRtdData = await rum_rtd(start, end, browser);
    if(rumRtdData?.length==0){
      state.liquorland.rum_rtd = true;
    }
  }catch(err){
    console.log("There was an error while scraping rum rtd");
    logError(err);
  }

  if (!state.liquorland.tequila_rtd) {
    console.log("-----------tequila rtd------------");
    try {
      tequilaRtdData = await tequila_rtd(start, end, browser);
      console.log(`${tequilaRtdData?.length} data items scraped for tequila rtd`);
    } catch (err) {
      console.log("There was an error while scraping tequila rtd");
      logError(err);
    }
  }

  if(!state.liquorland.tequila_rtd&&tequilaRtdData?.length==0)
  try{
    tequilaRtdData = await tequila_rtd(start, end, browser);
    if(tequilaRtdData?.length==0){
      state.liquorland.tequila_rtd = true;
    }
  }catch(err){
    console.log("There was an error while scraping tequila rtd");
    logError(err);
  }

  if (!state.liquorland.cider) {
    console.log("-----------cider------------");
    try {
      ciderData = await cider(start, end, browser);
      console.log(`${ciderData?.length} data items scraped for cider`);
    } catch (err) {
      console.log("There was an error while scraping cider");
      logError(err);
    }
  }

  if(!state.liquorland.cider&&ciderData?.length==0)
  try{
    ciderData = await cider(start, end, browser);
    if(ciderData?.length==0){
      state.liquorland.cider = true;
    }
  }catch(err){
    console.log("There was an error while scraping cider");
    logError(err);
  }
  //merge data
  let allData = [...darkRumData, ...whiteRumData, ...scotchWhiskyData, ...irishWhiskyData, ...nzWhiskyData, ...aperitifsData, ...cocktailEssentialsData, ...cremeLiqueursData, ...schnappsData, ...vermouthData, ...standardLiqueursData, ...premiumBeerData, ...lighterBeerData, ...mainstreamBeerData, ...budgetBeerData, ...lowCarbBeerData, ...kiwiClassicsData, ...internationalBeerData, ...lowAlcBeerData, ...nonAlcBeerData, ...nzBoutiqueData, ...kiwiCraftData, ...commercialBrandsData, ...australiaAsiaData, ...europeanData, ...usMexicoData, ...pinotNoirData, ...shirazSyrahData, ...cabernetData, ...merlotData, ...internationalRedData, ...otherRedData, ...sauvignonBlancData, ...pinotGrisData, ...chardonnayData, ...rieslingData, ...viognierData, ...gewurztraminerData, ...dessertData, ...internationalWhiteData, ...otherWhiteData, ...waterData, ...juiceData, ...carbonatedData, ...cordialsData, ...energySportsData, ...confectioneryData, ...chipsNutsData, ...flavouredWhiskyData, ...bourbonData, ...ginData, ...vodkaData, ...tequilaData, ...readyMadeCocktailsData, ...allSpiritsData, ...roseData, ...sparklingData, ...spritzData, ...portAndSherryData, ...caskData, ...nonAlcoholicData, ...vodkaRtdData, ...ginRtdData, ...bourbonRtdData, ...whiskyRtdData, ...rumRtdData, ...tequilaRtdData, ...ciderData];

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
