//processing script imports
const processDataForSpirits = require("./data_processing/aelia/spirits");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/aelia_adelaide/spirits");

//scraping script imports
const brandy = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/brandy");
const cognac = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/cognac");
const fragrance = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/fragrance");
const gift_sets = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/gift_sets");
const gin = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/gin");
const liqueurs = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/liqueurs");
const makeup = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/makeup");
const red = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/red");
const rose = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/rose");
const rum = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/rum");
const skin_care = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/skin_care");
const sparkling_champagne = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/sparkling_champagne");
const tequila = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/tequila");
const vodka = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/vodka");
const whisky = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/whisky");
const white = require("../scripts/scraping_scripts/duty_free/aelia_adelaide/white");

const scrapeAeliaAdelaide = async (start, end, state, browser) => {
    console.log("scraping started for aelia adelaide at:" + Date.now());

    //variable initialization
    let spiritsData = [], brandyData = [], cognacData = [], fragranceData = [], gift_setsData = [], 
        ginData = [], liqueursData = [], makeupData = [], redData = [], roseData = [], rumData = [], 
        skin_careData = [], sparkling_champagneData = [], tequilaData = [], vodkaData = [], 
        whiskyData = [], whiteData = [];

    // Brandy
    if (!state.adelaide.brandy)
        try {
            brandyData = await brandy(start, end, browser);
            console.log(`${brandyData?.length} data items scraped for brandy`);
        } catch (err) {
            console.log("There was an error while scraping brandy");
            logError(err);
        }

    if (!state.adelaide.brandy && brandyData?.length == 0)
        try {
            brandyData = await brandy(start, end, browser);
            console.log(`${brandyData?.length} data items scraped for brandy`);
            if (brandyData?.length == 0) {
                state.adelaide.brandy = true;
            }
        } catch (err) {
            console.log("There was an error while scraping brandy");
            logError(err);
        }

    // Cognac
    if (!state.adelaide.cognac)
        try {
            cognacData = await cognac(start, end, browser);
            console.log(`${cognacData?.length} data items scraped for cognac`);
        } catch (err) {
            console.log("There was an error while scraping cognac");
            logError(err);
        }

    if (!state.adelaide.cognac && cognacData?.length == 0)
        try {
            cognacData = await cognac(start, end, browser);
            console.log(`${cognacData?.length} data items scraped for cognac`);
            if (cognacData?.length == 0) {
                state.adelaide.cognac = true;
            }
        } catch (err) {
            console.log("There was an error while scraping cognac");
            logError(err);
        }

    // Fragrance
    if (!state.adelaide.fragrance)
        try {
            fragranceData = await fragrance(start, end, browser);
            console.log(`${fragranceData?.length} data items scraped for fragrance`);
        } catch (err) {
            console.log("There was an error while scraping fragrance");
            logError(err);
        }

    if (!state.adelaide.fragrance && fragranceData?.length == 0)
        try {
            fragranceData = await fragrance(start, end, browser);
            console.log(`${fragranceData?.length} data items scraped for fragrance`);
            if (fragranceData?.length == 0) {
                state.adelaide.fragrance = true;
            }
        } catch (err) {
            console.log("There was an error while scraping fragrance");
            logError(err);
        }

    // Gift Sets
    if (!state.adelaide.gift_sets)
        try {
            gift_setsData = await gift_sets(start, end, browser);
            console.log(`${gift_setsData?.length} data items scraped for gift_sets`);
        } catch (err) {
            console.log("There was an error while scraping gift_sets");
            logError(err);
        }

    if (!state.adelaide.gift_sets && gift_setsData?.length == 0)
        try {
            gift_setsData = await gift_sets(start, end, browser);
            console.log(`${gift_setsData?.length} data items scraped for gift_sets`);
            if (gift_setsData?.length == 0) {
                state.adelaide.gift_sets = true;
            }
        } catch (err) {
            console.log("There was an error while scraping gift_sets");
            logError(err);
        }

    // Gin
    if (!state.adelaide.gin)
        try {
            ginData = await gin(start, end, browser);
            console.log(`${ginData?.length} data items scraped for gin`);
        } catch (err) {
            console.log("There was an error while scraping gin");
            logError(err);
        }

    if (!state.adelaide.gin && ginData?.length == 0)
        try {
            ginData = await gin(start, end, browser);
            console.log(`${ginData?.length} data items scraped for gin`);
            if (ginData?.length == 0) {
                state.adelaide.gin = true;
            }
        } catch (err) {
            console.log("There was an error while scraping gin");
            logError(err);
        }

    // Liqueurs
    if (!state.adelaide.liqueurs)
        try {
            liqueursData = await liqueurs(start, end, browser);
            console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        } catch (err) {
            console.log("There was an error while scraping liqueurs");
            logError(err);
        }

    if (!state.adelaide.liqueurs && liqueursData?.length == 0)
        try {
            liqueursData = await liqueurs(start, end, browser);
            console.log(`${liqueursData?.length} data items scraped for liqueurs`);
            if (liqueursData?.length == 0) {
                state.adelaide.liqueurs = true;
            }
        } catch (err) {
            console.log("There was an error while scraping liqueurs");
            logError(err);
        }

    // Makeup
    if (!state.adelaide.makeup)
        try {
            makeupData = await makeup(start, end, browser);
            console.log(`${makeupData?.length} data items scraped for makeup`);
        } catch (err) {
            console.log("There was an error while scraping makeup");
            logError(err);
        }

    if (!state.adelaide.makeup && makeupData?.length == 0)
        try {
            makeupData = await makeup(start, end, browser);
            console.log(`${makeupData?.length} data items scraped for makeup`);
            if (makeupData?.length == 0) {
                state.adelaide.makeup = true;
            }
        } catch (err) {
            console.log("There was an error while scraping makeup");
            logError(err);
        }

    // Red Wine
    if (!state.adelaide.red)
        try {
            redData = await red(start, end, browser);
            console.log(`${redData?.length} data items scraped for red`);
        } catch (err) {
            console.log("There was an error while scraping red");
            logError(err);
        }

    if (!state.adelaide.red && redData?.length == 0)
        try {
            redData = await red(start, end, browser);
            console.log(`${redData?.length} data items scraped for red`);
            if (redData?.length == 0) {
                state.adelaide.red = true;
            }
        } catch (err) {
            console.log("There was an error while scraping red");
            logError(err);
        }

    // Rose Wine
    if (!state.adelaide.rose)
        try {
            roseData = await rose(start, end, browser);
            console.log(`${roseData?.length} data items scraped for rose`);
        } catch (err) {
            console.log("There was an error while scraping rose");
            logError(err);
        }

    if (!state.adelaide.rose && roseData?.length == 0)
        try {
            roseData = await rose(start, end, browser);
            console.log(`${roseData?.length} data items scraped for rose`);
            if (roseData?.length == 0) {
                state.adelaide.rose = true;
            }
        } catch (err) {
            console.log("There was an error while scraping rose");
            logError(err);
        }

    // Rum
    if (!state.adelaide.rum)
        try {
            rumData = await rum(start, end, browser);
            console.log(`${rumData?.length} data items scraped for rum`);
        } catch (err) {
            console.log("There was an error while scraping rum");
            logError(err);
        }

    if (!state.adelaide.rum && rumData?.length == 0)
        try {
            rumData = await rum(start, end, browser);
            console.log(`${rumData?.length} data items scraped for rum`);
            if (rumData?.length == 0) {
                state.adelaide.rum = true;
            }
        } catch (err) {
            console.log("There was an error while scraping rum");
            logError(err);
        }

    // Skin Care
    if (!state.adelaide.skin_care)
        try {
            skin_careData = await skin_care(start, end, browser);
            console.log(`${skin_careData?.length} data items scraped for skin_care`);
        } catch (err) {
            console.log("There was an error while scraping skin_care");
            logError(err);
        }

    if (!state.adelaide.skin_care && skin_careData?.length == 0)
        try {
            skin_careData = await skin_care(start, end, browser);
            console.log(`${skin_careData?.length} data items scraped for skin_care`);
            if (skin_careData?.length == 0) {
                state.adelaide.skin_care = true;
            }
        } catch (err) {
            console.log("There was an error while scraping skin_care");
            logError(err);
        }

    // Sparkling Champagne
    if (!state.adelaide.sparkling_champagne)
        try {
            sparkling_champagneData = await sparkling_champagne(start, end, browser);
            console.log(`${sparkling_champagneData?.length} data items scraped for sparkling_champagne`);
        } catch (err) {
            console.log("There was an error while scraping sparkling_champagne");
            logError(err);
        }

    if (!state.adelaide.sparkling_champagne && sparkling_champagneData?.length == 0)
        try {
            sparkling_champagneData = await sparkling_champagne(start, end, browser);
            console.log(`${sparkling_champagneData?.length} data items scraped for sparkling_champagne`);
            if (sparkling_champagneData?.length == 0) {
                state.adelaide.sparkling_champagne = true;
            }
        } catch (err) {
            console.log("There was an error while scraping sparkling_champagne");
            logError(err);
        }

    // Tequila
    if (!state.adelaide.tequila)
        try {
            tequilaData = await tequila(start, end, browser);
            console.log(`${tequilaData?.length} data items scraped for tequila`);
        } catch (err) {
            console.log("There was an error while scraping tequila");
            logError(err);
        }

    if (!state.adelaide.tequila && tequilaData?.length == 0)
        try {
            tequilaData = await tequila(start, end, browser);
            console.log(`${tequilaData?.length} data items scraped for tequila`);
            if (tequilaData?.length == 0) {
                state.adelaide.tequila = true;
            }
        } catch (err) {
            console.log("There was an error while scraping tequila");
            logError(err);
        }

    // Vodka
    if (!state.adelaide.vodka)
        try {
            vodkaData = await vodka(start, end, browser);
            console.log(`${vodkaData?.length} data items scraped for vodka`);
        } catch (err) {
            console.log("There was an error while scraping vodka");
            logError(err);
        }

    if (!state.adelaide.vodka && vodkaData?.length == 0)
        try {
            vodkaData = await vodka(start, end, browser);
            console.log(`${vodkaData?.length} data items scraped for vodka`);
            if (vodkaData?.length == 0) {
                state.adelaide.vodka = true;
            }
        } catch (err) {
            console.log("There was an error while scraping vodka");
            logError(err);
        }

    // Whisky
    if (!state.adelaide.whisky)
        try {
            whiskyData = await whisky(start, end, browser);
            console.log(`${whiskyData?.length} data items scraped for whisky`);
        } catch (err) {
            console.log("There was an error while scraping whisky");
            logError(err);
        }

    if (!state.adelaide.whisky && whiskyData?.length == 0)
        try {
            whiskyData = await whisky(start, end, browser);
            console.log(`${whiskyData?.length} data items scraped for whisky`);
            if (whiskyData?.length == 0) {
                state.adelaide.whisky = true;
            }
        } catch (err) {
            console.log("There was an error while scraping whisky");
            logError(err);
        }

    // White Wine
    if (!state.adelaide.white)
        try {
            whiteData = await white(start, end, browser);
            console.log(`${whiteData?.length} data items scraped for white`);
        } catch (err) {
            console.log("There was an error while scraping white");
            logError(err);
        }

    if (!state.adelaide.white && whiteData?.length == 0)
        try {
            whiteData = await white(start, end, browser);
            console.log(`${whiteData?.length} data items scraped for white`);
            if (whiteData?.length == 0) {
                state.adelaide.white = true;
            }
        } catch (err) {
            console.log("There was an error while scraping white");
            logError(err);
        }

    //merge data
    spiritsData = [...brandyData, ...cognacData, ...fragranceData, ...gift_setsData, ...ginData,
        ...liqueursData, ...makeupData, ...redData, ...roseData, ...rumData, ...skin_careData, 
        ...sparkling_champagneData, ...tequilaData, ...vodkaData, ...whiskyData, ...whiteData];

    //process data
    try {
        spiritsData = await processDataForSpirits(spiritsData);
        console.log(`${spiritsData.length} data items processed`);
    } catch (err) {
        console.log("There was an error while processing data");
        logError(err);
    }

    //update db
    try {
        await updateDBEntry(spiritsData);
        console.log(`data items updated`);
    } catch (err) {
        console.log("There was an error while updating data");
        logError(err);
    }

    console.log("entries updated for aelia adelaide");
    return spiritsData?.length == 0;
}

module.exports = scrapeAeliaAdelaide; 