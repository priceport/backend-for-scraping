const redisClient = require("../configs/redis.config");
const extract_unit_and_quantity = require("./extract_unit_and_quantity");
const logError = require("./logError");
const precomputeDailyData = require("./precomputeDailyData");
const precomputeDailyDataFNB = require("./precomputeDailyDataFNB");

// Domestic websites
const scrapeWhiskyAndMore = require("./scrapeWhiskyAndMore");
const scrapeNzLiquor = require("./scrapeNzLiquor");
const scrapeLiquorland = require("./scrapeLiquorland");
const scrapeBigBarrel = require("./scrapeBigBarrel");
const scrapeSephora = require("./scrapeSephora");
const scrapeBeautyBliss = require("./scrapeBeautyBliss");
const scrapeMecca = require("./scrapeMecca");
const scrapeFarmers = require("./scrapeFarmers");
const scrapeChemistWarehouse = require("./scrapeChemistWarehourse");
const scrapeTheIconic = require("./scrapeTheIconic");
const scrapeAuMecca = require("./scrapeAuMecca");
const scrapeAuSephora = require("./scrapeAuSephora");
const scrapeAuChemistWarehouse = require("./scrapeAuChemistWarehouse");
const scrapeDanMurphy = require("./scrapeDanMurphy");
const scrapeLifepharmacy = require("./scrapeLifepharmacy");
const scrapeLiquorlandAus = require("./scrapeLiquorLandAus");

const updateDailyPriceStats = require("./updateDailyPriceStats");
const updateProductPriceRank = require("./updateProductPriceRank");
const waitForXTime = require("./waitForXTime");
const puppeteer = require("puppeteer");
const { precomputeLivePriceChanges } = require("./precompuetLivePriceChanges");



const scrapingService =async ()=>{

  // Domestic websites
  let doneWhiskyAndMore = true,
    doneNzLiquor = true,
    doneLiquorland = true,
    doneBigBarrel = true,
    doneSephora = true,
    doneBeautyBliss = true,
    doneMecca = true,
    doneFarmers =false,
    doneChemistWarehouse = true,
    doneTheIconic = true,
    doneAuMecca = true,
    doneAuSephora = true,
    doneAuChemistWarehouse = true,
    doneDanMurphy = true,
    doneLifepharmacy = true,
    doneLiquorlandAus = true


  let start_page = 1,
    end_page = 1;

  let internalStates = {
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
    liquorland: {
      spirits: false,
      liqueurs: false,
      dark_rum: false,
      white_rum: false,
      scotch_whisky: false,
      irish_whiskey: false,
      nz_whisky: false,
      aperitifs: false,
      creme_liqueurs: false,
      schnapps: false,
      vermouth: false,
      budget_beer: false,
      low_carb_beer: false,
      nz_boutique: false,
      pinot_noir: false,
      shiraz_syrah: false,
      cabernet: false,
      merlot: false,
      international_red: false,
      sauvignon_blanc: false,
      pinot_gris: false,
      chardonnay: false,
      riesling: false,
      viognier: false,
      gewurztraminer: false,
      dessert: false,
      international_white: false,
      water:false,
      juice:false,
      carbonated:false,
      cordials:false,
      energy_sports:false,
      confectionery:false,
      chips_nuts:false,
      flavoured_whisky:false,
      bourbon:false,
      gin:false,
      vodka:false,
      tequila:false,
      ready_made_cocktails:false,
      all_spirits:false,
      standard_liqueurs:false,
      kiwi_classics:false,
      international_beer:false,
      low_alc_beer:false,
      non_alc_beer:false,
      kiwi_craft:false,
      rose:false,
      sparkling:false,
      spritz:false,
      port_and_sherry:false,
      cask:false,
      non_alcoholic:false,
      vodka_rtd:false,
      gin_rtd:false,
      bourbon_rtd:false,
      whisky_rtd:false,
      rum_rtd:false,
      tequila_rtd:false,
      cider:false,
      
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
    liquorlandAus : {
      vodka:false,
      gin:false,
      whisky:false,
      rum:false,
      bourbon:false,
      tequila:false,
      brandy_and_cognac:false,
      liqueurs:false,
      aperitifs:false,
      mixers:false,
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
      },
      lifepharmacy : {
        medicines:false,
        skincare_treatments: false,
        family_planning: false,
        first_aid: false,
        hair_care: false,
        hair_colour: false,
        hair_styling: false,
        home_health_devices: false,
        mens_fragrance: false,
        womens_fragrance: false,
        home_fragrance: false,
        face: false,
        eyes: false,
        lips: false,
        nails: false,
        make_up_sets: false,
        make_up_accessories: false,
        moisturisers: false,
        cleansers_scrubs: false,
        toners: false,
        serums_treatments: false,
        eye_treatments: false,
        masks_peels: false,
        medicated_skincare: false,
        lip_care: false,
        skincare_gift_sets: false,
        skincare_supplements: false,
        facial_wipes: false,
        lash_brow_serums: false
      }
  };

  while (
    !doneWhiskyAndMore ||
    !doneNzLiquor ||
    !doneLiquorland ||
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
    !doneDanMurphy ||
    !doneLifepharmacy ||
    !doneLiquorlandAus
  ) {
    console.log("current page",start_page);
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

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

    if (!doneLiquorland) {
      try {
        doneLiquorland = await scrapeLiquorland(
            start_page,
            end_page,
            internalStates,
            browser
          );
      } catch (err) {
        console.log("There was an error while scraping from liquorland");
        logError(err);
      }
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

    if (!doneLiquorlandAus)
      try {
        doneLiquorlandAus = await scrapeLiquorlandAus(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from liquorland aus");
        logError(err);
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

    if (!doneLifepharmacy)
      try {
        doneLifepharmacy = await scrapeLifepharmacy(
          start_page,
          end_page,
          internalStates,
          browser
        );
      } catch (err) {
        console.log("There was an error while scraping from lifepharmacy");
        logError(err);
      }

    // Close shared browser before Dan Murphy (which creates its own browsers)
    await browser.close();

    // Run Dan Murphy independently (creates its own browsers)
    if(!doneDanMurphy)
      try{
          doneDanMurphy = await scrapeDanMurphy(start_page);
      }catch(err){
         console.log("There was an error while scraping from dan murphy");
         logError(err);
      }

    if (!doneSephora)
        try {
          doneSephora = await scrapeSephora(
            start_page,
            end_page,
            internalStates
          );
        } catch (err) {
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
};

module.exports = scrapingService;
