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




const scrapingService = require("./helpers/scrapingService.js");

//node modules
const path = require("path");
const checkMaintenance = require("./utils/checkMaintenance.js");
const updateProductPriceRank = require("./helpers/updateProductPriceRank.js");
const updateDailyPriceStats = require("./helpers/updateDailyPriceStats.js");
const precomputeDailyData = require("./helpers/precomputeDailyData.js");
const redisClient = require("./configs/redis.config.js");
const pool = require("./configs/postgresql.config.js");
const precomputeDailyDataFNB = require("./helpers/precomputeDailyDataFNB.js");
const precomputeDailyDataAdmin = require("./helpers/precomputeDailyDataAdmin.js");

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
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
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


//Throwing error if no matched route found
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global error handler
app.use(globalErrorHandler);

//testing pupetter as well as ci/cd
// scrapingService();

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
precomputeDailyData('aelia_auckland');
precomputeDailyDataFNB();

// Schedule the task to run at 12 AM New Zealand Time
cron.schedule('10 12 * * *', scrapingService, {
  scheduled: true,
  timezone: 'Pacific/Auckland', // New Zealand timezone
});

module.exports = app;