//processing script imports
const processDataForSpirits = require("./data_processing/aelia_australia/spirits");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/aelia_cairns/spirits");

//scraping script imports
const brandy = require("../scripts/scraping_scripts/duty_free/aelia_cairns/brandy");
const cognac = require("../scripts/scraping_scripts/duty_free/aelia_cairns/cognac");
const fragrance = require("../scripts/scraping_scripts/duty_free/aelia_cairns/fragrance");
const gift_sets = require("../scripts/scraping_scripts/duty_free/aelia_cairns/gift_sets");
const gin = require("../scripts/scraping_scripts/duty_free/aelia_cairns/gin");
const liqueurs = require("../scripts/scraping_scripts/duty_free/aelia_cairns/liqueurs");
const makeup = require("../scripts/scraping_scripts/duty_free/aelia_cairns/makeup");
const red = require("../scripts/scraping_scripts/duty_free/aelia_cairns/red");
const rose = require("../scripts/scraping_scripts/duty_free/aelia_cairns/rose");
const rum = require("../scripts/scraping_scripts/duty_free/aelia_cairns/rum");
const skin_care = require("../scripts/scraping_scripts/duty_free/aelia_cairns/skin_care");
const sparkling_champagne = require("../scripts/scraping_scripts/duty_free/aelia_cairns/sparkling_champagne");
const tequila = require("../scripts/scraping_scripts/duty_free/aelia_cairns/tequila");
const vodka = require("../scripts/scraping_scripts/duty_free/aelia_cairns/vodka");
const whisky = require("../scripts/scraping_scripts/duty_free/aelia_cairns/whisky");
const white = require("../scripts/scraping_scripts/duty_free/aelia_cairns/white");

const scrapeAeliaCairns = async (start, end, state, browser) => {
    console.log("scraping started for aelia cairns at:" + Date.now());

    //variable initialization
    let spiritsData = [], brandyData = [], cognacData = [], fragranceData = [], gift_setsData = [], 
        ginData = [], liqueursData = [], makeupData = [], redData = [], roseData = [], rumData = [], 
        skin_careData = [], sparkling_champagneData = [], tequilaData = [], vodkaData = [], 
        whiskyData = [], whiteData = [];

    // Brandy
    if (!state.cairns.brandy)
        try {
            brandyData = await brandy(start, end, browser);
            console.log(`${brandyData?.length} data items scraped for brandy`);
        } catch (err) {
            console.log("There was an error while scraping brandy");
            logError(err);
        }

    if (!state.cairns.brandy && brandyData?.length == 0)
        try {
            brandyData = await brandy(start, end, browser);
            console.log(`${brandyData?.length} data items scraped for brandy`);
            if (brandyData?.length == 0) {
                state.cairns.brandy = true;
            }
        } catch (err) {
            console.log("There was an error while scraping brandy");
            logError(err);
        }

    // Cognac
    if (!state.cairns.cognac)
        try {
            cognacData = await cognac(start, end, browser);
            console.log(`${cognacData?.length} data items scraped for cognac`);
        } catch (err) {
            console.log("There was an error while scraping cognac");
            logError(err);
        }

    if (!state.cairns.cognac && cognacData?.length == 0)
        try {
            cognacData = await cognac(start, end, browser);
            console.log(`${cognacData?.length} data items scraped for cognac`);
            if (cognacData?.length == 0) {
                state.cairns.cognac = true;
            }
        } catch (err) {
            console.log("There was an error while scraping cognac");
            logError(err);
        }

    // Fragrance
    if (!state.cairns.fragrance)
        try {
            fragranceData = await fragrance(start, end, browser);
            console.log(`${fragranceData?.length} data items scraped for fragrance`);
        } catch (err) {
            console.log("There was an error while scraping fragrance");
            logError(err);
        }

    if (!state.cairns.fragrance && fragranceData?.length == 0)
        try {
            fragranceData = await fragrance(start, end, browser);
            console.log(`${fragranceData?.length} data items scraped for fragrance`);
            if (fragranceData?.length == 0) {
                state.cairns.fragrance = true;
            }
        } catch (err) {
            console.log("There was an error while scraping fragrance");
            logError(err);
        }

    // Gift Sets
    if (!state.cairns.gift_sets)
        try {
            gift_setsData = await gift_sets(start, end, browser);
            console.log(`${gift_setsData?.length} data items scraped for gift_sets`);
        } catch (err) {
            console.log("There was an error while scraping gift_sets");
            logError(err);
        }

    if (!state.cairns.gift_sets && gift_setsData?.length == 0)
        try {
            gift_setsData = await gift_sets(start, end, browser);
            console.log(`${gift_setsData?.length} data items scraped for gift_sets`);
            if (gift_setsData?.length == 0) {
                state.cairns.gift_sets = true;
            }
        } catch (err) {
            console.log("There was an error while scraping gift_sets");
            logError(err);
        }

    // Gin
    if (!state.cairns.gin)
        try {
            ginData = await gin(start, end, browser);
            console.log(`${ginData?.length} data items scraped for gin`);
        } catch (err) {
            console.log("There was an error while scraping gin");
            logError(err);
        }

    if (!state.cairns.gin && ginData?.length == 0)
        try {
            ginData = await gin(start, end, browser);
            console.log(`${ginData?.length} data items scraped for gin`);
            if (ginData?.length == 0) {
                state.cairns.gin = true;
            }
        } catch (err) {
            console.log("There was an error while scraping gin");
            logError(err);
        }

    // Liqueurs
    if (!state.cairns.liqueurs)
        try {
            liqueursData = await liqueurs(start, end, browser);
            console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        } catch (err) {
            console.log("There was an error while scraping liqueurs");
            logError(err);
        }

    if (!state.cairns.liqueurs && liqueursData?.length == 0)
        try {
            liqueursData = await liqueurs(start, end, browser);
            console.log(`${liqueursData?.length} data items scraped for liqueurs`);
            if (liqueursData?.length == 0) {
                state.cairns.liqueurs = true;
            }
        } catch (err) {
            console.log("There was an error while scraping liqueurs");
            logError(err);
        }

    // Makeup
    if (!state.cairns.makeup)
        try {
            makeupData = await makeup(start, end, browser);
            console.log(`${makeupData?.length} data items scraped for makeup`);
        } catch (err) {
            console.log("There was an error while scraping makeup");
            logError(err);
        }

    if (!state.cairns.makeup && makeupData?.length == 0)
        try {
            makeupData = await makeup(start, end, browser);
            console.log(`${makeupData?.length} data items scraped for makeup`);
            if (makeupData?.length == 0) {
                state.cairns.makeup = true;
            }
        } catch (err) {
            console.log("There was an error while scraping makeup");
            logError(err);
        }

    // Red Wine
    if (!state.cairns.red)
        try {
            redData = await red(start, end, browser);
            console.log(`${redData?.length} data items scraped for red`);
        } catch (err) {
            console.log("There was an error while scraping red");
            logError(err);
        }

    if (!state.cairns.red && redData?.length == 0)
        try {
            redData = await red(start, end, browser);
            console.log(`${redData?.length} data items scraped for red`);
            if (redData?.length == 0) {
                state.cairns.red = true;
            }
        } catch (err) {
            console.log("There was an error while scraping red");
            logError(err);
        }

    // Rose Wine
    if (!state.cairns.rose)
        try {
            roseData = await rose(start, end, browser);
            console.log(`${roseData?.length} data items scraped for rose`);
        } catch (err) {
            console.log("There was an error while scraping rose");
            logError(err);
        }

    if (!state.cairns.rose && roseData?.length == 0)
        try {
            roseData = await rose(start, end, browser);
            console.log(`${roseData?.length} data items scraped for rose`);
            if (roseData?.length == 0) {
                state.cairns.rose = true;
            }
        } catch (err) {
            console.log("There was an error while scraping rose");
            logError(err);
        }

    // Rum
    if (!state.cairns.rum)
        try {
            rumData = await rum(start, end, browser);
            console.log(`${rumData?.length} data items scraped for rum`);
        } catch (err) {
            console.log("There was an error while scraping rum");
            logError(err);
        }

    if (!state.cairns.rum && rumData?.length == 0)
        try {
            rumData = await rum(start, end, browser);
            console.log(`${rumData?.length} data items scraped for rum`);
            if (rumData?.length == 0) {
                state.cairns.rum = true;
            }
        } catch (err) {
            console.log("There was an error while scraping rum");
            logError(err);
        }

    // Skin Care
    if (!state.cairns.skin_care)
        try {
            skin_careData = await skin_care(start, end, browser);
            console.log(`${skin_careData?.length} data items scraped for skin_care`);
        } catch (err) {
            console.log("There was an error while scraping skin_care");
            logError(err);
        }

    if (!state.cairns.skin_care && skin_careData?.length == 0)
        try {
            skin_careData = await skin_care(start, end, browser);
            console.log(`${skin_careData?.length} data items scraped for skin_care`);
            if (skin_careData?.length == 0) {
                state.cairns.skin_care = true;
            }
        } catch (err) {
            console.log("There was an error while scraping skin_care");
            logError(err);
        }

    // Sparkling Champagne
    if (!state.cairns.sparkling_champagne)
        try {
            sparkling_champagneData = await sparkling_champagne(start, end, browser);
            console.log(`${sparkling_champagneData?.length} data items scraped for sparkling_champagne`);
        } catch (err) {
            console.log("There was an error while scraping sparkling_champagne");
            logError(err);
        }

    if (!state.cairns.sparkling_champagne && sparkling_champagneData?.length == 0)
        try {
            sparkling_champagneData = await sparkling_champagne(start, end, browser);
            console.log(`${sparkling_champagneData?.length} data items scraped for sparkling_champagne`);
            if (sparkling_champagneData?.length == 0) {
                state.cairns.sparkling_champagne = true;
            }
        } catch (err) {
            console.log("There was an error while scraping sparkling_champagne");
            logError(err);
        }

    // Tequila
    if (!state.cairns.tequila)
        try {
            tequilaData = await tequila(start, end, browser);
            console.log(`${tequilaData?.length} data items scraped for tequila`);
        } catch (err) {
            console.log("There was an error while scraping tequila");
            logError(err);
        }

    if (!state.cairns.tequila && tequilaData?.length == 0)
        try {
            tequilaData = await tequila(start, end, browser);
            console.log(`${tequilaData?.length} data items scraped for tequila`);
            if (tequilaData?.length == 0) {
                state.cairns.tequila = true;
            }
        } catch (err) {
            console.log("There was an error while scraping tequila");
            logError(err);
        }

    // Vodka
    if (!state.cairns.vodka)
        try {
            vodkaData = await vodka(start, end, browser);
            console.log(`${vodkaData?.length} data items scraped for vodka`);
        } catch (err) {
            console.log("There was an error while scraping vodka");
            logError(err);
        }

    if (!state.cairns.vodka && vodkaData?.length == 0)
        try {
            vodkaData = await vodka(start, end, browser);
            console.log(`${vodkaData?.length} data items scraped for vodka`);
            if (vodkaData?.length == 0) {
                state.cairns.vodka = true;
            }
        } catch (err) {
            console.log("There was an error while scraping vodka");
            logError(err);
        }

    // Whisky
    if (!state.cairns.whisky)
        try {
            whiskyData = await whisky(start, end, browser);
            console.log(`${whiskyData?.length} data items scraped for whisky`);
        } catch (err) {
            console.log("There was an error while scraping whisky");
            logError(err);
        }

    if (!state.cairns.whisky && whiskyData?.length == 0)
        try {
            whiskyData = await whisky(start, end, browser);
            console.log(`${whiskyData?.length} data items scraped for whisky`);
            if (whiskyData?.length == 0) {
                state.cairns.whisky = true;
            }
        } catch (err) {
            console.log("There was an error while scraping whisky");
            logError(err);
        }

    // White Wine
    if (!state.cairns.white)
        try {
            whiteData = await white(start, end, browser);
            console.log(`${whiteData?.length} data items scraped for white`);
        } catch (err) {
            console.log("There was an error while scraping white");
            logError(err);
        }

    if (!state.cairns.white && whiteData?.length == 0)
        try {
            whiteData = await white(start, end, browser);
            console.log(`${whiteData?.length} data items scraped for white`);
            if (whiteData?.length == 0) {
                state.cairns.white = true;
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

    console.log("entries updated for aelia cairns");
    return spiritsData?.length == 0;
}

module.exports = scrapeAeliaCairns; 