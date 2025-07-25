//npm modules
const express = require("express");
const morgan = require('morgan'); // morgan is logging middleware. That's gonna allow us to see request data in the console
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');

//custom modules
const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./controllers/errorController.js");
const mappingRouter = require("./routes/mapping.routes.js");
const userRouter = require("./routes/user.routes.js");
const productRouter = require("./routes/product.routes.js");
const pricechangeRouter = require("./routes/pricechange.routes.js");
const watchlistRouter = require("./routes/watchlist.routes.js");
const analyticsRouter = require("./routes/analytics.routes.js");
const reportsRouter = require("./routes/reports.routes.js");
const fnbreportsRouter = require("./routes/fnbreports.routes.js");
const fnbproductRouter = require("./routes/fnbproduct.routes.js");
const organisationRouter = require("./routes/organisation.routes.js");
const leadsRouter = require("./routes/leads.routes.js");
const aiRouter = require("./routes/ai.routes.js");
const puppeteer = require("puppeteer");




const scrapingService = require("./helpers/scrapingService.js");
const ujjwalScrapingService = require("./helpers/ujjwalScrapingService.js");

//node modules
const path = require("path");
const checkMaintenance = require("./utils/checkMaintenance.js");
const updateProductPriceRank = require("./helpers/updateProductPriceRank.js");
const updateDailyPriceStats = require("./helpers/updateDailyPriceStats.js");
const precomputeDailyData = require("./helpers/precomputeDailyData.js");
const redisClient = require("./configs/redis.config.js");
const pool = require("./configs/postgresql.config.js");
const precomputeDailyDataFNB = require("./helpers/precomputeDailyDataFNB.js");
const scrapeAelia = require("./helpers/scrapeAelia.js");
// const precomputeDailyDataAdmin = require("./helpers/precomputeDailyDataAdmin.js");

const app = express();

app.use(checkMaintenance);

// Set EJS as the view engine and specify the views directory
app.use(express.static('views'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development ') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
    ]
  })
);


//attaching routers
app.use("/api/v1/user",userRouter);
app.use("/api/v1/mapping",mappingRouter);
app.use("/api/v1/product",productRouter);
app.use("/api/v1/price-change",pricechangeRouter);
app.use("/api/v1/watchlist",watchlistRouter);
app.use("/api/v1/analytics",analyticsRouter);
app.use("/api/v1/reports",reportsRouter);
app.use("/api/v1/leads",leadsRouter);
app.use("/api/v1/ai",aiRouter);


app.use("/api/v1/fnbproduct",fnbproductRouter);
app.use("/api/v1/fnbreports",fnbreportsRouter);
app.use("/api/v1/organisation",organisationRouter);

app.use("/precompute",(req,res)=>{
  precomputeDailyData('aelia_auckland',true);
precomputeDailyDataFNB();
})


//Throwing error if no matched route found
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global error handler
app.use(globalErrorHandler);


// ujjwalScrapingService();

//testing pupetter as well as ci/cd
// scrapingService();


const testWebsite = async ()=>{
  let doneAuckland = false;

  let start_page = 1,
    end_page = 1;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

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
  
  while(!doneAuckland){
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
    start_page+=1;
    end_page+=1;
  }

}
// testWebsite();
// const insertStatsTemp = async ()=>{
//    await updateProductPriceRank();
//    await updateDailyPriceStats('aelia_auckland');
// }

// const getBackStandardQty = (qty,unit)=>{
//   if(unit=='l'||unit=='kg') return qty*100;
//   else return qty*1;
// }
// insertStatsTemp();
// const temp = async ()=>{
//   const data = JSON.parse(await redisClient.get('daily_product_data'));
//   const websiteCounts1 = {};

//   data.map(el=>{
//     el?.products_data?.map(el2=>{
//       if(!websiteCounts1[el2?.website]) websiteCounts1[el2?.website]=1;
//       else websiteCounts1[el2?.website]+=1;
//     })
//   })
//   // console.log(data);
//   // console.log(websiteCounts1);
//   // console.log(data.find(el=>el.canprod_id==119));

//   // const websiteCounts = {};

//   // finalData.map(el=>{
//   //   el?.products_data?.map(el2=>{
//   //     if(!websiteCounts[el2?.website]) websiteCounts[el2?.website]=1;
//   //     else websiteCounts[el2?.website]+=1;
//   //   })
//   // })
//   // console.log(finalData);
//   // console.log(websiteCounts);
// }
//pricerank, id->product_id, latest_price, latest_promotions, price_per_unit
// temp();
precomputeDailyData('aelia_auckland',true);
precomputeDailyDataFNB();

// Schedule the task to run at 12 AM New Zealand Time
cron.schedule('50 5 * * *', scrapingService, {
  scheduled: true,
  timezone: 'Pacific/Auckland', // New Zealand timezone
});
 
module.exports = app;