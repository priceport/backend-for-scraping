const extract_unit_and_quantity = require("./extract_unit_and_quantity");
const logError = require("./logError");
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
const waitForXTime = require("./waitForXTime");
const puppeteer = require('puppeteer');

const scrapingService =async ()=>{
   console.log("scraping started at:"+Date.now());

   let doneAuckland = false, doneQueensland = false, doneSydney = false, doneMelbourne = false, doneBrisbane = false, doneChristchurch = false, doneWhiskyAndMore = false, doneNzLiquor=false, doneBigBarrel=false, doneSephora=false, doneBeautyBliss = false, doneMecca = false, doneFarmers = false;
   let start_page=1, end_page = 1;

   let internalStates = {
      auckland:{
         spirits:false,
         wine:false,
         beauty:false
      },
      queensland:{
         spirits:false,
         wine:false,
         beauty:false
      },
      sydney:{
         spirits:false,
         wine:false,
         makeup:false,
         fragrance:false,
         skincare:false
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
         spirits:false,
         wine:false,
         beauty:false
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
      }
   };

   while(!doneAuckland||!doneQueensland||!doneSydney||!doneMelbourne||!doneBrisbane||!doneChristchurch||!doneWhiskyAndMore||!doneNzLiquor||!doneBigBarrel||!doneSephora||!doneBeautyBliss||!doneMecca||!doneFarmers||end_page<=5){

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

      // if(!doneSephora)
      // try{
      //    doneSephora = await scrapeSephora(start_page,end_page,internalStates,browser);
      // }catch(err){
      //    console.log("There was an error while scraping from sephora");
      //    logError(err);
      // }

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
         await scrapeFarmers(start_page,end_page,internalStates,browser);
      }
      catch(err){
         console.log("There was an error while scraping from farmers");
         logError(err);
      }

      // if((end_page/1)<=5)
      // try{
      //    await scrapeChemistWarehouse(end_page/1,end_page,browser);
      // }
      // catch(err){
      //    console.log("There was an error while scraping from chemist warehouse");
      //    logError(err);
      // }

      end_page+=1;
      start_page+=1;

      await browser.close();

      await waitForXTime(10000);
   }
   extract_unit_and_quantity();
}

module.exports = scrapingService;