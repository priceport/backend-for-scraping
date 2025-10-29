//processing script imports
const processDataForSpirits = require("./data_processing/aelia/spirits");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/aelia/spirits");
const baijiu = require("../scripts/scraping_scripts/duty_free/aelia_auckland/baijiu");
const brandy = require("../scripts/scraping_scripts/duty_free/aelia_auckland/brandy");
const cognac = require("../scripts/scraping_scripts/duty_free/aelia_auckland/cognac");
const fortified = require("../scripts/scraping_scripts/duty_free/aelia_auckland/fortified");
const fragrance = require("../scripts/scraping_scripts/duty_free/aelia_auckland/fragrance");
const gift_sets = require("../scripts/scraping_scripts/duty_free/aelia_auckland/gift_sets");
const gin = require("../scripts/scraping_scripts/duty_free/aelia_auckland/gin");
const liqueurs = require("../scripts/scraping_scripts/duty_free/aelia_auckland/liqueurs");
const makeup = require("../scripts/scraping_scripts/duty_free/aelia_auckland/makeup");
const mini_bottles = require("../scripts/scraping_scripts/duty_free/aelia_auckland/mini_bottles");
const premium_spirits = require("../scripts/scraping_scripts/duty_free/aelia_auckland/premium_spirits");
const premium_wine = require("../scripts/scraping_scripts/duty_free/aelia_auckland/premium_wine");
const red = require("../scripts/scraping_scripts/duty_free/aelia_auckland/red");
const rose = require("../scripts/scraping_scripts/duty_free/aelia_auckland/rose");
const rum = require("../scripts/scraping_scripts/duty_free/aelia_auckland/rum");
const skin_care = require("../scripts/scraping_scripts/duty_free/aelia_auckland/skin_care");
const sparkling_champagne = require("../scripts/scraping_scripts/duty_free/aelia_auckland/sparkling_champagne");
const vodka = require("../scripts/scraping_scripts/duty_free/aelia_auckland/vodka");
const whisky = require("../scripts/scraping_scripts/duty_free/aelia_auckland/whisky");
const white = require("../scripts/scraping_scripts/duty_free/aelia_auckland/white");
const tequila = require("../scripts/scraping_scripts/duty_free/aelia_auckland/tequila");
const lollies = require("../scripts/scraping_scripts/duty_free/aelia_auckland/lollies");
const mints = require("../scripts/scraping_scripts/duty_free/aelia_auckland/mints");
const chocolates = require("../scripts/scraping_scripts/duty_free/aelia_auckland/chocolates");

const scrapeAelia = async (start,end,state,browser) =>{
    console.log("scraping started for aelia auckland at:"+Date.now());

    //variable initialization
    // let spiritsData=[],giftSetData=[],fragranceData=[],makeupData=[],skincareData=[];
    let spiritsData = [], baijiuData = [], brandyData = [], cognacData = [], fortifiedData = [], fragranceData = [], gift_setsData = [], ginData = [], liqueursData = [], makeupData = [], mini_bottlesData = [], premium_spiritsData = [], premium_wineData = [], redData = [], roseData = [], rumData = [], skin_careData = [], sparkling_champagneData = [], tequilaData = [], vodkaData = [], whiskyData = [], whiteData = [], lolliesData = [], mintsData = [], chocolatesData = [];


    if(!state.auckland.baijiu)
    try{
        baijiuData = await baijiu(start,end,browser);
        console.log(`${baijiuData?.length} data items scraped for baijiu`);

    }catch(err){
        console.log("There was an error while scraping baijiu");
        logError(err);
    }


    if(!state.auckland.baijiu&&baijiuData?.length==0)
    try{
        baijiuData = await baijiu(start,end,browser);
        console.log(`${baijiuData?.length} data items scraped for baijiu`);

        if(baijiuData?.length==0){
            state.auckland.baijiu = true;
        }
    }catch(err){
        console.log("There was an error while scraping baijiu");
        logError(err);
    }

    if(!state.auckland.brandy)
    try{
        brandyData = await brandy(start,end,browser);
        console.log(`${brandyData?.length} data items scraped for brandy`);

    }catch(err){
        console.log("There was an error while scraping brandy");
        logError(err);
    }


    if(!state.auckland.brandy&&brandyData?.length==0)
    try{
        brandyData = await brandy(start,end,browser);
        console.log(`${brandyData?.length} data items scraped for brandy`);

        if(brandyData?.length==0){
            state.auckland.brandy = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy");
        logError(err);
    }

    if(!state.auckland.cognac)
    try{
        cognacData = await cognac(start,end,browser);
        console.log(`${cognacData?.length} data items scraped for cognac`);

    }catch(err){
        console.log("There was an error while scraping cognac");
        logError(err);
    }


    if(!state.auckland.cognac&&cognacData?.length==0)
    try{
        cognacData = await cognac(start,end,browser);
        console.log(`${cognacData?.length} data items scraped for cognac`);

        if(cognacData?.length==0){
            state.auckland.cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping cognac");
        logError(err);
    }

    if(!state.auckland.fortified)
    try{
        fortifiedData = await fortified(start,end,browser);
        console.log(`${fortifiedData?.length} data items scraped for fortified`);

    }catch(err){
        console.log("There was an error while scraping fortified");
        logError(err);
    }


    if(!state.auckland.fortified&&fortifiedData?.length==0)
    try{
        fortifiedData = await fortified(start,end,browser);
        console.log(`${fortifiedData?.length} data items scraped for fortified`);

        if(fortifiedData?.length==0){
            state.auckland.fortified = true;
        }
    }catch(err){
        console.log("There was an error while scraping fortified");
        logError(err);
    }

    if(!state.auckland.fragrance)
    try{
        fragranceData = await fragrance(start,end,browser);
        console.log(`${fragranceData?.length} data items scraped for fragrance`);

    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }


    if(!state.auckland.fragrance&&fragranceData?.length==0)
    try{
        fragranceData = await fragrance(start,end,browser);
        console.log(`${fragranceData?.length} data items scraped for fragrance`);

        if(fragranceData?.length==0){
            state.auckland.fragrance = true;
        }
    }catch(err){
        console.log("There was an error while scraping fragrance");
        logError(err);
    }

    if(!state.auckland.gift_sets)
    try{
        gift_setsData = await gift_sets(start,end,browser);
        console.log(`${gift_setsData?.length} data items scraped for gift_sets`);

    }catch(err){
        console.log("There was an error while scraping gift_sets");
        logError(err);
    }


    if(!state.auckland.gift_sets&&gift_setsData?.length==0)
    try{
        gift_setsData = await gift_sets(start,end,browser);
        console.log(`${gift_setsData?.length} data items scraped for gift_sets`);

        if(gift_setsData?.length==0){
            state.auckland.gift_sets = true;
        }
    }catch(err){
        console.log("There was an error while scraping gift_sets");
        logError(err);
    }

    if(!state.auckland.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }


    if(!state.auckland.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

        if(ginData?.length==0){
            state.auckland.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.auckland.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }


    if(!state.auckland.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

        if(liqueursData?.length==0){
            state.auckland.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.auckland.makeup)
    try{
        makeupData = await makeup(start,end,browser);
        console.log(`${makeupData?.length} data items scraped for makeup`);

    }catch(err){
        console.log("There was an error while scraping makeup");
        logError(err);
    }


    if(!state.auckland.makeup&&makeupData?.length==0)
    try{
        makeupData = await makeup(start,end,browser);
        console.log(`${makeupData?.length} data items scraped for makeup`);

        if(makeupData?.length==0){
            state.auckland.makeup = true;
        }
    }catch(err){
        console.log("There was an error while scraping makeup");
        logError(err);
    }

    if(!state.auckland.mini_bottles)
    try{
        mini_bottlesData = await mini_bottles(start,end,browser);
        console.log(`${mini_bottlesData?.length} data items scraped for mini_bottles`);

    }catch(err){
        console.log("There was an error while scraping mini_bottles");
        logError(err);
    }


    if(!state.auckland.mini_bottles&&mini_bottlesData?.length==0)
    try{
        mini_bottlesData = await mini_bottles(start,end,browser);
        console.log(`${mini_bottlesData?.length} data items scraped for mini_bottles`);

        if(mini_bottlesData?.length==0){
            state.auckland.mini_bottles = true;
        }
    }catch(err){
        console.log("There was an error while scraping mini_bottles");
        logError(err);
    }

    if(!state.auckland.premium_spirits)
    try{
        premium_spiritsData = await premium_spirits(start,end,browser);
        console.log(`${premium_spiritsData?.length} data items scraped for premium_spirits`);

    }catch(err){
        console.log("There was an error while scraping premium_spirits");
        logError(err);
    }


    if(!state.auckland.premium_spirits&&premium_spiritsData?.length==0)
    try{
        premium_spiritsData = await premium_spirits(start,end,browser);
        console.log(`${premium_spiritsData?.length} data items scraped for premium_spirits`);

        if(premium_spiritsData?.length==0){
            state.auckland.premium_spirits = true;
        }
    }catch(err){
        console.log("There was an error while scraping premium_spirits");
        logError(err);
    }

    if(!state.auckland.premium_wine)
    try{
        premium_wineData = await premium_wine(start,end,browser);
        console.log(`${premium_wineData?.length} data items scraped for premium_wine`);

    }catch(err){
        console.log("There was an error while scraping premium_wine");
        logError(err);
    }


    if(!state.auckland.premium_wine&&premium_wineData?.length==0)
    try{
        premium_wineData = await premium_wine(start,end,browser);
        console.log(`${premium_wineData?.length} data items scraped for premium_wine`);

        if(premium_wineData?.length==0){
            state.auckland.premium_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping premium_wine");
        logError(err);
    }

    if(!state.auckland.red)
    try{
        redData = await red(start,end,browser);
        console.log(`${redData?.length} data items scraped for red`);

    }catch(err){
        console.log("There was an error while scraping red");
        logError(err);
    }


    if(!state.auckland.red&&redData?.length==0)
    try{
        redData = await red(start,end,browser);
        console.log(`${redData?.length} data items scraped for red`);

        if(redData?.length==0){
            state.auckland.red = true;
        }
    }catch(err){
        console.log("There was an error while scraping red");
        logError(err);
    }

    if(!state.auckland.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for rose`);

    }catch(err){
        console.log("There was an error while scraping rose");
        logError(err);
    }


    if(!state.auckland.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for rose`);

        if(roseData?.length==0){
            state.auckland.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping rose");
        logError(err);
    }

    if(!state.auckland.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }


    if(!state.auckland.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

        if(rumData?.length==0){
            state.auckland.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.auckland.skin_care)
    try{
        skin_careData = await skin_care(start,end,browser);
        console.log(`${skin_careData?.length} data items scraped for skin_care`);

    }catch(err){
        console.log("There was an error while scraping skin_care");
        logError(err);
    }


    if(!state.auckland.skin_care&&skin_careData?.length==0)
    try{
        skin_careData = await skin_care(start,end,browser);
        console.log(`${skin_careData?.length} data items scraped for skin_care`);

        if(skin_careData?.length==0){
            state.auckland.skin_care = true;
        }
    }catch(err){
        console.log("There was an error while scraping skin_care");
        logError(err);
    }

    if(!state.auckland.sparkling_champagne)
    try{
        sparkling_champagneData = await sparkling_champagne(start,end,browser);
        console.log(`${sparkling_champagneData?.length} data items scraped for sparkling_champagne`);

    }catch(err){
        console.log("There was an error while scraping sparkling_champagne");
        logError(err);
    }


    if(!state.auckland.sparkling_champagne&&sparkling_champagneData?.length==0)
    try{
        sparkling_champagneData = await sparkling_champagne(start,end,browser);
        console.log(`${sparkling_champagneData?.length} data items scraped for sparkling_champagne`);

        if(sparkling_champagneData?.length==0){
            state.auckland.sparkling_champagne = true;
        }
    }catch(err){
        console.log("There was an error while scraping sparkling_champagne");
        logError(err);
    }

    if(!state.auckland.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }


    if(!state.auckland.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

        if(tequilaData?.length==0){
            state.auckland.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }


    if(!state.auckland.vodka)
    try{
        vodkaData = await vodka(start,end,browser);
        console.log(`${vodkaData?.length} data items scraped for vodka`);

    }catch(err){
        console.log("There was an error while scraping vodka");
        logError(err);
    }


    if(!state.auckland.vodka&&vodkaData?.length==0)
    try{
        vodkaData = await vodka(start,end,browser);
        console.log(`${vodkaData?.length} data items scraped for vodka`);

        if(vodkaData?.length==0){
            state.auckland.vodka = true;
        }
    }catch(err){
        console.log("There was an error while scraping vodka");
        logError(err);
    }

    if(!state.auckland.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }


    if(!state.auckland.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

        if(whiskyData?.length==0){
            state.auckland.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.auckland.white)
    try{
        whiteData = await white(start,end,browser);
        console.log(`${whiteData?.length} data items scraped for white`);

    }catch(err){
        console.log("There was an error while scraping white");
        logError(err);
    }


    if(!state.auckland.white&&whiteData?.length==0)
    try{
        whiteData = await white(start,end,browser);
        console.log(`${whiteData?.length} data items scraped for white`);

        if(whiteData?.length==0){
            state.auckland.white = true;
        }
    }catch(err){
        console.log("There was an error while scraping white");
        logError(err);
    }

    if(!state.auckland.lollies)
    try{
        lolliesData = await lollies(start,end,browser);
        console.log(`${lolliesData?.length} data items scraped for lollies`);

    }catch(err){
        console.log("There was an error while scraping lollies");
        logError(err);
    }

    if(!state.auckland.lollies&&lolliesData?.length==0)
    try{
        lolliesData = await lollies(start,end,browser);
        console.log(`${lolliesData?.length} data items scraped for lollies`);

    }catch(err){
        console.log("There was an error while scraping lollies");
        logError(err);
    }

    if(!state.auckland.mints)
    try{
        mintsData = await mints(start,end,browser);
        console.log(`${mintsData?.length} data items scraped for mints`);

    }catch(err){
        console.log("There was an error while scraping mints");
        logError(err);
    }

    if(!state.auckland.mints&&mintsData?.length==0)
    try{
        mintsData = await mints(start,end,browser);
        console.log(`${mintsData?.length} data items scraped for mints`);
        if(mintsData?.length==0){
            state.auckland.mints = true;
        }
    }catch(err){
        console.log("There was an error while scraping mints");
        logError(err);
    }

    if(!state.auckland.chocolates)
    try{
        chocolatesData = await chocolates(start,end,browser);
        console.log(`${chocolatesData?.length} data items scraped for chocolates`);
    }catch(err){
        console.log("There was an error while scraping chocolates");
        logError(err);
    }

    if(!state.auckland.chocolates&&chocolatesData?.length==0)
    try{
        chocolatesData = await chocolates(start,end,browser);
        console.log(`${chocolatesData?.length} data items scraped for chocolates`);
        if(chocolatesData?.length==0){
            state.auckland.chocolates = true;
        }
    }catch(err){
        console.log("There was an error while scraping chocolates");
        logError(err);
    }

    //scrape each category
    // if(!state.auckland.spirits)
    // try{
    //     spiritsData = await spirits(start,end,browser);
    //     console.log(`${spiritsData?.length} data items scraped for spirits`);

    // }catch(err){
    //     console.log("There was an error while scraping spirits");
    //     logError(err);
    // }


    // if(!state.auckland.spirits&&spiritsData?.length==0)
    // try{
    //     spiritsData = await spirits(start,end,browser);
    //     console.log(`${spiritsData?.length} data items scraped for spirits`);

    //     if(spiritsData?.length==0){
    //         state.auckland.spirits = true;
    //     }
    // }catch(err){
    //     console.log("There was an error while scraping spirits");
    //     logError(err);
    // }

    // if(!state.auckland.wine)
    // try{
    //     wineData = await wine(start,end,browser);
    //     console.log(`${wineData?.length} data items scraped for wine`);

    // }catch(err){
    //     console.log("There was an error while scraping wine");
    //     logError(err);
    // }

    // if(!state.auckland.wine&&wineData?.length==0)
    // try{
    //     wineData = await wine(start,end,browser);
    //     console.log(`${wineData?.length} data items scraped for wine`);

    //     if(wineData?.length==0){
    //         state.auckland.wine = true;
    //     }
    // }catch(err){
    //     console.log("There was an error while scraping wine");
    //     logError(err);
    // }

    // if(!state.auckland.beauty)
    // try{
    //     beautyData = await beauty(start,end,browser);
    //     console.log(`${beautyData?.length} data items scraped for beauty`);

    // }catch(err){
    //     console.log("There was an error while scraping beauty");
    //     logError(err);
    // }

    // if(!state.auckland.beauty&&beautyData?.length==0)
    // try{
    //     beautyData = await beauty(start,end,browser);
    //     console.log(`${beautyData?.length} data items scraped for beauty`);

    //     if(beautyData?.length==0){
    //         state.auckland.beauty = true;
    //     }
    // }catch(err){
    //     console.log("There was an error while scraping beauty");
    //     logError(err);
    // }

    //merge data
    spiritsData = [...baijiuData,...brandyData,...cognacData,...fortifiedData,...fragranceData,...gift_setsData,...ginData,...liqueursData,...makeupData,...mini_bottlesData,...premium_spiritsData,...premium_wineData,...redData,...roseData,...rumData,...skin_careData,...sparkling_champagneData,...tequilaData,...vodkaData,...whiskyData,...whiteData,...lolliesData,...mintsData,...chocolatesData];

    //process data
    try{
        spiritsData = await processDataForSpirits(spiritsData);
        console.log(`${spiritsData.length} data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing data");
        logError(err);
    }

    //update db
    try{
        await updateDBEntry(spiritsData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for aelia auckland");
    return spiritsData?.length==0;
}

module.exports = scrapeAelia;