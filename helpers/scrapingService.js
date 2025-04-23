const redisClient = require("../configs/redis.config");
const extract_unit_and_quantity = require("./extract_unit_and_quantity");
const logError = require("./logError");
const precomputeDailyData = require("./precomputeDailyData");
const precomputeDailyDataFNB = require("./precomputeDailyDataFNB");
const scrapeAelia = require("./scrapeAelia");
const scrapeAeliaChristchurch = require("./scrapeAeliaChristchurch");
const scrapeAeliaQueensland = require("./scrapeAeliaQueensland");
const scrapeBeautyBliss = require("./scrapeBeautyBliss");
const scrapeBigBarrel = require("./scrapeBigBarrel");
const scrapeChemistWarehouse = require("./scrapeChemistWarehourse");
const scrapeFarmers = require("./scrapeFarmers");
const scrapeHeinemannSydney = require("./scrapeHeinemannSydney");
const scrapeLotteBrisbane = require("./scrapeLotteBrisbane");
const scrapeLotteMelbourne = require("./scrapeLotteMelbourne");
const scrapeMecca = require("./scrapeMecca");
const scrapeNzLiquor = require("./scrapeNzLiquor");
const scrapeSephora = require("./scrapeSephora");
const scrapeWhiskyAndMore = require("./scrapeWhiskyAndMore");
const updateDailyPriceStats = require("./updateDailyPriceStats");
const updateProductPriceRank = require("./updateProductPriceRank");
const waitForXTime = require("./waitForXTime");
const puppeteer = require('puppeteer');

const scrapingService =async ()=>{

   console.log("scraping started at:"+Date.now());

   let doneAuckland = false, doneQueensland = false, doneSydney = false, doneMelbourne = false, doneBrisbane = false, doneChristchurch = false, doneWhiskyAndMore = false, doneNzLiquor=false, doneBigBarrel=false, doneSephora=false, doneBeautyBliss = false, doneMecca = false, doneFarmers = false, doneChemistWarehouse=false;
   let start_page=1, end_page = 1;

   let internalStates = {
      auckland:{
        baijiu:false,
        brandy:false,
        cognac:false,
        fortified:false,
        fragrance:false,
        gift_sets:false,
        gin:false,
        liqueurs:false,
        makeup:false,
        mini_bottles:false,
        premium_spirits:false,
        premium_wine:false,
        red:false,
        rose:false,
        rum:false,
        skin_care:false,
        sparkling_champagne:false,
        tequila:false,
        vodka:false,
        whisky:false,
        white:false
      },
      queensland:{
         baijiu:false,
        brandy:false,
        cognac:false,
        fragrance:false,
        gift_sets:false,
        gin:false,
        liqueurs:false,
        makeup:false,
        mini_bottles:false,
        premium_spirits:false,
        premium_wine:false,
        red:false,
        rose:false,
        rum:false,
        skin_care:false,
        sparkling_champagne:false,
        tequila:false,
        vodka:false,
        whisky:false,
        white:false
      },
      sydney:{
         accessories:false,
         american_whisky:false,
         australian_whisky:false,
         bath_and_shower:false,
         bitter_aperitif:false,
         blended_whisky:false,
         blusher:false,
         body_care:false,
         bodycare_care:false,
         canadian_whisky:false,
         care:false,
         champagne:false,
         cleansing:false,
         cognac_brandy:false,
         concealer:false,
         eye_care:false,
         eye_shadow:false,
         eyebrows:false,
         eyeliner:false,
         foot_care:false,
         fortified_wine:false,
         foundation:false,
         gin:false,
         hair_care:false,
         hand_care:false,
         home_fragrance_candle:false,
         irish_whisky:false,
         japanese_whisky:false,
         lipstick_and_lipliner:false,
         liqueur:false,
         makeup_sets:false,
         mascara:false,
         masks:false,
         men_bath_and_shower:false,
         men_fragrance_set:false,
         men_fragrance:false,
         men_skincare:false,
         powders:false,
         red_wine:false,
         rose_wine:false,
         rum:false,
         scotch_whisky:false,
         serum:false,
         sherry_port:false,
         single_malt_whisky:false,
         skin_care_sets:false,
         sparkling_wine:false,
         sun_care:false,
         tequila:false,
         toiletries:false,
         vodka:false,
         white_wine:false,
         women_fragrance_set:false,
         women_fragrance:false
      },
      melbourne:{
         spirits:false,
         beauty:false
      },
      brisbane:{
         spirits:false,
         beauty:false
      },
      christchurch:{
        baijiu:false,
        brandy:false,
        cognac:false,
        fragrance:false,
        gift_sets:false,
        gin:false,
        liqueurs:false,
        makeup:false,
        mini_bottles:false,
        premium_spirits:false,
        premium_wine:false,
        red:false,
        rose:false,
        rum:false,
        skin_care:false,
        sparkling_champagne:false,
        tequila:false,
        vodka:false,
        whisky:false,
        white:false
      },
      whiskyAndMore:{
         whisky:false,
         malt:false,
         intlWhisky:false,
         beer:false,
         wine:false
      },
      nzLiquor:{
         spirits:false,
         wine:false,
         beer:false
      },
      bigBarrel:{
         spirits:false,
         wine:false,
         beer:false,
         special:false
      },
      sephora:{
         makeup:false,
         skincare:false,
         tools:false,
         hair:false,
         fragrance:false,
         clean:false,
         bath:false
      },
      beautyBliss:{
         makeup:false,
         skincare:false,
         tools:false,
         hair:false,
         bath:false
      },
      mecca:{
         makeup:false,
         skincare:false,
         hair:false,
         fragrance:false,
         body:false
      },
      farmers:{
         face:false,
         makeup:false,
         lips:false,
         eyes:false,
         tools:false,
         tools2:false,
         womenPerfume:false,
         menAfterShave:false,
         deodorant:false,
         moisturiser:false,
         exfoliators:false,
         cleansers:false,
         toners:false,
         treatments:false,
         eyecream:false,
         grooming:false,
         nailtools:false,
         nailpolish:false,
         bodycare:false,
         footcare:false,
         bathcare:false,
         suncare:false,
         haircare:false,
         haircolor:false,
         hairaccessories:false,
         skincare:false,
         collegens:false
      },
      chemistWarehouse:{
         fragrance:false,
         beauty:false,
         skincare:false,
         cosmetic:false,
         haircare:false
      }
   };

   while(!doneAuckland||!doneQueensland||!doneSydney||!doneMelbourne||!doneBrisbane||!doneChristchurch||!doneWhiskyAndMore||!doneNzLiquor||!doneBigBarrel||!doneSephora||!doneBeautyBliss||!doneMecca||!doneFarmers||!doneChemistWarehouse){

      const browser = await puppeteer.launch({headless:true ,args: ['--no-sandbox', '--disable-setuid-sandbox']});

      if(!doneAuckland)
      try{
         doneAuckland = await scrapeAelia(start_page,end_page,internalStates,browser);
      }catch(err){
         console.log("There was an error while scraping from aelia auckland");
         logError(err);
      }

      if(!doneQueensland)
      try{
         doneQueensland = await scrapeAeliaQueensland(start_page,end_page,internalStates,browser);
      }catch(err){
         console.log("There was an error while scraping from aelia queensland");
         logError(err);
      }

      if(!doneSydney)
      try{
         doneSydney = await scrapeHeinemannSydney(start_page,end_page,internalStates,browser);
      }catch(err){
         console.log("There was an error while scraping from heinemann sydney");
         logError(err);
      }

      if(!doneMelbourne)
      try{
         doneMelbourne = await scrapeLotteMelbourne(start_page,end_page,internalStates,browser);
      }catch(err){
         console.log("There was an error while scraping from lotte melbourne");
         logError(err);
      }

      if(!doneBrisbane)
      try{
         doneBrisbane = await scrapeLotteBrisbane(start_page,end_page,internalStates,browser);
      }catch(err){
         console.log("There was an error while scraping from lotte brisbane");
         logError(err);
      }

      if(!doneChristchurch)
      try{
         doneChristchurch = await scrapeAeliaChristchurch(start_page,end_page,internalStates,browser);
      }catch(err){
         console.log("There was an error while scraping from aelia christchruch");
         logError(err);
      }  

      if(!doneWhiskyAndMore)
      try{
         doneWhiskyAndMore = await scrapeWhiskyAndMore(start_page,end_page,internalStates,browser);
      }catch(err){
         console.log("There was an error while scraping from whisky and more");
         logError(err);
      }

      if(!doneNzLiquor)
      try{
         doneNzLiquor = await scrapeNzLiquor(start_page,end_page,internalStates,browser);
      }catch(err){
         console.log("There was an error while scraping from nz liquor");
         logError(err);
      }

      if(!doneBigBarrel)
      try{
         doneBigBarrel = await scrapeBigBarrel(start_page,end_page,internalStates,browser);
      }catch(err){
         console.log("There was an error while scraping from big barrel");
         logError(err);
      }

      if(!doneBeautyBliss)
      try{
         doneBeautyBliss = await scrapeBeautyBliss(start_page,end_page,internalStates,browser);
      }catch(err){
         console.log("There was an error while scraping from beauty bliss");
         logError(err);
      }

      if(!doneMecca)
      try{
         doneMecca = await scrapeMecca(start_page,end_page,internalStates,browser);
      }catch(err){
         console.log("There was an error while scraping from mecca");
         logError(err);
      }

      if(!doneFarmers)
      try{
         doneFarmers = await scrapeFarmers(start_page,end_page,internalStates,browser);
      }
      catch(err){
         console.log("There was an error while scraping from farmers");
         logError(err);
      }

      await browser.close();

      if(!doneSephora)
      try{
         doneSephora = await scrapeSephora(start_page,end_page,internalStates);
      }catch(err){
         console.log("There was an error while scraping from sephora");
         logError(err);
      }

      if(!doneChemistWarehouse)
      try{
         doneChemistWarehouse = await scrapeChemistWarehouse((((end_page/1)-1)*5)+1,(((end_page/1))*5),internalStates);
      }
      catch(err){
         console.log("There was an error while scraping from chemist warehouse");
         logError(err);
      }

      end_page+=1;
      start_page+=1;

      await waitForXTime(10000);
   }
   await redisClient.flushAll();
   console.log('Cache cleared');
   await extract_unit_and_quantity();
   await updateProductPriceRank();
   await updateDailyPriceStats('aelia_auckland');
   await precomputeDailyData('aelia_auckland');
   await precomputeDailyDataFNB();
}

module.exports = scrapingService;