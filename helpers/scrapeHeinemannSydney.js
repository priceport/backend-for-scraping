//scraping script imports
const blended_whisky = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/blended_whisky");
const accessories = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/accessories");
const american_whisky = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/american_whisky");
const australian_whisky = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/australian_whisky");
const bath_and_shower = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/bath_and_shower");
const bitter_aperitif = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/bitter_aperitif");
const blusher = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/blusher");
const body_care = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/body_care");
const bodycare_care = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/bodycare_care");
const canadian_whisky = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/canadian_whisky");
const care = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/care");
const champagne = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/champagne");
const cleansing = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/cleansing");
const cognac_brandy = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/cognac_brandy");
const concealer = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/concealer");
const eye_care = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/eye_care");
const eye_shadow = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/eye_shadow");
const eyebrows = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/eyebrows");
const eyeliner = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/eyeliner");
const foot_care = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/foot_care");
const fortified_wine = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/fortified_wine");
const foundation = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/foundation");
const fragrance = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/fragrance");
const gin = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/gin");
const hair_care = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/hair_care");
const hand_care = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/hand_care");
const home_fragrance_candle = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/home_fragrance_candle");
const irish_whisky = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/irish_whisky");
const japanese_whisky = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/japanese_whisky");
const lipstick_and_lipliner = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/lipstick_and_lipliner");
const liqueur = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/liqueur");
const makeup = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/makeup");
const makeup_sets = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/makeup_sets");
const mascara = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/mascara");
const masks = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/masks");
const men_bath_and_shower = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/men_bath_and_shower");
const men_fragrance = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/men_fragrance");
const men_fragrance_set = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/men_fragrance_set");
const men_skincare = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/men_skincare");
const powders = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/powders");
const red_wine = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/red_wine");
const rose_wine = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/rose_wine");
const rum = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/rum");
const scotch_whisky = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/scotch_whisky");
const serum = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/serum");
const sherry_port = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/sherry_port");
const single_malt_whisky = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/single_malt_whisky");
const skin_care_sets = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/skin_care_sets");
const skincare = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/skincare");
const sparkling_wine = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/sparkling_wine");
const spirits = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/spirits");
const spiritsMultibuy = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/spirits_multibuy");
const sun_care = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/sun_care");
const tequila = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/tequila");
const toiletries = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/toiletries");
const vodka = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/vodka");
const white_wine = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/white_wine");
const wine = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/wine");
const women_fragrance = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/women_fragrance");
const women_fragrance_set = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/women_fragrance_set");

//processing script imports
const processDataForSpirits = require("./data_processing/heinemann_sydney/spirits");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/heinemann/spirits");
const confectionary = require("../scripts/scraping_scripts/duty_free/heinmann_sydney/confectionary");

const scrapeHeinemannSydney = async (start,end,state,browser) =>{
    console.log("scraping started for heinemann sydney at:"+Date.now());

    //variable initialization
    // let spiritsData=[],wineData=[],fragranceData=[],makeupData=[],skincareData=[];
    let confectionaryData = [],accessoriesData = [], american_whiskyData = [], australian_whiskyData = [], bath_and_showerData = [], bitter_aperitifData = [], blended_whiskyData = [], blusherData = [],  body_careData = [], bodycare_careData = [], canadian_whiskyData = [], careData = [], champagneData = [], cleansingData = [], cognac_brandyData = [], concealerData = [], eye_careData = [], eye_shadowData = [], eyebrowsData = [], eyelinerData = [], foot_careData = [], fortified_wineData = [], foundationData = [], ginData = [], hair_careData = [], hand_careData = [], home_fragrance_candleData = [], irish_whiskyData = [], japanese_whiskyData = [], lipstick_and_liplinerData = [], liqueurData = [], makeup_setsData = [], mascaraData = [], masksData = [], men_bath_and_showerData = [], men_fragrance_setData = [],men_fragranceData = [], men_skincareData = [], powdersData = [], red_wineData = [], rose_wineData = [], rumData = [], scotch_whiskyData = [], serumData = [], sherry_portData = [], single_malt_whiskyData = [],skin_care_setsData = [], sparkling_wineData = [], sun_careData = [], tequilaData = [], toiletriesData = [], vodkaData = [], white_wineData = [], women_fragrance_setData = [], women_fragranceData = [];

    if(!state.sydney.accessories)
    try{
        accessoriesData = await accessories(start,end,browser);
        console.log(`${accessoriesData?.length} data items scraped for accessories`);
    }catch(err){
        console.log("There was an error while scraping accessories");
        logError(err);
    }

    if(!state.sydney.accessories&&accessoriesData?.length==0)
    try{
        accessoriesData = await accessories(start,end,browser);
        console.log(`${accessoriesData?.length} data items scraped for accessories`);

        if(accessoriesData?.length==0){
            state.sydney.accessories = true;
        }
    }catch(err){
        console.log("There was an error while scraping accessories");
        logError(err);
    }

    if(!state.sydney.american_whisky)
    try{
        american_whiskyData = await american_whisky(start,end,browser);
        console.log(`${american_whiskyData?.length} data items scraped for american_whisky`);
    }catch(err){
        console.log("There was an error while scraping american_whisky");
        logError(err);
    }

    if(!state.sydney.american_whisky&&american_whiskyData?.length==0)
    try{
        american_whiskyData = await american_whisky(start,end,browser);
        console.log(`${american_whiskyData?.length} data items scraped for american_whisky`);

        if(american_whiskyData?.length==0){
            state.sydney.american_whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping american_whisky");
        logError(err);
    }

    if(!state.sydney.australian_whisky)
    try{
        australian_whiskyData = await australian_whisky(start,end,browser);
        console.log(`${australian_whiskyData?.length} data items scraped for australian_whisky`);
    }catch(err){
        console.log("There was an error while scraping australian_whisky");
        logError(err);
    }

    if(!state.sydney.australian_whisky&&australian_whiskyData?.length==0)
    try{
        australian_whiskyData = await australian_whisky(start,end,browser);
        console.log(`${australian_whiskyData?.length} data items scraped for australian_whisky`);

        if(australian_whiskyData?.length==0){
            state.sydney.australian_whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping australian_whisky");
        logError(err);
    }

    if(!state.sydney.bath_and_shower)
    try{
        bath_and_showerData = await bath_and_shower(start,end,browser);
        console.log(`${bath_and_showerData?.length} data items scraped for bath_and_shower`);
    }catch(err){
        console.log("There was an error while scraping bath_and_shower");
        logError(err);
    }

    if(!state.sydney.bath_and_shower&&bath_and_showerData?.length==0)
    try{
        bath_and_showerData = await bath_and_shower(start,end,browser);
        console.log(`${bath_and_showerData?.length} data items scraped for bath_and_shower`);

        if(bath_and_showerData?.length==0){
            state.sydney.bath_and_shower = true;
        }
    }catch(err){
        console.log("There was an error while scraping bath_and_shower");
        logError(err);
    }

    if(!state.sydney.bitter_aperitif)
    try{
        bitter_aperitifData = await bitter_aperitif(start,end,browser);
        console.log(`${bitter_aperitifData?.length} data items scraped for bitter_aperitif`);
    }catch(err){
        console.log("There was an error while scraping bitter_aperitif");
        logError(err);
    }

    if(!state.sydney.bitter_aperitif&&bitter_aperitifData?.length==0)
    try{
        bitter_aperitifData = await bitter_aperitif(start,end,browser);
        console.log(`${bitter_aperitifData?.length} data items scraped for bitter_aperitif`);

        if(bitter_aperitifData?.length==0){
            state.sydney.bitter_aperitif = true;
        }
    }catch(err){
        console.log("There was an error while scraping bitter_aperitif");
        logError(err);
    }

    if(!state.sydney.blended_whisky)
    try{
        blended_whiskyData = await blended_whisky(start,end,browser);
        console.log(`${blended_whiskyData?.length} data items scraped for blended_whisky`);
    }catch(err){
        console.log("There was an error while scraping blended_whisky");
        logError(err);
    }

    if(!state.sydney.blended_whisky&&blended_whiskyData?.length==0)
    try{
        blended_whiskyData = await blended_whisky(start,end,browser);
        console.log(`${blended_whiskyData?.length} data items scraped for blended_whisky`);

        if(blended_whiskyData?.length==0){
            state.sydney.blended_whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping blended_whisky");
        logError(err);
    }

    if(!state.sydney.blusher)
    try{
        blusherData = await blusher(start,end,browser);
        console.log(`${blusherData?.length} data items scraped for blusher`);
    }catch(err){
        console.log("There was an error while scraping blusher");
        logError(err);
    }

    if(!state.sydney.blusher&&blusherData?.length==0)
    try{
        blusherData = await blusher(start,end,browser);
        console.log(`${blusherData?.length} data items scraped for blusher`);

        if(blusherData?.length==0){
            state.sydney.blusher = true;
        }
    }catch(err){
        console.log("There was an error while scraping blusher");
        logError(err);
    }

    if(!state.sydney.body_care)
    try{
        body_careData = await body_care(start,end,browser);
        console.log(`${body_careData?.length} data items scraped for body_care`);
    }catch(err){
        console.log("There was an error while scraping body_care");
        logError(err);
    }

    if(!state.sydney.body_care&&body_careData?.length==0)
    try{
        body_careData = await body_care(start,end,browser);
        console.log(`${body_careData?.length} data items scraped for body_care`);

        if(body_careData?.length==0){
            state.sydney.body_care = true;
        }
    }catch(err){
        console.log("There was an error while scraping body_care");
        logError(err);
    }

    if(!state.sydney.bodycare_care)
    try{
        bodycare_careData = await bodycare_care(start,end,browser);
        console.log(`${bodycare_careData?.length} data items scraped for bodycare_care`);
    }catch(err){
        console.log("There was an error while scraping bodycare_care");
        logError(err);
    }

    if(!state.sydney.bodycare_care&&bodycare_careData?.length==0)
    try{
        bodycare_careData = await bodycare_care(start,end,browser);
        console.log(`${bodycare_careData?.length} data items scraped for bodycare_care`);

        if(bodycare_careData?.length==0){
            state.sydney.bodycare_care = true;
        }
    }catch(err){
        console.log("There was an error while scraping bodycare_care");
        logError(err);
    }

    if(!state.sydney.canadian_whisky)
    try{
        canadian_whiskyData = await canadian_whisky(start,end,browser);
        console.log(`${canadian_whiskyData?.length} data items scraped for canadian_whisky`);
    }catch(err){
        console.log("There was an error while scraping canadian_whisky");
        logError(err);
    }

    if(!state.sydney.canadian_whisky&&canadian_whiskyData?.length==0)
    try{
        canadian_whiskyData = await canadian_whisky(start,end,browser);
        console.log(`${canadian_whiskyData?.length} data items scraped for canadian_whisky`);

        if(canadian_whiskyData?.length==0){
            state.sydney.canadian_whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping canadian_whisky");
        logError(err);
    }

    if(!state.sydney.care)
    try{
        careData = await care(start,end,browser);
        console.log(`${careData?.length} data items scraped for care`);
    }catch(err){
        console.log("There was an error while scraping care");
        logError(err);
    }

    if(!state.sydney.care&&careData?.length==0)
    try{
        careData = await care(start,end,browser);
        console.log(`${careData?.length} data items scraped for care`);

        if(careData?.length==0){
            state.sydney.care = true;
        }
    }catch(err){
        console.log("There was an error while scraping care");
        logError(err);
    }

    if(!state.sydney.champagne)
    try{
        champagneData = await champagne(start,end,browser);
        console.log(`${champagneData?.length} data items scraped for champagne`);
    }catch(err){
        console.log("There was an error while scraping champagne");
        logError(err);
    }

    if(!state.sydney.champagne&&champagneData?.length==0)
    try{
        champagneData = await champagne(start,end,browser);
        console.log(`${champagneData?.length} data items scraped for champagne`);

        if(champagneData?.length==0){
            state.sydney.champagne = true;
        }
    }catch(err){
        console.log("There was an error while scraping champagne");
        logError(err);
    }

    if(!state.sydney.cleansing)
    try{
        cleansingData = await cleansing(start,end,browser);
        console.log(`${cleansingData?.length} data items scraped for cleansing`);
    }catch(err){
        console.log("There was an error while scraping cleansing");
        logError(err);
    }

    if(!state.sydney.cleansing&&cleansingData?.length==0)
    try{
        cleansingData = await cleansing(start,end,browser);
        console.log(`${cleansingData?.length} data items scraped for cleansing`);

        if(cleansingData?.length==0){
            state.sydney.cleansing = true;
        }
    }catch(err){
        console.log("There was an error while scraping cleansing");
        logError(err);
    }

    if(!state.sydney.cognac_brandy)
    try{
        cognac_brandyData = await cognac_brandy(start,end,browser);
        console.log(`${cognac_brandyData?.length} data items scraped for cognac_brandy`);
    }catch(err){
        console.log("There was an error while scraping cognac_brandy");
        logError(err);
    }

    if(!state.sydney.cognac_brandy&&cognac_brandyData?.length==0)
    try{
        cognac_brandyData = await cognac_brandy(start,end,browser);
        console.log(`${cognac_brandyData?.length} data items scraped for cognac_brandy`);

        if(cognac_brandyData?.length==0){
            state.sydney.cognac_brandy = true;
        }
    }catch(err){
        console.log("There was an error while scraping cognac_brandy");
        logError(err);
    }

    if(!state.sydney.concealer)
    try{
        concealerData = await concealer(start,end,browser);
        console.log(`${concealerData?.length} data items scraped for concealer`);
    }catch(err){
        console.log("There was an error while scraping concealer");
        logError(err);
    }

    if(!state.sydney.concealer&&concealerData?.length==0)
    try{
        concealerData = await concealer(start,end,browser);
        console.log(`${concealerData?.length} data items scraped for concealer`);

        if(concealerData?.length==0){
            state.sydney.concealer = true;
        }
    }catch(err){
        console.log("There was an error while scraping concealer");
        logError(err);
    }

    if(!state.sydney.eye_care)
    try{
        eye_careData = await eye_care(start,end,browser);
        console.log(`${eye_careData?.length} data items scraped for eye_care`);
    }catch(err){
        console.log("There was an error while scraping eye_care");
        logError(err);
    }

    if(!state.sydney.eye_care&&eye_careData?.length==0)
    try{
        eye_careData = await eye_care(start,end,browser);
        console.log(`${eye_careData?.length} data items scraped for eye_care`);

        if(eye_careData?.length==0){
            state.sydney.eye_care = true;
        }
    }catch(err){
        console.log("There was an error while scraping eye_care");
        logError(err);
    }

    if(!state.sydney.eye_shadow)
    try{
        eye_shadowData = await eye_shadow(start,end,browser);
        console.log(`${eye_shadowData?.length} data items scraped for eye_shadow`);
    }catch(err){
        console.log("There was an error while scraping eye_shadow");
        logError(err);
    }

    if(!state.sydney.eye_shadow&&eye_shadowData?.length==0)
    try{
        eye_shadowData = await eye_shadow(start,end,browser);
        console.log(`${eye_shadowData?.length} data items scraped for eye_shadow`);

        if(eye_shadowData?.length==0){
            state.sydney.eye_shadow = true;
        }
    }catch(err){
        console.log("There was an error while scraping eye_shadow");
        logError(err);
    }
    
    if(!state.sydney.eyebrows)
    try{
        eyebrowsData = await eyebrows(start,end,browser);
        console.log(`${eyebrowsData?.length} data items scraped for eyebrows`);
    }catch(err){
        console.log("There was an error while scraping eyebrows");
        logError(err);
    }

    if(!state.sydney.eyebrows&&eyebrowsData?.length==0)
    try{
        eyebrowsData = await eyebrows(start,end,browser);
        console.log(`${eyebrowsData?.length} data items scraped for eyebrows`);

        if(eyebrowsData?.length==0){
            state.sydney.eyebrows = true;
        }
    }catch(err){
        console.log("There was an error while scraping eyebrows");
        logError(err);
    }

    if(!state.sydney.eyeliner)
    try{
        eyelinerData = await eyeliner(start,end,browser);
        console.log(`${eyelinerData?.length} data items scraped for eyeliner`);
    }catch(err){
        console.log("There was an error while scraping eyeliner");
        logError(err);
    }

    if(!state.sydney.eyeliner&&eyelinerData?.length==0)
    try{
        eyelinerData = await eyeliner(start,end,browser);
        console.log(`${eyelinerData?.length} data items scraped for eyeliner`);

        if(eyelinerData?.length==0){
            state.sydney.eyeliner = true;
        }
    }catch(err){
        console.log("There was an error while scraping eyeliner");
        logError(err);
    }

    if(!state.sydney.foot_care)
    try{
        foot_careData = await foot_care(start,end,browser);
        console.log(`${foot_careData?.length} data items scraped for foot_care`);
    }catch(err){
        console.log("There was an error while scraping foot_care");
        logError(err);
    }

    if(!state.sydney.foot_care&&foot_careData?.length==0)
    try{
        foot_careData = await foot_care(start,end,browser);
        console.log(`${foot_careData?.length} data items scraped for foot_care`);

        if(foot_careData?.length==0){
            state.sydney.foot_care = true;
        }
    }catch(err){
        console.log("There was an error while scraping foot_care");
        logError(err);
    }

    if(!state.sydney.fortified_wine)
    try{
        fortified_wineData = await fortified_wine(start,end,browser);
        console.log(`${fortified_wineData?.length} data items scraped for fortified_wine`);
    }catch(err){
        console.log("There was an error while scraping fortified_wine");
        logError(err);
    }

    if(!state.sydney.fortified_wine&&fortified_wineData?.length==0)
    try{
        fortified_wineData = await fortified_wine(start,end,browser);
        console.log(`${fortified_wineData?.length} data items scraped for fortified_wine`);

        if(fortified_wineData?.length==0){
            state.sydney.fortified_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping fortified_wine");
        logError(err);
    }

    if(!state.sydney.foundation)
    try{
        foundationData = await foundation(start,end,browser);
        console.log(`${foundationData?.length} data items scraped for foundation`);
    }catch(err){
        console.log("There was an error while scraping foundation");
        logError(err);
    }

    if(!state.sydney.foundation&&foundationData?.length==0)
    try{
        foundationData = await foundation(start,end,browser);
        console.log(`${foundationData?.length} data items scraped for foundation`);

        if(foundationData?.length==0){
            state.sydney.foundation = true;
        }
    }catch(err){
        console.log("There was an error while scraping foundation");
        logError(err);
    }

    if(!state.sydney.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.sydney.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

        if(ginData?.length==0){
            state.sydney.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.sydney.hair_care)
    try{
        hair_careData = await hair_care(start,end,browser);
        console.log(`${hair_careData?.length} data items scraped for hair_care`);
    }catch(err){
        console.log("There was an error while scraping hair_care");
        logError(err);
    }

    if(!state.sydney.hair_care&&hair_careData?.length==0)
    try{
        hair_careData = await hair_care(start,end,browser);
        console.log(`${hair_careData?.length} data items scraped for hair_care`);

        if(hair_careData?.length==0){
            state.sydney.hair_care = true;
        }
    }catch(err){
        console.log("There was an error while scraping hair_care");
        logError(err);
    }

    if(!state.sydney.hand_care)
    try{
        hand_careData = await hand_care(start,end,browser);
        console.log(`${hand_careData?.length} data items scraped for hand_care`);
    }catch(err){
        console.log("There was an error while scraping hand_care");
        logError(err);
    }

    if(!state.sydney.hand_care&&hand_careData?.length==0)
    try{
        hand_careData = await hand_care(start,end,browser);
        console.log(`${hand_careData?.length} data items scraped for hand_care`);

        if(hand_careData?.length==0){
            state.sydney.hand_care = true;
        }
    }catch(err){
        console.log("There was an error while scraping hand_care");
        logError(err);
    }

    if(!state.sydney.home_fragrance_candle)
    try{
        home_fragrance_candleData = await home_fragrance_candle(start,end,browser);
        console.log(`${home_fragrance_candleData?.length} data items scraped for home_fragrance_candle`);
    }catch(err){
        console.log("There was an error while scraping home_fragrance_candle");
        logError(err);
    }

    if(!state.sydney.home_fragrance_candle&&home_fragrance_candleData?.length==0)
    try{
        home_fragrance_candleData = await home_fragrance_candle(start,end,browser);
        console.log(`${home_fragrance_candleData?.length} data items scraped for home_fragrance_candle`);

        if(home_fragrance_candleData?.length==0){
            state.sydney.home_fragrance_candle = true;
        }
    }catch(err){
        console.log("There was an error while scraping home_fragrance_candle");
        logError(err);
    }

    if(!state.sydney.irish_whisky)
    try{
        irish_whiskyData = await irish_whisky(start,end,browser);
        console.log(`${irish_whiskyData?.length} data items scraped for irish_whisky`);
    }catch(err){
        console.log("There was an error while scraping irish_whisky");
        logError(err);
    }

    if(!state.sydney.irish_whisky&&irish_whiskyData?.length==0)
    try{
        irish_whiskyData = await irish_whisky(start,end,browser);
        console.log(`${irish_whiskyData?.length} data items scraped for irish_whisky`);

        if(irish_whiskyData?.length==0){
            state.sydney.irish_whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping irish_whisky");
        logError(err);
    }

    if(!state.sydney.japanese_whisky)
    try{
        japanese_whiskyData = await japanese_whisky(start,end,browser);
        console.log(`${japanese_whiskyData?.length} data items scraped for japanese_whisky`);
    }catch(err){
        console.log("There was an error while scraping japanese_whisky");
        logError(err);
    }

    if(!state.sydney.japanese_whisky&&japanese_whiskyData?.length==0)
    try{
        japanese_whiskyData = await japanese_whisky(start,end,browser);
        console.log(`${japanese_whiskyData?.length} data items scraped for japanese_whisky`);

        if(japanese_whiskyData?.length==0){
            state.sydney.japanese_whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping japanese_whisky");
        logError(err);
    }

    if(!state.sydney.lipstick_and_lipliner)
    try{
        lipstick_and_liplinerData = await lipstick_and_lipliner(start,end,browser);
        console.log(`${lipstick_and_liplinerData?.length} data items scraped for lipstick_and_lipliner`);
    }catch(err){
        console.log("There was an error while scraping lipstick_and_lipliner");
        logError(err);
    }

    if(!state.sydney.lipstick_and_lipliner&&lipstick_and_liplinerData?.length==0)
    try{
        lipstick_and_liplinerData = await lipstick_and_lipliner(start,end,browser);
        console.log(`${lipstick_and_liplinerData?.length} data items scraped for lipstick_and_lipliner`);

        if(lipstick_and_liplinerData?.length==0){
            state.sydney.lipstick_and_lipliner = true;
        }
    }catch(err){
        console.log("There was an error while scraping lipstick_and_lipliner");
        logError(err);
    }

    if(!state.sydney.liqueur)
    try{
        liqueurData = await liqueur(start,end,browser);
        console.log(`${liqueurData?.length} data items scraped for liqueur`);
    }catch(err){
        console.log("There was an error while scraping liqueur");
        logError(err);
    }

    if(!state.sydney.liqueur&&liqueurData?.length==0)
    try{
        liqueurData = await liqueur(start,end,browser);
        console.log(`${liqueurData?.length} data items scraped for liqueur`);

        if(liqueurData?.length==0){
            state.sydney.liqueur = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueur");
        logError(err);
    }

    if(!state.sydney.makeup_sets)
    try{
        makeup_setsData = await makeup_sets(start,end,browser);
        console.log(`${makeup_setsData?.length} data items scraped for makeup_sets`);
    }catch(err){
        console.log("There was an error while scraping makeup_sets");
        logError(err);
    }

    if(!state.sydney.makeup_sets&&makeup_setsData?.length==0)
    try{
        makeup_setsData = await makeup_sets(start,end,browser);
        console.log(`${makeup_setsData?.length} data items scraped for makeup_sets`);

        if(makeup_setsData?.length==0){
            state.sydney.makeup_sets = true;
        }
    }catch(err){
        console.log("There was an error while scraping makeup_sets");
        logError(err);
    }

    if(!state.sydney.mascara)
    try{
        mascaraData = await mascara(start,end,browser);
        console.log(`${mascaraData?.length} data items scraped for mascara`);
    }catch(err){
        console.log("There was an error while scraping mascara");
        logError(err);
    }

    if(!state.sydney.mascara&&mascaraData?.length==0)
    try{
        mascaraData = await mascara(start,end,browser);
        console.log(`${mascaraData?.length} data items scraped for mascara`);

        if(mascaraData?.length==0){
            state.sydney.mascara = true;
        }
    }catch(err){
        console.log("There was an error while scraping mascara");
        logError(err);
    }

    if(!state.sydney.masks)
    try{
        masksData = await masks(start,end,browser);
        console.log(`${masksData?.length} data items scraped for masks`);
    }catch(err){
        console.log("There was an error while scraping masks");
        logError(err);
    }

    if(!state.sydney.masks&&masksData?.length==0)
    try{
        masksData = await masks(start,end,browser);
        console.log(`${masksData?.length} data items scraped for masks`);

        if(masksData?.length==0){
            state.sydney.masks = true;
        }
    }catch(err){
        console.log("There was an error while scraping masks");
        logError(err);
    }

    if(!state.sydney.men_bath_and_shower)
    try{
        men_bath_and_showerData = await men_bath_and_shower(start,end,browser);
        console.log(`${men_bath_and_showerData?.length} data items scraped for men_bath_and_shower`);
    }catch(err){
        console.log("There was an error while scraping men_bath_and_shower");
        logError(err);
    }

    if(!state.sydney.men_bath_and_shower&&men_bath_and_showerData?.length==0)
    try{
        men_bath_and_showerData = await men_bath_and_shower(start,end,browser);
        console.log(`${men_bath_and_showerData?.length} data items scraped for men_bath_and_shower`);

        if(men_bath_and_showerData?.length==0){
            state.sydney.men_bath_and_shower = true;
        }
    }catch(err){
        console.log("There was an error while scraping men_bath_and_shower");
        logError(err);
    }

    if(!state.sydney.men_fragrance_set)
    try{
        men_fragrance_setData = await men_fragrance_set(start,end,browser);
        console.log(`${men_fragrance_setData?.length} data items scraped for men_fragrance_set`);
    }catch(err){
        console.log("There was an error while scraping men_fragrance_set");
        logError(err);
    }

    if(!state.sydney.men_fragrance_set&&men_fragrance_setData?.length==0)
    try{
        men_fragrance_setData = await men_fragrance_set(start,end,browser);
        console.log(`${men_fragrance_setData?.length} data items scraped for men_fragrance_set`);

        if(men_fragrance_setData?.length==0){
            state.sydney.men_fragrance_set = true;
        }
    }catch(err){
        console.log("There was an error while scraping men_fragrance_set");
        logError(err);
    }

    if(!state.sydney.men_fragrance)
    try{
        men_fragranceData = await men_fragrance(start,end,browser);
        console.log(`${men_fragranceData?.length} data items scraped for men_fragrance`);
    }catch(err){
        console.log("There was an error while scraping men_fragrance");
        logError(err);
    }

    if(!state.sydney.men_fragrance&&men_fragranceData?.length==0)
    try{
        men_fragranceData = await men_fragrance(start,end,browser);
        console.log(`${men_fragranceData?.length} data items scraped for men_fragrance`);

        if(men_fragranceData?.length==0){
            state.sydney.men_fragrance = true;
        }
    }catch(err){
        console.log("There was an error while scraping men_fragrance");
        logError(err);
    }

    if(!state.sydney.men_skincare)
    try{
        men_skincareData = await men_skincare(start,end,browser);
        console.log(`${men_skincareData?.length} data items scraped for men_skincare`);
    }catch(err){
        console.log("There was an error while scraping men_skincare");
        logError(err);
    }

    if(!state.sydney.men_skincare&&men_skincareData?.length==0)
    try{
        men_skincareData = await men_skincare(start,end,browser);
        console.log(`${men_skincareData?.length} data items scraped for men_skincare`);

        if(men_skincareData?.length==0){
            state.sydney.men_skincare = true;
        }
    }catch(err){
        console.log("There was an error while scraping men_skincare");
        logError(err);
    }

    if(!state.sydney.powders)
    try{
        powdersData = await powders(start,end,browser);
        console.log(`${powdersData?.length} data items scraped for powders`);
    }catch(err){
        console.log("There was an error while scraping powders");
        logError(err);
    }

    if(!state.sydney.powders&&powdersData?.length==0)
    try{
        powdersData = await powders(start,end,browser);
        console.log(`${powdersData?.length} data items scraped for powders`);

        if(powdersData?.length==0){
            state.sydney.powders = true;
        }
    }catch(err){
        console.log("There was an error while scraping powders");
        logError(err);
    }

    if(!state.sydney.red_wine)
    try{
        red_wineData = await red_wine(start,end,browser);
        console.log(`${red_wineData?.length} data items scraped for red_wine`);
    }catch(err){
        console.log("There was an error while scraping red_wine");
        logError(err);
    }

    if(!state.sydney.red_wine&&red_wineData?.length==0)
    try{
        red_wineData = await red_wine(start,end,browser);
        console.log(`${red_wineData?.length} data items scraped for red_wine`);

        if(red_wineData?.length==0){
            state.sydney.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping red_wine");
        logError(err);
    }

    if(!state.sydney.rose_wine)
    try{
        rose_wineData = await rose_wine(start,end,browser);
        console.log(`${rose_wineData?.length} data items scraped for rose_wine`);
    }catch(err){
        console.log("There was an error while scraping rose_wine");
        logError(err);
    }

    if(!state.sydney.rose_wine&&rose_wineData?.length==0)
    try{
        rose_wineData = await rose_wine(start,end,browser);
        console.log(`${rose_wineData?.length} data items scraped for rose_wine`);

        if(rose_wineData?.length==0){
            state.sydney.rose_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping rose_wine");
        logError(err);
    }

    if(!state.sydney.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.sydney.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

        if(rumData?.length==0){
            state.sydney.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.sydney.scotch_whisky)
    try{
        scotch_whiskyData = await scotch_whisky(start,end,browser);
        console.log(`${scotch_whiskyData?.length} data items scraped for scotch_whisky`);
    }catch(err){
        console.log("There was an error while scraping scotch_whisky");
        logError(err);
    }

    if(!state.sydney.scotch_whisky&&scotch_whiskyData?.length==0)
    try{
        scotch_whiskyData = await scotch_whisky(start,end,browser);
        console.log(`${scotch_whiskyData?.length} data items scraped for scotch_whisky`);

        if(scotch_whiskyData?.length==0){
            state.sydney.scotch_whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping scotch_whisky");
        logError(err);
    }

    if(!state.sydney.serum)
    try{
        serumData = await serum(start,end,browser);
        console.log(`${serumData?.length} data items scraped for serum`);
    }catch(err){
        console.log("There was an error while scraping serum");
        logError(err);
    }

    if(!state.sydney.serum&&serumData?.length==0)
    try{
        serumData = await serum(start,end,browser);
        console.log(`${serumData?.length} data items scraped for serum`);

        if(serumData?.length==0){
            state.sydney.serum = true;
        }
    }catch(err){
        console.log("There was an error while scraping serum");
        logError(err);
    }

    if(!state.sydney.sherry_port)
    try{
        sherry_portData = await sherry_port(start,end,browser);
        console.log(`${sherry_portData?.length} data items scraped for sherry_port`);
    }catch(err){
        console.log("There was an error while scraping sherry_port");
        logError(err);
    }

    if(!state.sydney.sherry_port&&sherry_portData?.length==0)
    try{
        sherry_portData = await sherry_port(start,end,browser);
        console.log(`${sherry_portData?.length} data items scraped for sherry_port`);

        if(sherry_portData?.length==0){
            state.sydney.sherry_port = true;
        }
    }catch(err){
        console.log("There was an error while scraping sherry_port");
        logError(err);
    }

    if(!state.sydney.single_malt_whisky)
    try{
        single_malt_whiskyData = await single_malt_whisky(start,end,browser);
        console.log(`${single_malt_whiskyData?.length} data items scraped for single_malt_whisky`);
    }catch(err){
        console.log("There was an error while scraping single_malt_whisky");
        logError(err);
    }

    if(!state.sydney.single_malt_whisky&&single_malt_whiskyData?.length==0)
    try{
        single_malt_whiskyData = await single_malt_whisky(start,end,browser);
        console.log(`${single_malt_whiskyData?.length} data items scraped for single_malt_whisky`);

        if(single_malt_whiskyData?.length==0){
            state.sydney.single_malt_whisky = true;
        }
    }catch(err){
        console.log("There was an error while scraping single_malt_whisky");
        logError(err);
    }

    if(!state.sydney.skin_care_sets)
    try{
        skin_care_setsData = await skin_care_sets(start,end,browser);
        console.log(`${skin_care_setsData?.length} data items scraped for skin_care_sets`);
    }catch(err){
        console.log("There was an error while scraping skin_care_sets");
        logError(err);
    }

    if(!state.sydney.skin_care_sets&&skin_care_setsData?.length==0)
    try{
        skin_care_setsData = await skin_care_sets(start,end,browser);
        console.log(`${skin_care_setsData?.length} data items scraped for skin_care_sets`);

        if(skin_care_setsData?.length==0){
            state.sydney.skin_care_sets = true;
        }
    }catch(err){
        console.log("There was an error while scraping skin_care_sets");
        logError(err);
    }

    if(!state.sydney.sparkling_wine)
    try{
        sparkling_wineData = await sparkling_wine(start,end,browser);
        console.log(`${sparkling_wineData?.length} data items scraped for sparkling_wine`);
    }catch(err){
        console.log("There was an error while scraping sparkling_wine");
        logError(err);
    }

    if(!state.sydney.sparkling_wine&&sparkling_wineData?.length==0)
    try{
        sparkling_wineData = await sparkling_wine(start,end,browser);
        console.log(`${sparkling_wineData?.length} data items scraped for sparkling_wine`);

        if(sparkling_wineData?.length==0){
            state.sydney.sparkling_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping sparkling_wine");
        logError(err);
    }

    if(!state.sydney.sun_care)
    try{
        sun_careData = await sun_care(start,end,browser);
        console.log(`${sun_careData?.length} data items scraped for sun_care`);
    }catch(err){
        console.log("There was an error while scraping sun_care");
        logError(err);
    }

    if(!state.sydney.sun_care&&sun_careData?.length==0)
    try{
        sun_careData = await sun_care(start,end,browser);
        console.log(`${sun_careData?.length} data items scraped for sun_care`);

        if(sun_careData?.length==0){
            state.sydney.sun_care = true;
        }
    }catch(err){
        console.log("There was an error while scraping sun_care");
        logError(err);
    }

    if(!state.sydney.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.sydney.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

        if(tequilaData?.length==0){
            state.sydney.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.sydney.toiletries)
    try{
        toiletriesData = await toiletries(start,end,browser);
        console.log(`${toiletriesData?.length} data items scraped for toiletries`);
    }catch(err){
        console.log("There was an error while scraping toiletries");
        logError(err);
    }

    if(!state.sydney.toiletries&&toiletriesData?.length==0)
    try{
        toiletriesData = await toiletries(start,end,browser);
        console.log(`${toiletriesData?.length} data items scraped for toiletries`);

        if(toiletriesData?.length==0){
            state.sydney.toiletries = true;
        }
    }catch(err){
        console.log("There was an error while scraping toiletries");
        logError(err);
    }

    if(!state.sydney.vodka)
    try{
        vodkaData = await vodka(start,end,browser);
        console.log(`${vodkaData?.length} data items scraped for vodka`);
    }catch(err){
        console.log("There was an error while scraping vodka");
        logError(err);
    }

    if(!state.sydney.vodka&&vodkaData?.length==0)
    try{
        vodkaData = await vodka(start,end,browser);
        console.log(`${vodkaData?.length} data items scraped for vodka`);

        if(vodkaData?.length==0){
            state.sydney.vodka = true;
        }
    }catch(err){
        console.log("There was an error while scraping vodka");
        logError(err);
    }

    if(!state.sydney.white_wine)
    try{
        white_wineData = await white_wine(start,end,browser);
        console.log(`${white_wineData?.length} data items scraped for white_wine`);
    }catch(err){
        console.log("There was an error while scraping white_wine");
        logError(err);
    }

    if(!state.sydney.white_wine&&white_wineData?.length==0)
    try{
        white_wineData = await white_wine(start,end,browser);
        console.log(`${white_wineData?.length} data items scraped for white_wine`);

        if(white_wineData?.length==0){
            state.sydney.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping white_wine");
        logError(err);
    }

    if(!state.sydney.women_fragrance_set)
    try{
        women_fragrance_setData = await women_fragrance_set(start,end,browser);
        console.log(`${women_fragrance_setData?.length} data items scraped for women_fragrance_set`);
    }catch(err){
        console.log("There was an error while scraping women_fragrance_set");
        logError(err);
    }

    if(!state.sydney.women_fragrance_set&&women_fragrance_setData?.length==0)
    try{
        women_fragrance_setData = await women_fragrance_set(start,end,browser);
        console.log(`${women_fragrance_setData?.length} data items scraped for women_fragrance_set`);

        if(women_fragrance_setData?.length==0){
            state.sydney.women_fragrance_set = true;
        }
    }catch(err){
        console.log("There was an error while scraping women_fragrance_set");
        logError(err);
    }

    if(!state.sydney.women_fragrance)
    try{
        women_fragranceData = await women_fragrance(start,end,browser);
        console.log(`${women_fragranceData?.length} data items scraped for women_fragrance`);
    }catch(err){
        console.log("There was an error while scraping women_fragrance");
        logError(err);
    }

    if(!state.sydney.women_fragrance&&women_fragranceData?.length==0)
    try{
        women_fragranceData = await women_fragrance(start,end,browser);
        console.log(`${women_fragranceData?.length} data items scraped for women_fragrance`);

        if(women_fragranceData?.length==0){
            state.sydney.women_fragrance = true;
        }
    }catch(err){
        console.log("There was an error while scraping women_fragrance");
        logError(err);
    }
    
    if(!state.sydney.confectionary)
    try{
        confectionaryData = await confectionary(start,end,browser);
        console.log(`${confectionaryData?.length} data items scraped for confectionary`);
    }catch(err){
        console.log("There was an error while scraping confectionary");
        logError(err);
    }
    if(!state.sydney.confectionary&&confectionaryData?.length==0)
    try{
        confectionaryData = await confectionary(start,end,browser);
        console.log(`${confectionaryData?.length} data items scraped for confectionary`);
        if(confectionaryData?.length==0){
            state.sydney.confectionary = true;
        }
    }catch(err){
        console.log("There was an error while scraping confectionary");
        logError(err);
    }
    //scrape each category
    // if(!state.sydney.spirits)
    // try{
    //     spiritsData = await spirits(start,end,browser);
    //     console.log(`${spiritsData?.length} data items scraped for spirits`);
    // }catch(err){
    //     console.log("There was an error while scraping spirits");
    //     logError(err);
    // }

    // if(!state.sydney.spirits&&spiritsData?.length==0)
    // try{
    //     spiritsData = await spirits(start,end,browser);
    //     console.log(`${spiritsData?.length} data items scraped for spirits`);

    //     if(spiritsData?.length==0){
    //         state.sydney.spirits = true;
    //     }
    // }catch(err){
    //     console.log("There was an error while scraping spirits");
    //     logError(err);
    // }

    // try{
    //     spiritsData = await spiritsMultibuy(spiritsData);
    // }catch(err){
    //     logError(err);
    // }

    // if(!state.sydney.wine)
    // try{
    //     wineData = await wine(start,end,browser);
    //     console.log(`${wineData?.length} data items scraped for wine`);     
    // }catch(err){
    //     console.log("There was an error while scraping wine");
    //     logError(err);
    // }

    // if(!state.sydney.wine&&wineData?.length==0)
    // try{
    //     wineData = await wine(start,end,browser);
    //     console.log(`${wineData?.length} data items scraped for wine`);

    //     if(wineData?.length==0){
    //         state.sydney.wine = true;
    //     }        
    // }catch(err){
    //     console.log("There was an error while scraping wine");
    //     logError(err);
    // }

    // try{
    //     wineData = await spiritsMultibuy(wineData);
    // }catch(err){
    //     logError(err);
    // }

    // if(!state.sydney.fragrance)
    // try{
    //     fragranceData = await fragrance(start,end,browser);
    //     console.log(`${fragranceData?.length} data items scraped for fragrance`);
    // }catch(err){
    //     console.log("There was an error while scraping fragrance");
    //     logError(err);
    // }

    // if(!state.sydney.fragrance&&fragranceData?.length==0)
    // try{
    //     fragranceData = await fragrance(start,end,browser);
    //     console.log(`${fragranceData?.length} data items scraped for fragrance`);

    //     if(fragranceData?.length==0){
    //         state.sydney.fragrance = true;
    //     }
    // }catch(err){
    //     console.log("There was an error while scraping fragrance");
    //     logError(err);
    // }

    // if(!state.sydney.makeup)
    // try{
    //     makeupData = await makeup(start,end,browser);
    //     console.log(`${makeupData?.length} data items scraped for makeup`);

    // }catch(err){
    //     console.log("There was an error while scraping makeup");
    //     logError(err);
    // }

    // if(!state.sydney.makeup&&makeupData?.length==0)
    // try{
    //     makeupData = await makeup(start,end,browser);
    //     console.log(`${makeupData?.length} data items scraped for makeup`);

    //     if(makeupData?.length==0){
    //         state.sydney.makeup = true;
    //     }
    // }catch(err){
    //     console.log("There was an error while scraping makeup");
    //     logError(err);
    // }

    // if(!state.sydney.skincare)
    // try{
    //     skincareData = await skincare(start,end,browser);
    //     console.log(`${skincareData?.length} data items scraped for skincare`);
    // }catch(err){
    //     console.log("There was an error while scraping skincare");
    //     logError(err);
    // }

    // if(!state.sydney.skincare&&skincareData?.length==0)
    // try{
    //     skincareData = await skincare(start,end,browser);
    //     console.log(`${skincareData?.length} data items scraped for skincare`);

    //     if(skincareData?.length==0){
    //         state.sydney.skincare = true;
    //     }
    // }catch(err){
    //     console.log("There was an error while scraping skincare");
    //     logError(err);
    // }

    //merge data
    // spiritsData = [...spiritsData,...wineData,...fragranceData,...makeupData,...skincareData];
    accessoriesData = [...accessoriesData,...confectionaryData,...american_whiskyData,...australian_whiskyData,...bath_and_showerData,...bitter_aperitifData,...blended_whiskyData,...blusherData,...body_careData,...bodycare_careData,...canadian_whiskyData,...careData,...champagneData,...cleansingData,...cognac_brandyData,...concealerData,...eye_careData,...eye_shadowData,...eyebrowsData,...eyelinerData,...foot_careData,...fortified_wineData,...foundationData,...ginData,...hair_careData,...hand_careData,...home_fragrance_candleData,...irish_whiskyData,...japanese_whiskyData,...lipstick_and_liplinerData,...liqueurData,...makeup_setsData,...mascaraData,...masksData,...men_bath_and_showerData,...men_fragrance_setData,...men_fragranceData,...men_skincareData,...powdersData,...red_wineData,...rose_wineData,...rumData,...scotch_whiskyData,...serumData,...sherry_portData,...single_malt_whiskyData,...skin_care_setsData,...sparkling_wineData,...sun_careData,...tequilaData,...toiletriesData,...vodkaData,...white_wineData,...women_fragrance_setData,...women_fragranceData];

    try{
        accessoriesData = await spiritsMultibuy(accessoriesData);
    }catch(err){
        logError(err);
    }

    //process data
    try{
        accessoriesData = await processDataForSpirits(accessoriesData);
        console.log(`data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing data");
        logError(err);
    }

    //update db
    try{
        await updateDBEntry(accessoriesData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for heinemann sydney");
    return accessoriesData?.length==0;
}

module.exports = scrapeHeinemannSydney;