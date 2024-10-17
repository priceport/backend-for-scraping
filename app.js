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
const scrapingService = require("./helpers/scrapingService.js");

//node modules
const path = require("path");

const app = express();

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
app.use("/api/v1/mapping",mappingRouter);

//Throwing error if no matched route found
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Global error handler
app.use(globalErrorHandler);

//testing pupetter as well as ci/cd
// scrapingService();

// Schedule the task to run at 12 AM New Zealand Time
cron.schedule('10 0 * * *', scrapingService, {
  scheduled: true,
  timezone: 'Pacific/Auckland', // New Zealand timezone
});

module.exports = app;