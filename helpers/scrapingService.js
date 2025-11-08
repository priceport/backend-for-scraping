const redisClient = require("../configs/redis.config");
const extract_unit_and_quantity = require("./extract_unit_and_quantity");
const logError = require("./logError");
const precomputeDailyData = require("./precomputeDailyData");
const precomputeDailyDataFNB = require("./precomputeDailyDataFNB");
const scrapeAelia = require("./scrapeAelia");
const scrapeAeliaAdelaide = require("./scrapeAeliaAdelaide");
const scrapeAeliaChristchurch = require("./scrapeAeliaChristchurch");
const scrapeAeliaQueensland = require("./scrapeAeliaQueensland");
const scrapeAeliaCairns = require("./scrapeAeliaCairns");
const scrapeBeautyBliss = require("./scrapeBeautyBliss");
const scrapeBigBarrel = require("./scrapeBigBarrel");
const scrapeChemistWarehouse = require("./scrapeChemistWarehourse");
const scrapeFarmers = require("./scrapeFarmers");
const scrapeHeinemannSydney = require("./scrapeHeinemannSydney");
const scrapeHeinemannGoldcoast = require("./scrapeHeinemannGoldcoast");
const scrapeLotteBrisbane = require("./scrapeLotteBrisbane");
const scrapeLotteMelbourne = require("./scrapeLotteMelbourne");
const scrapeMecca = require("./scrapeMecca");
const scrapeNzLiquor = require("./scrapeNzLiquor");
const scrapeSephora = require("./scrapeSephora");
const scrapeWhiskyAndMore = require("./scrapeWhiskyAndMore");
const scrapeDanMurphy = require("./scrapeDanMurphy");

const updateDailyPriceStats = require("./updateDailyPriceStats");
const updateProductPriceRank = require("./updateProductPriceRank");
const waitForXTime = require("./waitForXTime");
const puppeteer = require("puppeteer");
const scrapeTheIconic = require("./scrapeTheIconic");
const scrapeAuMecca = require("./scrapeAuMecca");
const scrapeAuSephora = require("./scrapeAuSephora");
const scrapeAuChemistWarehouse = require("./scrapeAuChemistWarehouse");
const scrapeAuThemall = require("./scrapeAuThemall");
const { precomputeLivePriceChanges } = require("./precompuetLivePriceChanges");



const scrapingService =async ()=>{

  let doneAuckland = false,
    doneAdelaide = false,
    doneQueensland = false,
    doneSydney = false,
    doneGoldcoast = false,
    doneMelbourne = false,
    doneBrisbane = false,
    doneChristchurch = false,
    doneCairns = false,
    doneWhiskyAndMore = false,
    doneNzLiquor = false,
    doneBigBarrel = false,
    doneSephora = false,
    doneBeautyBliss = false,
    doneMecca = false,
    doneFarmers = false,
    doneChemistWarehouse = false,
    doneTheIconic = false,
    doneAuMecca = false,
    doneAuSephora = false,
    doneAuChemistWarehouse = false,
  doneAuThemall = false,
doneDanMurphy=false;


  let start_page = 1,
    end_page = 1;

  let internalStates = {
    auckland: {
      baijiu: false,
      brandy: false,
      cognac: false,
      fortified: false,
      fragrance: false,
      gift_sets: false,
      gin: false,
      liqueurs: false,
      makeup: false,
      mini_bottles: false,
      premium_spirits: false,
      premium_wine: false,
      red: false,
      rose: false,
      rum: false,
      skin_care: false,
      sparkling_champagne: false,
      tequila: false,
      vodka: false,
      whisky: false,
      white: false,
      lollies: false,
      chocolates: false,
      mints: false,
    },
    adelaide: {
      brandy: false,
      cognac: false,
      fragrance: false,
      gift_sets: false,
      gin: false,
      liqueurs: false,
      makeup: false,
      red: false,
      rose: false,
      rum: false,
      skin_care: false,
      sparkling_champagne: false,
      tequila: false,
      vodka: false,
      whisky: false,
      white: false,
    },
    cairns: {
      brandy: false,
      cognac: false,
      fragrance: false,
      gift_sets: false,
      gin: false,
      liqueurs: false,
      makeup: false,
      red: false,
      rose: false,
      rum: false,
      skin_care: false,
      sparkling_champagne: false,
      tequila: false,
      vodka: false,
      whisky: false,
      white: false,
    },
    queensland: {
      baijiu: false,
      brandy: false,
      cognac: false,
      fragrance: false,
      gift_sets: false,
      gin: false,
      liqueurs: false,
      makeup: false,
      mini_bottles: false,
      premium_spirits: false,
      premium_wine: false,
      red: false,
      rose: false,
      rum: false,
      skin_care: false,
      sparkling_champagne: false,
      tequila: false,
      vodka: false,
      whisky: false,
      white: false,
    },
    sydney: {
      accessories: false,
      american_whisky: false,
      australian_whisky: false,
      bath_and_shower: false,
      bitter_aperitif: false,
      blended_whisky: false,
      blusher: false,
      body_care: false,
      bodycare_care: false,
      canadian_whisky: false,
      care: false,
      champagne: false,
      cleansing: false,
      cognac_brandy: false,
      concealer: false,
      eye_care: false,
      eye_shadow: false,
      eyebrows: false,
      eyeliner: false,
      foot_care: false,
      fortified_wine: false,
      foundation: false,
      gin: false,
      hair_care: false,
      hand_care: false,
      home_fragrance_candle: false,
      irish_whisky: false,
      japanese_whisky: false,
      lipstick_and_lipliner: false,
      liqueur: false,
      makeup_sets: false,
      mascara: false,
      masks: false,
      men_bath_and_shower: false,
      men_fragrance_set: false,
      men_fragrance: false,
      men_skincare: false,
      powders: false,
      red_wine: false,
      rose_wine: false,
      rum: false,
      scotch_whisky: false,
      serum: false,
      sherry_port: false,
      single_malt_whisky: false,
      skin_care_sets: false,
      sparkling_wine: false,
      sun_care: false,
      tequila: false,
      toiletries: false,
      vodka: false,
      white_wine: false,
      women_fragrance_set: false,
      women_fragrance: false,
    },
    goldcoast: {
      accessories: false,
      american_whisky: false,
      australian_whisky: false,
      bath_and_shower: false,
      bitter_aperitif: false,
      blended_whisky: false,
      blusher: false,
      body_care: false,
      bodycare_care: false,
      canadian_whisky: false,
      care: false,
      champagne: false,
      cleansing: false,
      cognac_brandy: false,
      concealer: false,
      eye_care: false,
      eye_shadow: false,
      eyebrows: false,
      eyeliner: false,
      foot_care: false,
      fortified_wine: false,
      foundation: false,
      gin: false,
      hair_care: false,
      hand_care: false,
      home_fragrance_candle: false,
      irish_whisky: false,
      japanese_whisky: false,
      lipstick_and_lipliner: false,
      liqueur: false,
      makeup_sets: false,
      mascara: false,
      masks: false,
      men_bath_and_shower: false,
      men_fragrance_set: false,
      men_fragrance: false,
      men_skincare: false,
      powders: false,
      red_wine: false,
      rose_wine: false,
      rum: false,
      scotch_whisky: false,
      serum: false,
      sherry_port: false,
      single_malt_whisky: false,
      skin_care_sets: false,
      sparkling_wine: false,
      sun_care: false,
      tequila: false,
      toiletries: false,
      vodka: false,
      white_wine: false,
      women_fragrance_set: false,
      women_fragrance: false,
    },
    melbourne: {
      baijiu: false,
      bath_shower: false,
      body_care: false,
      brandy: false,
      champagne: false,
      cleansers_and_toners: false,
      cognac: false,
      devices: false,
      eau_de_cologne: false,
      eau_de_parfum: false,
      eau_de_toilette: false,
      eyes: false,
      face: false,
      gin: false,
      home_fragrance: false,
      korean_liquor: false,
      lips: false,
      liqueurs: false,
      masks: false,
      moisturisers: false,
      port_and_sherry: false,
      red_wine: false,
      rum: false,
      serums_essences: false,
      sets_pack: false,
      single_malt: false,
      sparkling_wine: false,
      sun_care: false,
      tequila: false,
      treatments: false,
      vodka: false,
      whiskey: false,
      white_wine: false,
      wine_champagne_beer: false,
      confectionery:false,
    },
    brisbane: {
      baijiu: false,
      bath_shower: false,
      body_care: false,
      brandy: false,
      champagne: false,
      cleansers_and_toners: false,
      cognac: false,
      devices: false,
      eau_de_cologne: false,
      eau_de_parfum: false,
      eau_de_toilette: false,
      eyes: false,
      face: false,
      gin: false,
      home_fragrance: false,
      korean_liquor: false,
      lips: false,
      liqueurs: false,
      masks: false,
      moisturisers: false,
      port_and_sherry: false,
      red_wine: false,
      rum: false,
      serums_essences: false,
      sets_pack: false,
      single_malt: false,
      sparkling_wine: false,
      sun_care: false,
      tequila: false,
      treatments: false,
      vodka: false,
      whiskey: false,
      white_wine: false,
      wine_champagne_beer: false,
      confectionery:false,
    },
    christchurch: {
      baijiu: false,
      brandy: false,
      cognac: false,
      fragrance: false,
      gift_sets: false,
      gin: false,
      liqueurs: false,
      makeup: false,
      mini_bottles: false,
      premium_spirits: false,
      premium_wine: false,
      red: false,
      rose: false,
      rum: false,
      skin_care: false,
      sparkling_champagne: false,
      tequila: false,
      vodka: false,
      whisky: false,
      white: false,
    },
    whiskyAndMore: {
      whisky: false,
      malt: false,
      intlWhisky: false,
      beer: false,
      wine: false,
    },
    nzLiquor: {
      spirits: false,
      wine: false,
      beer: false,
    },
    bigBarrel: {
      spirits: false,
      wine: false,
      beer: false,
      special: false,
    },
    sephora: {
      makeup: false,
      skincare: false,
      tools: false,
      hair: false,
      fragrance: false,
      clean: false,
      bath: false,
    },
    auSephora: {
      makeup: false,
      skincare: false,
      tools: false,
      hair: false,
      fragrance: false,
      clean: false,
      bath: false,
    },
    beautyBliss: {
      makeup: false,
      skincare: false,
      tools: false,
      hair: false,
      bath: false,
    },
    mecca: {
      makeup: false,
      skincare: false,
      hair: false,
      fragrance: false,
      body: false,
    },
    auMecca: {
      makeup: false,
      skincare: false,
      hair: false,
      fragrance: false,
      body: false,
    },
    farmers: {
      face: false,
      makeup: false,
      lips: false,
      eyes: false,
      tools: false,
      tools2: false,
      womenPerfume: false,
      menAfterShave: false,
      deodorant: false,
      moisturiser: false,
      exfoliators: false,
      cleansers: false,
      toners: false,
      treatments: false,
      eyecream: false,
      grooming: false,
      nailtools: false,
      nailpolish: false,
      bodycare: false,
      footcare: false,
      bathcare: false,
      suncare: false,
      haircare: false,
      haircolor: false,
      hairaccessories: false,
      skincare: false,
      collegens: false,
    },
    chemistWarehouse: {
      fragrance: false,
      beauty: false,
      skincare: false,
      cosmetic: false,
      haircare: false,
    },
    auChemistWarehouse: {
      fragrance: false,
      personal_care: false,
      skincare: false,
      cosmetic: false,
      haircare: false,
    },
    theIconic: {
      serums_and_treatments: false,
      moisturisers: false,
      cleansers: false,
      eye_and_lip_care: false,
      tools: false,
      cosmeceuticals: false,
      masks: false,
      sun_care: false,
      toners_and_mists: false,
      exfoliators: false,
      face: false,
      lips: false,
      eyes: false,
      eyebrows: false,
      bags_and_tools: false,
      nails: false,
      brushes: false,
      lashes: false,
      personal_fragrance: false,
      home_fragrance: false,
      shampoo_and_conditioner: false,
      hair_tools: false,
      treatments: false,
      styling: false,
      hair_colour: false,
      bath_and_shower: false,
      hands_and_feet: false,
      body_moisturisers: false,
      personal_care: false,
      sun_and_tanning: false,
      superfoods_and_supplements: false,
      aromatherapy: false,
      wellness_essentials: false,
      skincare: false,
      fragrance: false,
      hair: false,
      grooming_tools: false,
      beard: false,
      grooming_treatments: false,
    },
    auThemall: {
      whiskey: false,
      gin: false,
      liqueurs: false,
      rum: false,
      vodka: false,
      brandy: false,
      cognac: false,
      tequila: false,
      baijiu: false,
      bourbon: false,
      champagne_sparkling: false,
      port_sherry: false,
      red_wine: false,
      rose_wine: false,
      white_wine: false,
      luxury_wine: false,
      womens_fragrance: false,
      mens_fragrance: false,
      unisex_fragrance: false,
      under_80: false,
      moisturisers: false,
      cleansers_toners: false,
      masks_exfoliators: false,
      serums_boosters: false,
      eyes: false,
      lips: false,
      suncare: false,
      face: false,
      makeup_eyes: false,
      makeup_lips: false,
      tools: false,
      body: false,
      bath_shower: false,
      hair: false,
      hand_feet_care: false,
      bath_suncare: false,
      nz_skincare: false,
      nz_body: false,
      mens_skincare: false,
      mens_body: false,
      mens_grooming: false,
    },
    danMurphy:{
         aperitifs:false,
         baijiu:false,
         beer:false,
         bourbon:false,
         brandy_cognac:false,
         champagne_sparkling:false,
         cider:false,
         gin:false,
         liqueurs:false,
         premix_drinks:false,
         red_wine:false,
         rum:false,
         sake:false,
         soju_shochu:false,
         spirits:false,
         tequila:false,
         vodka:false,
         whisky:false,
         white_wine:false
      }
  };

  while (
    !doneAuckland ||
    !doneAdelaide ||
    !doneQueensland ||
    !doneSydney ||
    !doneGoldcoast ||
    !doneMelbourne ||
    !doneBrisbane ||
    !doneChristchurch ||
    !doneCairns ||
    !doneWhiskyAndMore ||
    !doneNzLiquor ||
    !doneBigBarrel ||
    !doneSephora ||
    !doneBeautyBliss ||
    !doneMecca ||
    !doneFarmers ||
    !doneChemistWarehouse ||
    !doneTheIconic ||
    !doneAuMecca ||
    !doneAuSephora ||
    !doneAuChemistWarehouse ||
    !doneAuThemall
  ) {
    console.log("current page",start_page);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    if (!doneAuckland)
      try {
        doneAuckland = await scrapeAelia(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from aelia auckland");
        logError(err);
      }

    if (!doneAdelaide)
      try {
        doneAdelaide = await scrapeAeliaAdelaide(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from aelia adelaide");
        logError(err);
      }

    if (!doneQueensland)
      try {
        doneQueensland = await scrapeAeliaQueensland(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from aelia queensland");
        logError(err);
      }

    if (!doneCairns)
      try {
        doneCairns = await scrapeAeliaCairns(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from aelia cairns");
        logError(err);
      }

    if (!doneSydney)
      try {
        doneSydney = await scrapeHeinemannSydney(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from heinemann sydney");
        logError(err);
      }

    if (!doneGoldcoast)
      try {
        doneGoldcoast = await scrapeHeinemannGoldcoast(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log(
          "There was an error while scraping from heinemann goldcoast"
        );
        logError(err);
      }

    if (!doneMelbourne)
      try {
        doneMelbourne = await scrapeLotteMelbourne(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from lotte melbourne");
        logError(err);
      }

    if (!doneBrisbane)
      try {
        doneBrisbane = await scrapeLotteBrisbane(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from lotte brisbane");
        logError(err);
      }

    if (!doneChristchurch)
      try {
        doneChristchurch = await scrapeAeliaChristchurch(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log(
          "There was an error while scraping from aelia christchruch"
        );
        logError(err);
      }

    if (!doneWhiskyAndMore)
      try {
        doneWhiskyAndMore = await scrapeWhiskyAndMore(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from whisky and more");
        logError(err);
      }

    if (!doneNzLiquor)
      try {
        doneNzLiquor = await scrapeNzLiquor(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from nz liquor");
        logError(err);
      }

    if (!doneBigBarrel)
      try {
        doneBigBarrel = await scrapeBigBarrel(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from big barrel");
        logError(err);
      }

    if (!doneBeautyBliss)
      try {
        doneBeautyBliss = await scrapeBeautyBliss(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from beauty bliss");
        logError(err);
      }

    if (!doneMecca)
      try {
        doneMecca = await scrapeMecca(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from mecca");
        logError(err);
      }

    if (!doneFarmers)
      try {
        doneFarmers = await scrapeFarmers(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from farmers");
        logError(err);
      }

    if (!doneAuThemall) {
      try {
        doneAuThemall = await scrapeAuThemall(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from auckland themall");
        logError(err);
      }
    }

    if (!doneAuMecca)
      try {
        doneAuMecca = await scrapeAuMecca(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from australia mecca");
        logError(err);
      }

    if (!doneAuSephora)
      try {
        doneAuSephora = await scrapeAuSephora(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from australia sephora");
        logError(err);
      }

    await browser.close();


      if(!doneDanMurphy)
      try{
          await scrapeDanMurphy(start_page,end_page,internalStates,browser);
      }catch(err){
         console.log("There was an error while scraping from dan murphy");
         logError(err);
      }

      if(!doneSephora)
      try{
         doneSephora = await scrapeSephora(start_page,end_page,internalStates);
      }catch(err){
         console.log("There was an error while scraping from sephora");
         logError(err);
      }

    if (!doneChemistWarehouse)
      try {
        doneChemistWarehouse = await scrapeChemistWarehouse(
          (end_page / 1 - 1) * 5 + 1,
          (end_page / 1) * 5,
          internalStates
        );
      } catch (err) {
        console.log("There was an error while scraping from chemist warehouse");
        logError(err);
      }

    if (!doneTheIconic)
      try {
        doneTheIconic = await scrapeTheIconic(
          start_page,
          end_page,
          internalStates
        );
      } catch (err) {
        console.log(
          "There was an error while scraping from australia the iconic"
        );
        logError(err);
      }

    if (!doneAuChemistWarehouse) {
      try {
        doneAuChemistWarehouse = await scrapeAuChemistWarehouse(
          start_page,
          end_page,
          internalStates
        );
      } catch (err) {
        console.log(
          "There was an error while scraping from australia chemist warehouse"
        );
        logError(err);
      }
    }

    end_page += 1;
    start_page += 1;

    await waitForXTime(10000);
  }
  
  // Clear all Redis cache except live_price_changes_* keys
  console.log("Clearing Redis cache while preserving live price changes...");
  
  try {
    // Get all keys
    const allKeys = await redisClient.keys('*');
    
    // Filter out live_price_changes_* keys
    const keysToDelete = allKeys.filter(key => !key.startsWith('live_price_changes_'));
    
    if (keysToDelete.length > 0) {
      // Delete keys in batches to avoid memory issues
      const batchSize = 1000;
      for (let i = 0; i < keysToDelete.length; i += batchSize) {
        const batch = keysToDelete.slice(i, i + batchSize);
        await Promise.all(batch.map(key => redisClient.del(key)));
      }
      console.log(`Cleared ${keysToDelete.length} keys from Redis cache`);
    }
    
    // Log preserved keys
    const preservedKeys = allKeys.filter(key => key.startsWith('live_price_changes_'));
    if (preservedKeys.length > 0) {
      console.log(`Preserved ${preservedKeys.length} live price change keys:`, preservedKeys.slice(0, 5), preservedKeys.length > 5 ? '...' : '');
    }
    
  } catch (error) {
    console.log("Error clearing Redis cache:", error.message);
  }

  // await redisClient.flushAll();
  // await redisClient.del('daily_product_data_fnb');
  // await redisClient.del('daily_product_dataaelia_auckland');
  // await redisClient.del('daily_product_dataaelia_christchurch');
  // await redisClient.del('daily_product_datalotte_melbourne');
  // await redisClient.del('daily_product_dataaelia_queenstown');
  // await redisClient.del('daily_product_datanz_themall');
  // await redisClient.del('daily_product_dataheinemann_sydney');
  // await redisClient.del('daily_product_dataaelia_adelaide');
  // await redisClient.del('daily_product_dataaelia_cairns');
  // await redisClient.del('daily_product_dataheinemann_goldcoast');
  // await redisClient.del('daily_product_datalotte_brisbane');

  
  console.log("Cache cleared");
  await extract_unit_and_quantity();
  await updateProductPriceRank();
  await updateDailyPriceStats("aelia_auckland");
  await precomputeDailyData('aelia_auckland',true);
  await precomputeDailyData('aelia_adelaide',true);
  await precomputeDailyData('nz_themall',true);
  await precomputeDailyData('lotte_melbourne',true);
  await precomputeDailyData('aelia_queenstown',true);
  await precomputeDailyData('lotte_brisbane',true);
  await precomputeDailyData('heinemann_sydney',true);
  await precomputeDailyData('aelia_christchurch',true);
  await precomputeDailyData('heinemann_goldcoast',true);
  await precomputeDailyData('aelia_cairns',true);
  await precomputeDailyDataFNB();

  await precomputeLivePriceChanges('aelia_auckland');
  // precomputeLivePriceChanges('aelia_adelaide');
  // precomputeLivePriceChanges('nz_themall');
  await precomputeLivePriceChanges('lotte_melbourne');
  // precomputeLivePriceChanges('aelia_queenstown');
  // precomputeLivePriceChanges('lotte_brisbane');
  await precomputeLivePriceChanges('heinemann_sydney');
  // precomputeLivePriceChanges('aelia_christchurch');
  // precomputeLivePriceChanges('heinemann_goldcoast');
  // precomputeLivePriceChanges('aelia_cairns');
};

module.exports = scrapingService;
