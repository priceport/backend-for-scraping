//scraping script imports
const champagne = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/champagne");
const baijiu = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/baijiu");
const bath_shower = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/bath_shower");
const beauty = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/beauty");
const body_care = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/body_care");
const brandy = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/brandy");
const cleansers_and_toners = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/cleansers_and_toners");
const cognac = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/cognac");
const devices = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/devices");
const eau_de_cologne = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/eau_de_cologne");
const eau_de_parfum = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/eau_de_parfum");
const eau_de_toilette = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/eau_de_toilette");
const eyes = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/eyes");
const face = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/face");
const gin = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/gin");
const home_fragrance = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/home_fragrance");
const korean_liquor = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/korean_liquor");
const lips = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/lips");
const liqueurs = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/liqueurs");
const masks = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/masks");
const moisturisers = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/moisturisers");
const port_and_sherry = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/port_and_sherry");
const red_wine = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/red_wine");
const rum = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/rum");
const serums_essences = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/serums_essences");
const sets_pack = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/sets_pack");
const single_malt = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/single_malt");
const sparkling_wine = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/sparkling_wine");
const spirits = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/spirits");
const sun_care = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/sun_care");
const tequila = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/tequila");
const treatments = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/treatments");
const vodka = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/vodka");
const whiskey = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/whiskey");
const white_wine = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/white_wine");
const wine_champagne_beer = require("../scripts/scraping_scripts/duty_free/lotte_brisbane/wine_champagne_beer");

//processing script imports
const processDataForBeauty = require("./data_processing/lotte_brisbane/beauty");
const processDataForSpirits = require("./data_processing/lotte_brisbane/spirits");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/lotte_brisbane/spirits");

const scrapeLotteBrisbane = async (start,end,state,browser) =>{
    console.log("scraping started for lotte brisbane at:"+Date.now());

    //variable initialization
    // let spiritsData=[],beautyData=[];
    let baijiuData = [], bath_showerData = [], body_careData = [], brandyData = [], champagneData = [], cleansers_and_tonersData = [], cognacData = [], devicesData = [], eau_de_cologneData = [], eau_de_parfumData = [], eau_de_toiletteData = [], eyesData = [], faceData = [], ginData = [], home_fragranceData = [], korean_liquorData = [], lipsData = [], liqueursData = [], masksData = [], moisturisersData = [], port_and_sherryData = [], red_wineData = [], rumData = [], serums_essencesData = [], sets_packData = [], single_maltData = [], sparkling_wineData = [], sun_careData = [], tequilaData = [], treatmentsData = [], vodkaData = [], whiskeyData = [], white_wineData = [], wine_champagne_beerData = [];


    if(!state.brisbane.baijiu)
    try{
        baijiuData = await baijiu(start,end,browser);
        console.log(`${baijiuData?.length} data items scraped for baijiu`);

    }catch(err){
        console.log("There was an error while scraping baijiu");
        logError(err);
    }

    if(!state.brisbane.baijiu&&baijiuData?.length==0)
    try{
        baijiuData = await baijiu(start,end,browser);
        console.log(`${baijiuData?.length} data items scraped for baijiu`);

        if(baijiuData?.length==0){
            state.brisbane.baijiu = true;
        }
    }catch(err){
        console.log("There was an error while scraping baijiu");
        logError(err);
    }

    if(!state.brisbane.bath_shower)
    try{
        bath_showerData = await bath_shower(start,end,browser);
        console.log(`${bath_showerData?.length} data items scraped for bath_shower`);

    }catch(err){
        console.log("There was an error while scraping bath_shower");
        logError(err);
    }

    if(!state.brisbane.bath_shower&&bath_showerData?.length==0)
    try{
        bath_showerData = await bath_shower(start,end,browser);
        console.log(`${bath_showerData?.length} data items scraped for bath_shower`);

        if(bath_showerData?.length==0){
            state.brisbane.bath_shower = true;
        }
    }catch(err){
        console.log("There was an error while scraping bath_shower");
        logError(err);
    }

    if(!state.brisbane.body_care)
    try{
        body_careData = await body_care(start,end,browser);
        console.log(`${body_careData?.length} data items scraped for body_care`);

    }catch(err){
        console.log("There was an error while scraping body_care");
        logError(err);
    }

    if(!state.brisbane.body_care&&body_careData?.length==0)
    try{
        body_careData = await body_care(start,end,browser);
        console.log(`${body_careData?.length} data items scraped for body_care`);

        if(body_careData?.length==0){
            state.brisbane.body_care = true;
        }
    }catch(err){
        console.log("There was an error while scraping body_care");
        logError(err);
    }

    if(!state.brisbane.brandy)
    try{
        brandyData = await brandy(start,end,browser);
        console.log(`${brandyData?.length} data items scraped for brandy`);

    }catch(err){
        console.log("There was an error while scraping brandy");
        logError(err);
    }

    if(!state.brisbane.brandy&&brandyData?.length==0)
    try{
        brandyData = await brandy(start,end,browser);
        console.log(`${brandyData?.length} data items scraped for brandy`);

        if(brandyData?.length==0){
            state.brisbane.brandy = true;
        }
    }catch(err){
        console.log("There was an error while scraping brandy");
        logError(err);
    }

    if(!state.brisbane.champagne)
    try{
        champagneData = await champagne(start,end,browser);
        console.log(`${champagneData?.length} data items scraped for champagne`);

    }catch(err){
        console.log("There was an error while scraping champagne");
        logError(err);
    }

    if(!state.brisbane.champagne&&champagneData?.length==0)
    try{
        champagneData = await champagne(start,end,browser);
        console.log(`${champagneData?.length} data items scraped for champagne`);

        if(champagneData?.length==0){
            state.brisbane.champagne = true;
        }
    }catch(err){
        console.log("There was an error while scraping champagne");
        logError(err);
    }

    if(!state.brisbane.cleansers_and_toners)
    try{
        cleansers_and_tonersData = await cleansers_and_toners(start,end,browser);
        console.log(`${cleansers_and_tonersData?.length} data items scraped for cleansers_and_toners`);

    }catch(err){
        console.log("There was an error while scraping cleansers_and_toners");
        logError(err);
    }

    if(!state.brisbane.cleansers_and_toners&&cleansers_and_tonersData?.length==0)
    try{
        cleansers_and_tonersData = await cleansers_and_toners(start,end,browser);
        console.log(`${cleansers_and_tonersData?.length} data items scraped for cleansers_and_toners`);

        if(cleansers_and_tonersData?.length==0){
            state.brisbane.cleansers_and_toners = true;
        }
    }catch(err){
        console.log("There was an error while scraping cleansers_and_toners");
        logError(err);
    }

    if(!state.brisbane.cognac)
    try{
        cognacData = await cognac(start,end,browser);
        console.log(`${cognacData?.length} data items scraped for cognac`);

    }catch(err){
        console.log("There was an error while scraping cognac");
        logError(err);
    }

    if(!state.brisbane.cognac&&cognacData?.length==0)
    try{
        cognacData = await cognac(start,end,browser);
        console.log(`${cognacData?.length} data items scraped for cognac`);

        if(cognacData?.length==0){
            state.brisbane.cognac = true;
        }
    }catch(err){
        console.log("There was an error while scraping cognac");
        logError(err);
    }

    if(!state.brisbane.devices)
    try{
        devicesData = await devices(start,end,browser);
        console.log(`${devicesData?.length} data items scraped for devices`);

    }catch(err){
        console.log("There was an error while scraping devices");
        logError(err);
    }

    if(!state.brisbane.devices&&devicesData?.length==0)
    try{
        devicesData = await devices(start,end,browser);
        console.log(`${devicesData?.length} data items scraped for devices`);

        if(devicesData?.length==0){
            state.brisbane.devices = true;
        }
    }catch(err){
        console.log("There was an error while scraping devices");
        logError(err);
    }

    if(!state.brisbane.eau_de_cologne)
    try{
        eau_de_cologneData = await eau_de_cologne(start,end,browser);
        console.log(`${eau_de_cologneData?.length} data items scraped for eau_de_cologne`);

    }catch(err){
        console.log("There was an error while scraping eau_de_cologne");
        logError(err);
    }

    if(!state.brisbane.eau_de_cologne&&eau_de_cologneData?.length==0)
    try{
        eau_de_cologneData = await eau_de_cologne(start,end,browser);
        console.log(`${eau_de_cologneData?.length} data items scraped for eau_de_cologne`);

        if(eau_de_cologneData?.length==0){
            state.brisbane.eau_de_cologne = true;
        }
    }catch(err){
        console.log("There was an error while scraping eau_de_cologne");
        logError(err);
    }

    if(!state.brisbane.eau_de_parfum)
    try{
        eau_de_parfumData = await eau_de_parfum(start,end,browser);
        console.log(`${eau_de_parfumData?.length} data items scraped for eau_de_parfum`);

    }catch(err){
        console.log("There was an error while scraping eau_de_parfum");
        logError(err);
    }

    if(!state.brisbane.eau_de_parfum&&eau_de_parfumData?.length==0)
    try{
        eau_de_parfumData = await eau_de_parfum(start,end,browser);
        console.log(`${eau_de_parfumData?.length} data items scraped for eau_de_parfum`);

        if(eau_de_parfumData?.length==0){
            state.brisbane.eau_de_parfum = true;
        }
    }catch(err){
        console.log("There was an error while scraping eau_de_parfum");
        logError(err);
    }

    if(!state.brisbane.eau_de_toilette)
    try{
        eau_de_toiletteData = await eau_de_toilette(start,end,browser);
        console.log(`${eau_de_toiletteData?.length} data items scraped for eau_de_toilette`);

    }catch(err){
        console.log("There was an error while scraping eau_de_toilette");
        logError(err);
    }

    if(!state.brisbane.eau_de_toilette&&eau_de_toiletteData?.length==0)
    try{
        eau_de_toiletteData = await eau_de_toilette(start,end,browser);
        console.log(`${eau_de_toiletteData?.length} data items scraped for eau_de_toilette`);

        if(eau_de_toiletteData?.length==0){
            state.brisbane.eau_de_toilette = true;
        }
    }catch(err){
        console.log("There was an error while scraping eau_de_toilette");
        logError(err);
    }

    if(!state.brisbane.eyes)
    try{
        eyesData = await eyes(start,end,browser);
        console.log(`${eyesData?.length} data items scraped for eyes`);

    }catch(err){
        console.log("There was an error while scraping eyes");
        logError(err);
    }

    if(!state.brisbane.eyes&&eyesData?.length==0)
    try{
        eyesData = await eyes(start,end,browser);
        console.log(`${eyesData?.length} data items scraped for eyes`);

        if(eyesData?.length==0){
            state.brisbane.eyes = true;
        }
    }catch(err){
        console.log("There was an error while scraping eyes");
        logError(err);
    }

    if(!state.brisbane.face)
    try{
        faceData = await face(start,end,browser);
        console.log(`${faceData?.length} data items scraped for face`);

    }catch(err){
        console.log("There was an error while scraping face");
        logError(err);
    }

    if(!state.brisbane.face&&faceData?.length==0)
    try{
        faceData = await face(start,end,browser);
        console.log(`${faceData?.length} data items scraped for face`);

        if(faceData?.length==0){
            state.brisbane.face = true;
        }
    }catch(err){
        console.log("There was an error while scraping face");
        logError(err);
    }

    if(!state.brisbane.gin)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.brisbane.gin&&ginData?.length==0)
    try{
        ginData = await gin(start,end,browser);
        console.log(`${ginData?.length} data items scraped for gin`);

        if(ginData?.length==0){
            state.brisbane.gin = true;
        }
    }catch(err){
        console.log("There was an error while scraping gin");
        logError(err);
    }

    if(!state.brisbane.home_fragrance)
    try{
        home_fragranceData = await home_fragrance(start,end,browser);
        console.log(`${home_fragranceData?.length} data items scraped for home_fragrance`);

    }catch(err){
        console.log("There was an error while scraping home_fragrance");
        logError(err);
    }

    if(!state.brisbane.home_fragrance&&home_fragranceData?.length==0)
    try{
        home_fragranceData = await home_fragrance(start,end,browser);
        console.log(`${home_fragranceData?.length} data items scraped for home_fragrance`);

        if(home_fragranceData?.length==0){
            state.brisbane.home_fragrance = true;
        }
    }catch(err){
        console.log("There was an error while scraping home_fragrance");
        logError(err);
    }

    if(!state.brisbane.korean_liquor)
    try{
        korean_liquorData = await korean_liquor(start,end,browser);
        console.log(`${korean_liquorData?.length} data items scraped for korean_liquor`);

    }catch(err){
        console.log("There was an error while scraping korean_liquor");
        logError(err);
    }

    if(!state.brisbane.korean_liquor&&korean_liquorData?.length==0)
    try{
        korean_liquorData = await korean_liquor(start,end,browser);
        console.log(`${korean_liquorData?.length} data items scraped for korean_liquor`);

        if(korean_liquorData?.length==0){
            state.brisbane.korean_liquor = true;
        }
    }catch(err){
        console.log("There was an error while scraping korean_liquor");
        logError(err);
    }

    if(!state.brisbane.lips)
    try{
        lipsData = await lips(start,end,browser);
        console.log(`${lipsData?.length} data items scraped for lips`);

    }catch(err){
        console.log("There was an error while scraping lips");
        logError(err);
    }

    if(!state.brisbane.lips&&lipsData?.length==0)
    try{
        lipsData = await lips(start,end,browser);
        console.log(`${lipsData?.length} data items scraped for lips`);

        if(lipsData?.length==0){
            state.brisbane.lips = true;
        }
    }catch(err){
        console.log("There was an error while scraping lips");
        logError(err);
    }

    if(!state.brisbane.liqueurs)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.brisbane.liqueurs&&liqueursData?.length==0)
    try{
        liqueursData = await liqueurs(start,end,browser);
        console.log(`${liqueursData?.length} data items scraped for liqueurs`);

        if(liqueursData?.length==0){
            state.brisbane.liqueurs = true;
        }
    }catch(err){
        console.log("There was an error while scraping liqueurs");
        logError(err);
    }

    if(!state.brisbane.masks)
    try{
        masksData = await masks(start,end,browser);
        console.log(`${masksData?.length} data items scraped for masks`);

    }catch(err){
        console.log("There was an error while scraping masks");
        logError(err);
    }

    if(!state.brisbane.masks&&masksData?.length==0)
    try{
        masksData = await masks(start,end,browser);
        console.log(`${masksData?.length} data items scraped for masks`);

        if(masksData?.length==0){
            state.brisbane.masks = true;
        }
    }catch(err){
        console.log("There was an error while scraping masks");
        logError(err);
    }

    if(!state.brisbane.moisturisers)
    try{
        moisturisersData = await moisturisers(start,end,browser);
        console.log(`${moisturisersData?.length} data items scraped for moisturisers`);

    }catch(err){
        console.log("There was an error while scraping moisturisers");
        logError(err);
    }

    if(!state.brisbane.moisturisers&&moisturisersData?.length==0)
    try{
        moisturisersData = await moisturisers(start,end,browser);
        console.log(`${moisturisersData?.length} data items scraped for moisturisers`);

        if(moisturisersData?.length==0){
            state.brisbane.moisturisers = true;
        }
    }catch(err){
        console.log("There was an error while scraping moisturisers");
        logError(err);
    }

    if(!state.brisbane.port_and_sherry)
    try{
        port_and_sherryData = await port_and_sherry(start,end,browser);
        console.log(`${port_and_sherryData?.length} data items scraped for port_and_sherry`);

    }catch(err){
        console.log("There was an error while scraping port_and_sherry");
        logError(err);
    }

    if(!state.brisbane.port_and_sherry&&port_and_sherryData?.length==0)
    try{
        port_and_sherryData = await port_and_sherry(start,end,browser);
        console.log(`${port_and_sherryData?.length} data items scraped for port_and_sherry`);

        if(port_and_sherryData?.length==0){
            state.brisbane.port_and_sherry = true;
        }
    }catch(err){
        console.log("There was an error while scraping port_and_sherry");
        logError(err);
    }

    if(!state.brisbane.red_wine)
    try{
        red_wineData = await red_wine(start,end,browser);
        console.log(`${red_wineData?.length} data items scraped for red_wine`);

    }catch(err){
        console.log("There was an error while scraping red_wine");
        logError(err);
    }

    if(!state.brisbane.red_wine&&red_wineData?.length==0)
    try{
        red_wineData = await red_wine(start,end,browser);
        console.log(`${red_wineData?.length} data items scraped for red_wine`);

        if(red_wineData?.length==0){
            state.brisbane.red_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping red_wine");
        logError(err);
    }

    if(!state.brisbane.rum)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.brisbane.rum&&rumData?.length==0)
    try{
        rumData = await rum(start,end,browser);
        console.log(`${rumData?.length} data items scraped for rum`);

        if(rumData?.length==0){
            state.brisbane.rum = true;
        }
    }catch(err){
        console.log("There was an error while scraping rum");
        logError(err);
    }

    if(!state.brisbane.serums_essences)
    try{
        serums_essencesData = await serums_essences(start,end,browser);
        console.log(`${serums_essencesData?.length} data items scraped for serums_essences`);

    }catch(err){
        console.log("There was an error while scraping serums_essences");
        logError(err);
    }

    if(!state.brisbane.serums_essences&&serums_essencesData?.length==0)
    try{
        serums_essencesData = await serums_essences(start,end,browser);
        console.log(`${serums_essencesData?.length} data items scraped for serums_essences`);

        if(serums_essencesData?.length==0){
            state.brisbane.serums_essences = true;
        }
    }catch(err){
        console.log("There was an error while scraping serums_essences");
        logError(err);
    }

    if(!state.brisbane.single_malt)
    try{
        single_maltData = await single_malt(start,end,browser);
        console.log(`${single_maltData?.length} data items scraped for single_malt`);

    }catch(err){
        console.log("There was an error while scraping single_malt");
        logError(err);
    }

    if(!state.brisbane.single_malt&&single_maltData?.length==0)
    try{
        single_maltData = await single_malt(start,end,browser);
        console.log(`${single_maltData?.length} data items scraped for single_malt`);

        if(single_maltData?.length==0){
            state.brisbane.single_malt = true;
        }
    }catch(err){
        console.log("There was an error while scraping single_malt");
        logError(err);
    }

    if(!state.brisbane.sparkling_wine)
    try{
        sparkling_wineData = await sparkling_wine(start,end,browser);
        console.log(`${sparkling_wineData?.length} data items scraped for sparkling_wine`);

    }catch(err){
        console.log("There was an error while scraping sparkling_wine");
        logError(err);
    }

    if(!state.brisbane.sparkling_wine&&sparkling_wineData?.length==0)
    try{
        sparkling_wineData = await sparkling_wine(start,end,browser);
        console.log(`${sparkling_wineData?.length} data items scraped for sparkling_wine`);

        if(sparkling_wineData?.length==0){
            state.brisbane.sparkling_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping sparkling_wine");
        logError(err);
    }

    if(!state.brisbane.sun_care)
    try{
        sun_careData = await sun_care(start,end,browser);
        console.log(`${sun_careData?.length} data items scraped for sun_care`);

    }catch(err){
        console.log("There was an error while scraping sun_care");
        logError(err);
    }

    if(!state.brisbane.sun_care&&sun_careData?.length==0)
    try{
        sun_careData = await sun_care(start,end,browser);
        console.log(`${sun_careData?.length} data items scraped for sun_care`);

        if(sun_careData?.length==0){
            state.brisbane.sun_care = true;
        }
    }catch(err){
        console.log("There was an error while scraping sun_care");
        logError(err);
    }

    if(!state.brisbane.tequila)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.brisbane.tequila&&tequilaData?.length==0)
    try{
        tequilaData = await tequila(start,end,browser);
        console.log(`${tequilaData?.length} data items scraped for tequila`);

        if(tequilaData?.length==0){
            state.brisbane.tequila = true;
        }
    }catch(err){
        console.log("There was an error while scraping tequila");
        logError(err);
    }

    if(!state.brisbane.treatments)
    try{
        treatmentsData = await treatments(start,end,browser);
        console.log(`${treatmentsData?.length} data items scraped for treatments`);

    }catch(err){
        console.log("There was an error while scraping treatments");
        logError(err);
    }

    if(!state.brisbane.treatments&&treatmentsData?.length==0)
    try{
        treatmentsData = await treatments(start,end,browser);
        console.log(`${treatmentsData?.length} data items scraped for treatments`);

        if(treatmentsData?.length==0){
            state.brisbane.treatments = true;
        }
    }catch(err){
        console.log("There was an error while scraping treatments");
        logError(err);
    }

    if(!state.brisbane.vodka)
    try{
        vodkaData = await vodka(start,end,browser);
        console.log(`${vodkaData?.length} data items scraped for vodka`);

    }catch(err){
        console.log("There was an error while scraping vodka");
        logError(err);
    }

    if(!state.brisbane.vodka&&vodkaData?.length==0)
    try{
        vodkaData = await vodka(start,end,browser);
        console.log(`${vodkaData?.length} data items scraped for vodka`);

        if(vodkaData?.length==0){
            state.brisbane.vodka = true;
        }
    }catch(err){
        console.log("There was an error while scraping vodka");
        logError(err);
    }

    if(!state.brisbane.whiskey)
    try{
        whiskeyData = await whiskey(start,end,browser);
        console.log(`${whiskeyData?.length} data items scraped for whiskey`);

    }catch(err){
        console.log("There was an error while scraping whiskey");
        logError(err);
    }

    if(!state.brisbane.whiskey&&whiskeyData?.length==0)
    try{
        whiskeyData = await whiskey(start,end,browser);
        console.log(`${whiskeyData?.length} data items scraped for whiskey`);

        if(whiskeyData?.length==0){
            state.brisbane.whiskey = true;
        }
    }catch(err){
        console.log("There was an error while scraping whiskey");
        logError(err);
    }

    if(!state.brisbane.white_wine)
    try{
        white_wineData = await white_wine(start,end,browser);
        console.log(`${white_wineData?.length} data items scraped for white_wine`);

    }catch(err){
        console.log("There was an error while scraping white_wine");
        logError(err);
    }

    if(!state.brisbane.white_wine&&white_wineData?.length==0)
    try{
        white_wineData = await white_wine(start,end,browser);
        console.log(`${white_wineData?.length} data items scraped for white_wine`);

        if(white_wineData?.length==0){
            state.brisbane.white_wine = true;
        }
    }catch(err){
        console.log("There was an error while scraping white_wine");
        logError(err);
    }

    if(!state.brisbane.wine_champagne_beer)
    try{
        wine_champagne_beerData = await wine_champagne_beer(start,end,browser);
        console.log(`${wine_champagne_beerData?.length} data items scraped for wine_champagne_beer`);

    }catch(err){
        console.log("There was an error while scraping wine_champagne_beer");
        logError(err);
    }

    if(!state.brisbane.wine_champagne_beer&&wine_champagne_beerData?.length==0)
    try{
        wine_champagne_beerData = await wine_champagne_beer(start,end,browser);
        console.log(`${wine_champagne_beerData?.length} data items scraped for wine_champagne_beer`);

        if(wine_champagne_beerData?.length==0){
            state.brisbane.wine_champagne_beer = true;
        }
    }catch(err){
        console.log("There was an error while scraping wine_champagne_beer");
        logError(err);
    }

    //scrape each category
    // if(!state.brisbane.spirits)
    // try{
    //     spiritsData = await spirits(start,end,browser);
    //     console.log(`${spiritsData?.length} data items scraped for spirits`);

    // }catch(err){
    //     console.log("There was an error while scraping spirits");
    //     logError(err);
    // }

    // if(!state.brisbane.spirits&&spiritsData?.length==0)
    // try{
    //     spiritsData = await spirits(start,end,browser);
    //     console.log(`${spiritsData?.length} data items scraped for spirits`);

    //     if(spiritsData?.length==0){
    //         state.brisbane.spirits = true;
    //     }
    // }catch(err){
    //     console.log("There was an error while scraping spirits");
    //     logError(err);
    // }

    // if(!state.brisbane.beauty)
    // try{
    //     beautyData = await beauty(start,end,browser);
    //     console.log(`${beautyData?.length} data items scraped for beauty`);

    // }catch(err){
    //     console.log("There was an error while scraping beauty");
    //     logError(err);
    // }

    // if(!state.brisbane.beauty&&beautyData?.length==0)
    // try{
    //     beautyData = await beauty(start,end,browser);
    //     console.log(`${beautyData?.length} data items scraped for beauty`);

    //     if(beautyData?.length==0){
    //         state.brisbane.beauty = true;
    //     }
    // }catch(err){
    //     console.log("There was an error while scraping beauty");
    //     logError(err);
    // }

    baijiuData = [...baijiuData,...bath_showerData,...body_careData,...brandyData,...champagneData,...cleansers_and_tonersData,...cognacData,...devicesData,...eau_de_cologneData,...eau_de_parfumData,...eau_de_toiletteData,...eyesData,...faceData,...ginData,...home_fragranceData,...korean_liquorData,...lipsData,...liqueursData,...masksData,...moisturisersData,...port_and_sherryData,...red_wineData,...rumData,...serums_essencesData,...sets_packData,...single_maltData,...sparkling_wineData,...sun_careData,...tequilaData,...treatmentsData,...vodkaData,...whiskeyData,...white_wineData,...wine_champagne_beerData];
    
    try{
        baijiuData = await processDataForSpirits(baijiuData);
        console.log(`spirits data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing spirits data");
        logError(err);
    }

    //process data
    // try{
    //     spiritsData = await processDataForSpirits(spiritsData);
    //     console.log(`spirits data items proccessed`);
    // }catch(err){
    //     console.log("There was an error while proccessing spirits data");
    //     logError(err);
    // }

    // try{
    //     beautyData = await processDataForBeauty(beautyData);
    //     console.log(`beauty data items proccessed`);
    // }catch(err){
    //     console.log("There was an error while proccessing beauty data");
    //     logError(err);
    // }

    //merge data
    // spiritsData = [...spiritsData,...beautyData];

    //update db
    try{
        await updateDBEntry(baijiuData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for lotte brisbane");
    return baijiuData?.length==0;
}

module.exports = scrapeLotteBrisbane;