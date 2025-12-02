const vodka = require("../scripts/scraping_scripts/domestic/liquorland_aus/vodka");
const gin = require("../scripts/scraping_scripts/domestic/liquorland_aus/gin");
const whisky = require("../scripts/scraping_scripts/domestic/liquorland_aus/whisky");
const rum = require("../scripts/scraping_scripts/domestic/liquorland_aus/rum");
const bourbon = require("../scripts/scraping_scripts/domestic/liquorland_aus/bourbon");
const tequila = require("../scripts/scraping_scripts/domestic/liquorland_aus/tequila");
const brandy_and_cognac = require("../scripts/scraping_scripts/domestic/liquorland_aus/brandy_and_cognac");
const liqueurs = require("../scripts/scraping_scripts/domestic/liquorland_aus/liqueurs");
const aperitifs = require("../scripts/scraping_scripts/domestic/liquorland_aus/aperitifs");
const mixers = require("../scripts/scraping_scripts/domestic/liquorland_aus/mixers");
const lager = require("../scripts/scraping_scripts/domestic/liquorland_aus/lager");
const ipa = require("../scripts/scraping_scripts/domestic/liquorland_aus/ipa");
const ale = require("../scripts/scraping_scripts/domestic/liquorland_aus/ale");
const ginger_beer = require("../scripts/scraping_scripts/domestic/liquorland_aus/ginger_beer");
const dark_beer = require("../scripts/scraping_scripts/domestic/liquorland_aus/dark_beer");
const summer_ale = require("../scripts/scraping_scripts/domestic/liquorland_aus/summer_ale");
const stout = require("../scripts/scraping_scripts/domestic/liquorland_aus/stout");
const flavoured_and_sours = require("../scripts/scraping_scripts/domestic/liquorland_aus/flavoured_and_sours");
const low_alcohol = require("../scripts/scraping_scripts/domestic/liquorland_aus/low_alcohol");
const red_wine = require("../scripts/scraping_scripts/domestic/liquorland_aus/red_wine");
const white_wine = require("../scripts/scraping_scripts/domestic/liquorland_aus/white_wine");
const rose = require("../scripts/scraping_scripts/domestic/liquorland_aus/rose");
const champagne_and_sparkling = require("../scripts/scraping_scripts/domestic/liquorland_aus/champagne_and_sparkling");
const fortified_wine = require("../scripts/scraping_scripts/domestic/liquorland_aus/fortified_wine");
const cask_wine = require("../scripts/scraping_scripts/domestic/liquorland_aus/cask_wine");

//processing script imports
const processDataForSpirits = require("./data_processing/liquorland_aus/spirits");

//db update imports
const updateDBEntry = require("./update_db_entry/liquorland_aus/spirits");
const logError = require("./logError");

const scrapeLiquorlandAus = async (start, end, state, browser) => {
  console.log("scraping started for liquorland aus at:" + Date.now());

  //variable initialization
  
  let allData, vodkaData = [], ginData = [], whiskyData = [], rumData = [], bourbonData = [], tequilaData = [], brandyAndCognacData = [], liqueursData = [], aperitifsData = [], mixersData = [], lagerData = [], ipaData = [], aleData = [], gingerBeerData = [], darkBeerData = [], summerAleData = [], stoutData = [], flavouredAndSoursData = [], lowAlcoholData = [], redWineData = [], whiteWineData = [], roseData = [], champagneAndSparklingData = [], fortifiedWineData = [], caskWineData = [];

  if(!state.liquorlandAus.vodka)
    try{
        vodkaData = await vodka(start,end,browser);
        console.log(`${vodkaData?.length} data items scraped for vodka`);

    }catch(err){
        console.log("There was an error while scraping vodka");
        logError(err);
    }

    if(!state.liquorlandAus.vodka&&vodkaData?.length==0)
    try{
        vodkaData = await vodka(start,end,browser);
        console.log(`${vodkaData?.length} data items scraped for vodka`);
        if(vodkaData?.length==0){
            state.liquorlandAus.vodka = true;
        }
    }catch(err){
        console.log("There was an error while scraping vodka");
        logError(err);
    }

  if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandy_and_cognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandy_and_cognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

            if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

      if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

        if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

      if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

      if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

      if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

          if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

      if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

        if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

      if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

      if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

      if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

        if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

      if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

        if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

      if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

      if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

      if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.liquorlandAus.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
        if(ginData?.length==0){
            state.liquorlandAus.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

  if(!state.liquorlandAus.whisky)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);

    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

    if(!state.liquorlandAus.whisky&&whiskyData?.length==0)
    try{
        whiskyData = await whisky(start,end,browser);
        console.log(`${whiskyData?.length} data items scraped for whisky`);
        if(whiskyData?.length==0){
            state.liquorlandAus.whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping whisky");
        logError(err);
    }

  if(!state.liquorlandAus.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.liquorlandAus.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
        if(rumData?.length==0){
            state.liquorlandAus.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

  if(!state.liquorlandAus.bourbon)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);

    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

    if(!state.liquorlandAus.bourbon&&bourbonData?.length==0)
    try{
        bourbonData = await bourbon(start,end,browser);
        console.log(`${bourbonData?.length} data items scraped for bourbon`);
        if(bourbonData?.length==0){
            state.liquorlandAus.bourbon = true;
        }
    }catch(err){
        console.log("There was an error while scraping bourbon");
        logError(err);
    }

  if(!state.liquorlandAus.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.liquorlandAus.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
        if(tequilaData?.length==0){
            state.liquorlandAus.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

  if(!state.liquorlandAus.brandy_and_cognac)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);

    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

    if(!state.liquorlandAus.brandy_and_cognac&&brandyAndCognacData?.length==0)
    try{
        brandyAndCognacData = await brandyAndCognac(start,end,browser);
        console.log(`${brandyAndCognacData?.length} data items scraped for brandy-and-cognac`);
        if(brandyAndCognacData?.length==0){
            state.liquorlandAus.brandy_and_cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy-and-cognac");
        logError(err);
    }

  if(!state.liquorlandAus.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.liquorlandAus.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);
        if(liqueursData?.length==0){
            state.liquorlandAus.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

  if(!state.liquorlandAus.aperitifs)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);

    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

    if(!state.liquorlandAus.aperitifs&&aperitifsData?.length==0)
    try{
        aperitifsData = await aperitifs(start,end,browser);
        console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
        if(aperitifsData?.length==0){
            state.liquorlandAus.aperitifs = true;
        }
    }catch(err){
        console.log("There was an error while scraping aperitifs");
        logError(err);
    }

  if(!state.liquorlandAus.mixers)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);

    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

    if(!state.liquorlandAus.mixers&&mixersData?.length==0)
    try{
        mixersData = await mixers(start,end,browser);
        console.log(`${mixersData?.length} data items scraped for mixers`);
        if(mixersData?.length==0){
            state.liquorlandAus.mixers = true;
        }
    }catch(err){
        console.log("There was an error while scraping mixers");
        logError(err);
    }

  if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  if(!state.liquorlandAus.red_wine)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

    if(!state.liquorlandAus.red_wine&&redWineData?.length==0)
    try{
        redWineData = await red_wine(start,end,browser);
        console.log(`${redWineData?.length} data items scraped for wine-red-wine`);
        if(redWineData?.length==0){
            state.liquorlandAus.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-red-wine");
        logError(err);
    }

  if(!state.liquorlandAus.white_wine)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

    if(!state.liquorlandAus.white_wine&&whiteWineData?.length==0)
    try{
        whiteWineData = await white_wine(start,end,browser);
        console.log(`${whiteWineData?.length} data items scraped for wine-white-wine`);
        if(whiteWineData?.length==0){
            state.liquorlandAus.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-white-wine");
        logError(err);
    }

  if(!state.liquorlandAus.rose)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);

    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

    if(!state.liquorlandAus.rose&&roseData?.length==0)
    try{
        roseData = await rose(start,end,browser);
        console.log(`${roseData?.length} data items scraped for wine-rose`);
        if(roseData?.length==0){
            state.liquorlandAus.rose = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-rose");
        logError(err);
    }

  if(!state.liquorlandAus.champagne_and_sparkling)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);

    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

    if(!state.liquorlandAus.champagne_and_sparkling&&champagneAndSparklingData?.length==0)
    try{
        champagneAndSparklingData = await champagne_and_sparkling(start,end,browser);
        console.log(`${champagneAndSparklingData?.length} data items scraped for wine-champagne-and-sparkling`);
        if(champagneAndSparklingData?.length==0){
            state.liquorlandAus.champagne_and_sparkling = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-champagne-and-sparkling");
        logError(err);
    }

  if(!state.liquorlandAus.fortified_wine)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

    if(!state.liquorlandAus.fortified_wine&&fortifiedWineData?.length==0)
    try{
        fortifiedWineData = await fortified_wine(start,end,browser);
        console.log(`${fortifiedWineData?.length} data items scraped for wine-fortified-wine`);
        if(fortifiedWineData?.length==0){
            state.liquorlandAus.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-fortified-wine");
        logError(err);
    }

  if(!state.liquorlandAus.cask_wine)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);

    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

    if(!state.liquorlandAus.cask_wine&&caskWineData?.length==0)
    try{
        caskWineData = await cask_wine(start,end,browser);
        console.log(`${caskWineData?.length} data items scraped for wine-cask-wine`);
        if(caskWineData?.length==0){
            state.liquorlandAus.cask_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine-cask-wine");
        logError(err);
    }

if(!state.liquorlandAus.lager)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);

    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

    if(!state.liquorlandAus.lager&&lagerData?.length==0)
    try{
        lagerData = await lager(start,end,browser);
        console.log(`${lagerData?.length} data items scraped for beer-lager`);
        if(lagerData?.length==0){
            state.liquorlandAus.lager = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-lager");
        logError(err);
    }

  if(!state.liquorlandAus.ipa)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);

    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

    if(!state.liquorlandAus.ipa&&ipaData?.length==0)
    try{
        ipaData = await ipa(start,end,browser);
        console.log(`${ipaData?.length} data items scraped for beer-ipa`);
        if(ipaData?.length==0){
            state.liquorlandAus.ipa = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ipa");
        logError(err);
    }

  if(!state.liquorlandAus.ale)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.ale&&aleData?.length==0)
    try{
        aleData = await ale(start,end,browser);
        console.log(`${aleData?.length} data items scraped for beer-ale`);
        if(aleData?.length==0){
            state.liquorlandAus.ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.ginger_beer)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

    if(!state.liquorlandAus.ginger_beer&&gingerBeerData?.length==0)
    try{
        gingerBeerData = await ginger_beer(start,end,browser);
        console.log(`${gingerBeerData?.length} data items scraped for beer-ginger-beer`);
        if(gingerBeerData?.length==0){
            state.liquorlandAus.ginger_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-ginger-beer");
        logError(err);
    }

  if(!state.liquorlandAus.dark_beer)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);

    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

    if(!state.liquorlandAus.dark_beer&&darkBeerData?.length==0)
    try{
        darkBeerData = await dark_beer(start,end,browser);
        console.log(`${darkBeerData?.length} data items scraped for beer-dark-beer`);
        if(darkBeerData?.length==0){
            state.liquorlandAus.dark_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-dark-beer");
        logError(err);
    }

  if(!state.liquorlandAus.summer_ale)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);

    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

    if(!state.liquorlandAus.summer_ale&&summerAleData?.length==0)
    try{
        summerAleData = await summer_ale(start,end,browser);
        console.log(`${summerAleData?.length} data items scraped for beer-summer-ale`);
        if(summerAleData?.length==0){
            state.liquorlandAus.summer_ale = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-summer-ale");
        logError(err);
    }

  if(!state.liquorlandAus.stout)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);

    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

    if(!state.liquorlandAus.stout&&stoutData?.length==0)
    try{
        stoutData = await stout(start,end,browser);
        console.log(`${stoutData?.length} data items scraped for beer-stout`);
        if(stoutData?.length==0){
            state.liquorlandAus.stout = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-stout");
        logError(err);
    }

  if(!state.liquorlandAus.flavoured_and_sours)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);

    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

    if(!state.liquorlandAus.flavoured_and_sours&&flavouredAndSoursData?.length==0)
    try{
        flavouredAndSoursData = await flavoured_and_sours(start,end,browser);
        console.log(`${flavouredAndSoursData?.length} data items scraped for beer-flavoured-and-sours`);
        if(flavouredAndSoursData?.length==0){
            state.liquorlandAus.flavoured_and_sours = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-flavoured-and-sours");
        logError(err);
    }

  if(!state.liquorlandAus.low_alcohol)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);

    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

    if(!state.liquorlandAus.low_alcohol&&lowAlcoholData?.length==0)
    try{
        lowAlcoholData = await low_alcohol(start,end,browser);
        console.log(`${lowAlcoholData?.length} data items scraped for beer-low-alcohol`);
        if(lowAlcoholData?.length==0){
            state.liquorlandAus.low_alcohol = true;
        }
    }catch(err){
        console.log("There was an error while scraping beer-low-alcohol");
        logError(err);
    }

  //merge data
          allData = [...vodkaData, ...ginData, ...whiskyData, ...rumData, ...bourbonData, ...tequilaData, ...brandyAndCognacData, ...liqueursData, ...aperitifsData, ...mixersData, ...lagerData, ...ipaData, ...aleData, ...gingerBeerData, ...darkBeerData, ...summerAleData, ...stoutData, ...flavouredAndSoursData, ...lowAlcoholData, ...redWineData, ...whiteWineData, ...roseData, ...champagneAndSparklingData, ...fortifiedWineData, ...caskWineData];
  //process data
  try {
    allData = await processDataForSpirits(allData);
    console.log(`${allData?.length} data items processed`);
  } catch (err) {
    console.log("There was an error while processing data");
    logError(err);
  }

  // update db
  try {
    await updateDBEntry(allData);
    console.log(`data items updated`);
  } catch (err) {
    console.log("There was an error while updating data");
    logError(err);
  }

  console.log("entries updated for liquorland");
  return allData?.length == 0;
};

module.exports = scrapeLiquorlandAus;
