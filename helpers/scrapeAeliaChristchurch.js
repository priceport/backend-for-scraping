//scraping script imports
const baijiu = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/baijiu");
const beauty = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/beauty");
const brandy = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/brandy");
const cognac = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/cognac");
const fragrance = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/fragrance");
const gift_sets = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/gift_sets");
const gin = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/gin");
const liqueurs = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/liqueurs");
const makeup = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/makeup");
const mini_bottles = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/mini_bottles");
const premium_spirits = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/premium_spirits");
const premium_wine = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/premium_wine");
const red = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/red");
const rose = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/rose");
const rum = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/rum");
const skin_care = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/skin_care");
const sparkling_champagne = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/sparkling_champagne");
const spirits = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/spirits");
const tequila = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/tequila");
const vodka = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/vodka");
const whisky = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/whisky");
const white = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/white");
const wine = require("../scripts/scraping_scripts/duty_free/aelia_christchurch/wine");

//processing script imports
const processDataForSpirits = require("./data_processing/aelia/spirits");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/aelia_christchurch/spirits");


const scrapeAeliaChristchurch = async (start,end,state,browser) =>{
    console.log("scraping started for aelia christchurch at:"+Date.now());

    let spiritsData = [], baijiuData = [], brandyData = [], cognacData = [], fortifiedData = [], fragranceData = [], gift_setsData = [], ginData = [], liqueursData = [], makeupData = [], mini_bottlesData = [], premium_spiritsData = [], premium_wineData = [], redData = [], roseData = [], rumData = [], skin_careData = [], sparkling_champagneData = [], tequilaData = [], vodkaData = [], whiskyData = [], whiteData = [];


    if(!state.christchurch.baijiu)
    try{
        baijiuData = await baijiu(start,end,browser);
        console.log(`${baijiuData?.length} data items scraped for baijiu`);

    }catch(err){
        console.log("There was an error while scraping baijiu");
        logError(err);
    }


    if(!state.christchurch.baijiu&&baijiuData?.length==0)
    try{
        baijiuData = await baijiu(start,end,browser);
        console.log(`${baijiuData?.length} data items scraped for baijiu`);

        if(baijiuData?.length==0){
            state.christchurch.baijiu = true;
        }
    }catch(err){
        console.log("There was an error while scraping baijiu");
        logError(err);
    }

    if(!state.christchurch.brandy)
    try{
        brandyData = await brandy(start,end,browser);
        console.log(`${brandyData?.length} data items scraped for brandy`);

    }catch(err){
        console.log("There was an error while scraping brandy");
        logError(err);
    }


    if(!state.christchurch.brandy&&brandyData?.length==0)
    try{
        brandyData = await brandy(start,end,browser);
        console.log(`${brandyData?.length} data items scraped for brandy`);

        if(brandyData?.length==0){
            state.christchurch.brandy = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy");
        logError(err);
    }

    if(!state.christchurch.cognac)
    try{
        cognacData = await cognac(start,end,browser);
        console.log(`${cognacData?.length} data items scraped for cognac`);

    }catch(err){
        console.log("There was an error while scraping cognac");
        logError(err);
    }


    if(!state.christchurch.cognac&&cognacData?.length==0)
    try{
        cognacData = await cognac(start,end,browser);
        console.log(`${cognacData?.length} data items scraped for cognac`);

        if(cognacData?.length==0){
            state.christchurch.cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping cognac");
        logError(err);
    }

    // if(!state.christchurch.fortified)
    // try{
    //     fortifiedData = await fortified(start,end,browser);
    //     console.log(`${fortifiedData?.length} data items scraped for fortified`);

    // }catch(err){
    //     console.log("There was an error while scraping fortified");
    //     logError(err);
    // }


    // if(!state.christchurch.fortified&&fortifiedData?.length==0)
    // try{
    //     fortifiedData = await fortified(start,end,browser);
    //     console.log(`${fortifiedData?.length} data items scraped for fortified`);

    //     if(fortifiedData?.length==0){
    //         state.christchurch.fortified = true;
    //     }
    // }catch(err){
    //     console.log("There was an error while scraping fortified");
    //     logError(err);
    // }

    if(!state.christchurch.fragrance)
    try{
        fragranceData = await fragrance(start,end,browser);
        console.log(`${fragranceData?.length} data items scraped for fragrance`);

    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }


    if(!state.christchurch.fragrance&&fragranceData?.length==0)
    try{
        fragranceData = await fragrance(start,end,browser);
        console.log(`${fragranceData?.length} data items scraped for fragrance`);

        if(fragranceData?.length==0){
            state.christchurch.fragrance = true;
        }
    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }

    if(!state.christchurch.gift_sets)
    try{
        gift_setsData = await gift_sets(start,end,browser);
        console.log(`${gift_setsData?.length} data items scraped for gift_sets`);

    }catch(err){
        console.log("There was an error while scraping gift_sets");
        logError(err);
    }


    if(!state.christchurch.gift_sets&&gift_setsData?.length==0)
    try{
        gift_setsData = await gift_sets(start,end,browser);
        console.log(`${gift_setsData?.length} data items scraped for gift_sets`);

        if(gift_setsData?.length==0){
            state.christchurch.gift_sets = true;
        }
    }catch(err){
        console.log("There was an error while scraping gift_sets");
        logError(err);
    }

    if(!state.christchurch.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }


    if(!state.christchurch.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

        if(ginData?.length==0){
            state.christchurch.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.christchurch.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }


    if(!state.christchurch.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

        if(liqueursData?.length==0){
            state.christchurch.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.christchurch.makeup)
    try{
        makeupData = await makeup(start,end,browser);
        console.log(`${makeupData?.length} data items scraped for makeup`);

    }catch(err){
        console.log("There was an error while scraping makeup");
        logError(err);
    }


    if(!state.christchurch.makeup&&makeupData?.length==0)
    try{
        makeupData = await makeup(start,end,browser);
        console.log(`${makeupData?.length} data items scraped for makeup`);

        if(makeupData?.length==0){
            state.christchurch.makeup = true;
        }
    }catch(err){
        console.log("There was an error while scraping makeup");
        logError(err);
    }

    if(!state.christchurch.mini_bottles)
    try{
        mini_bottlesData = await mini_bottles(start,end,browser);
        console.log(`${mini_bottlesData?.length} data items scraped for mini_bottles`);

    }catch(err){
        console.log("There was an error while scraping mini_bottles");
        logError(err);
    }


    if(!state.christchurch.mini_bottles&&mini_bottlesData?.length==0)
    try{
        mini_bottlesData = await mini_bottles(start,end,browser);
        console.log(`${mini_bottlesData?.length} data items scraped for mini_bottles`);

        if(mini_bottlesData?.length==0){
            state.christchurch.mini_bottles = true;
        }
    }catch(err){
        console.log("There was an error while scraping mini_bottles");
        logError(err);
    }

    if(!state.christchurch.premium_spirits)
    try{
        premium_spiritsData = await premium_spirits(start,end,browser);
        console.log(`${premium_spiritsData?.length} data items scraped for premium_spirits`);

    }catch(err){
        console.log("There was an error while scraping premium_spirits");
        logError(err);
    }


    if(!state.christchurch.premium_spirits&&premium_spiritsData?.length==0)
    try{
        premium_spiritsData = await premium_spirits(start,end,browser);
        console.log(`${premium_spiritsData?.length} data items scraped for premium_spirits`);

        if(premium_spiritsData?.length==0){
            state.christchurch.premium_spirits = true;
        }
    }catch(err){
        console.log("There was an error while scraping premium_spirits");
        logError(err);
    }

    if(!state.christchurch.premium_wine)
    try{
        premium_wineData = await premium_wine(start,end,browser);
        console.log(`${premium_wineData?.length} data items scraped for premium_wine`);

    }catch(err){
        console.log("There was an error while scraping premium_wine");
        logError(err);
    }


    if(!state.christchurch.premium_wine&&premium_wineData?.length==0)
    try{
        premium_wineData = await premium_wine(start,end,browser);
        console.log(`${premium_wineData?.length} data items scraped for premium_wine`);

        if(premium_wineData?.length==0){
            state.christchurch.premium_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping premium_wine");
        logError(err);
    }

    if(!state.christchurch.red)
    try{
        redData = await red(start,end,browser);
        console.log(`${redData?.length} data items scraped for red`);

    }catch(err){
        console.log("There was an error while scraping red");
        logError(err);
    }


    if(!state.christchurch.red&&redData?.length==0)
    try{
        redData = await red(start,end,browser);
        console.log(`${redData?.length} data items scraped for red`);

        if(redData?.length==0){
            state.christchurch.red = true;
        }
    }catch(err){
        console.log("There was an error while scraping red");
        logError(err);
    }

    if(!state.christchurch.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for rose`);

    }catch(err){
        console.log("There was an error while scraping rose");
        logError(err);
    }


    if(!state.christchurch.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for rose`);

        if(roseData?.length==0){
            state.christchurch.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping rose");
        logError(err);
    }

    if(!state.christchurch.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }


    if(!state.christchurch.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

        if(rumData?.length==0){
            state.christchurch.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.christchurch.skin_care)
    try{
        skin_careData = await skin_care(start,end,browser);
        console.log(`${skin_careData?.length} data items scraped for skin_care`);

    }catch(err){
        console.log("There was an error while scraping skin_care");
        logError(err);
    }


    if(!state.christchurch.skin_care&&skin_careData?.length==0)
    try{
        skin_careData = await skin_care(start,end,browser);
        console.log(`${skin_careData?.length} data items scraped for skin_care`);

        if(skin_careData?.length==0){
            state.christchurch.skin_care = true;
        }
    }catch(err){
        console.log("There was an error while scraping skin_care");
        logError(err);
    }

    if(!state.christchurch.sparkling_champagne)
    try{
        sparkling_champagneData = await sparkling_champagne(start,end,browser);
        console.log(`${sparkling_champagneData?.length} data items scraped for sparkling_champagne`);

    }catch(err){
        console.log("There was an error while scraping sparkling_champagne");
        logError(err);
    }


    if(!state.christchurch.sparkling_champagne&&sparkling_champagneData?.length==0)
    try{
        sparkling_champagneData = await sparkling_champagne(start,end,browser);
        console.log(`${sparkling_champagneData?.length} data items scraped for sparkling_champagne`);

        if(sparkling_champagneData?.length==0){
            state.christchurch.sparkling_champagne = true;
        }
    }catch(err){
        console.log("There was an error while scraping sparkling_champagne");
        logError(err);
    }

    if(!state.christchurch.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }


    if(!state.christchurch.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

        if(tequilaData?.length==0){
            state.christchurch.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }


    if(!state.christchurch.vodka)
    try{
        vodkaData = await vodka(start,end,browser);
        console.log(`${vodkaData?.length} data items scraped for vodka`);

    }catch(err){
        console.log("There was an error while scraping vodka");
        logError(err);
    }


    if(!state.christchurch.vodka&&vodkaData?.length==0)
    try{
        vodkaData = await vodka(start,end,browser);
        console.log(`${vodkaData?.length} data items scraped for vodka`);

        if(vodkaData?.length==0){
            state.christchurch.vodka = true;
        }
    }catch(err){
        console.log("There was an error while scraping vodka");
        logError(err);
    }

    if(!state.christchurch.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }


    if(!state.christchurch.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

        if(whiskyData?.length==0){
            state.christchurch.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.christchurch.white)
    try{
        whiteData = await white(start,end,browser);
        console.log(`${whiteData?.length} data items scraped for white`);

    }catch(err){
        console.log("There was an error while scraping white");
        logError(err);
    }


    if(!state.christchurch.white&&whiteData?.length==0)
    try{
        whiteData = await white(start,end,browser);
        console.log(`${whiteData?.length} data items scraped for white`);

        if(whiteData?.length==0){
            state.christchurch.white = true;
        }
    }catch(err){
        console.log("There was an error while scraping white");
        logError(err);
    }

    //merge data
    spiritsData = [...baijiuData,...brandyData,...cognacData,...fortifiedData,...fragranceData,...gift_setsData,...ginData,...liqueursData,...makeupData,...mini_bottlesData,...premium_spiritsData,...premium_wineData,...redData,...roseData,...rumData,...skin_careData,...sparkling_champagneData,...tequilaData,...vodkaData,...whiskyData,...whiteData];

    //process data
    try{
        spiritsData = await processDataForSpirits(spiritsData);
        console.log(`data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing data");
        logError(err);
    }

    try{
        await updateDBEntry(spiritsData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for aelia christchurch");
    return spiritsData?.length==0;
}

module.exports = scrapeAeliaChristchurch;