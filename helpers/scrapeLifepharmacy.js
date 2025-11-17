//processing script imports
const family_planning = require("../scripts/scraping_scripts/duty_free/lifepharmacy/family_planning");
const first_aid = require("../scripts/scraping_scripts/duty_free/lifepharmacy/first_aid");
const hair_care = require("../scripts/scraping_scripts/duty_free/lifepharmacy/hair_care");
const home_health_devices = require("../scripts/scraping_scripts/duty_free/lifepharmacy/home_health_devices");
const medicines = require("../scripts/scraping_scripts/duty_free/lifepharmacy/medicines");
const skincare_treatments = require("../scripts/scraping_scripts/duty_free/lifepharmacy/skincare_treatments");
const men_fragrance = require("../scripts/scraping_scripts/duty_free/lifepharmacy/men_fragrance");
const womens_fragrance = require("../scripts/scraping_scripts/duty_free/lifepharmacy/womens_fragrance");
const home_fragrance = require("../scripts/scraping_scripts/duty_free/lifepharmacy/home_fragrance");
const face = require("../scripts/scraping_scripts/duty_free/lifepharmacy/face");
const eyes = require("../scripts/scraping_scripts/duty_free/lifepharmacy/eyes");
const lips = require("../scripts/scraping_scripts/duty_free/lifepharmacy/lips");
const nails = require("../scripts/scraping_scripts/duty_free/lifepharmacy/nails");
const make_up_sets = require("../scripts/scraping_scripts/duty_free/lifepharmacy/make_up_sets");
const make_up_accessories = require("../scripts/scraping_scripts/duty_free/lifepharmacy/make_up_accessories");


const processDataForSpirits = require("./data_processing/lifepharmacy/spirits");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/lifepharmacy/spirits");


const scrapeLifepharmacy = async (start,end,state,browser) =>{
    console.log("scraping started for life pharmacy at:"+Date.now());

    //variable initialization
    let medicinesData = [],skincareTreatmentsData = [],familyPlanningData = [],firstAidData = [],hairCareData = [],skinCareData = [],homeHealthDevicesData = [],menFragranceData = [],womensFragranceData = [],homeFragranceData = [],faceData = [],eyesData = [],lipsData = [],nailsData = [],makeUpSetsData = [],makeUpAccessoriesData = [];
    

    if(!state.lifepharmacy.medicines)
    try{
        medicinesData = await medicines(start,end,browser);
        console.log(`${medicinesData?.length} data items scraped for medicines`);
    }catch(err){
        console.log("There was an error while scraping medicines");
        logError(err);
    }

    if(!state.lifepharmacy.medicines&&medicinesData?.length==0)
    try{
        medicinesData = await medicines(start,end,browser);
        console.log(`${medicinesData?.length} data items scraped for medicines`);
        if(medicinesData?.length==0){
            state.lifepharmacy.medicines = true;
        }
    }catch(err){
        console.log("There was an error while scraping medicines");
        logError(err);
    }

    if(!state.lifepharmacy.skincare_treatments)
    try{
        skincareTreatmentsData = await skincare_treatments(start,end,browser);
        console.log(`${skincareTreatmentsData?.length} data items scraped for skincare treatments`);
    }catch(err){
        console.log("There was an error while scraping skincare treatments");
        logError(err);
    }

    if (!state.lifepharmacy.skincare_treatments&&skincareTreatmentsData?.length==0)
    try{
        skincareTreatmentsData = await skincare_treatments(start,end,browser);
        console.log(`${skincareTreatmentsData?.length} data items scraped for skincare treatments`);
        if(skincareTreatmentsData?.length==0){
            state.lifepharmacy.skincare_treatments = true;
        }
    }catch(err){
        console.log("There was an error while scraping skincare treatments");
        logError(err);
    }

    if(!state.lifepharmacy.family_planning)
    try{
        familyPlanningData = await family_planning(start,end,browser);
        console.log(`${familyPlanningData?.length} data items scraped for family planning`);
    }catch(err){
        console.log("There was an error while scraping family planning");
        logError(err);
    }

    if(!state.lifepharmacy.family_planning&&familyPlanningData?.length==0)
    try{
        familyPlanningData = await family_planning(start,end,browser);
        console.log(`${familyPlanningData?.length} data items scraped for family planning`);
        if(familyPlanningData?.length==0){
            state.lifepharmacy.family_planning = true;
        }
    }catch(err){
        console.log("There was an error while scraping family planning");
        logError(err);
    }

    if(!state.lifepharmacy.first_aid)
    try{
        firstAidData = await first_aid(start,end,browser);
        console.log(`${firstAidData?.length} data items scraped for first aid`);
    }catch(err){
        console.log("There was an error while scraping first aid");
        logError(err);
    }

    if(!state.lifepharmacy.first_aid&&firstAidData?.length==0)
    try{
        firstAidData = await first_aid(start,end,browser);
        console.log(`${firstAidData?.length} data items scraped for first aid`);
        if(firstAidData?.length==0){
            state.lifepharmacy.first_aid = true;
        }
    }catch(err){
        console.log("There was an error while scraping first aid");
        logError(err);
    }

    if(!state.lifepharmacy.hair_care)
    try{
        hairCareData = await hair_care(start,end,browser);
        console.log(`${hairCareData?.length} data items scraped for hair care`);
    }catch(err){
        console.log("There was an error while scraping hair care");
        logError(err);
    }

    if(!state.lifepharmacy.hair_care&&hairCareData?.length==0)
    try{
        hairCareData = await hair_care(start,end,browser);
        console.log(`${hairCareData?.length} data items scraped for hair care`);
        if(hairCareData?.length==0){
            state.lifepharmacy.hair_care = true;
        }
    }catch(err){
        console.log("There was an error while scraping hair care");
        logError(err);
    }

    if (!state.lifepharmacy.home_health_devices)
    try{
        homeHealthDevicesData = await home_health_devices(start,end,browser);
        console.log(`${homeHealthDevicesData?.length} data items scraped for home health devices`);
    }catch(err){
        console.log("There was an error while scraping home health devices");
        logError(err);
    }

    if (!state.lifepharmacy.home_health_devices&&homeHealthDevicesData?.length==0)
    try{
        homeHealthDevicesData = await home_health_devices(start,end,browser);
        console.log(`${homeHealthDevicesData?.length} data items scraped for home health devices`);
        if(homeHealthDevicesData?.length==0){
            state.lifepharmacy.home_health_devices = true;
        }
    }catch(err){
        console.log("There was an error while scraping home health devices");
        logError(err);
    }

    if(!state.lifepharmacy.mens_fragrance)
    try{
        menFragranceData = await men_fragrance(start,end,browser);
        console.log(`${menFragranceData?.length} data items scraped for mens fragrance`);
    }catch(err){
        console.log("There was an error while scraping mens fragrance");
        logError(err);
    }

    if(!state.lifepharmacy.mens_fragrance&&menFragranceData?.length==0)
    try{
        menFragranceData = await men_fragrance(start,end,browser);
        console.log(`${menFragranceData?.length} data items scraped for mens fragrance`);
        if(menFragranceData?.length==0){
            state.lifepharmacy.mens_fragrance = true;
        }
    }catch(err){
        console.log("There was an error while scraping mens fragrance");
        logError(err);
    }

    if(!state.lifepharmacy.womens_fragrance)
    try{
        womensFragranceData = await womens_fragrance(start,end,browser);
        console.log(`${womensFragranceData?.length} data items scraped for womens fragrance`);
    }catch(err){
        console.log("There was an error while scraping womens fragrance");
        logError(err);
    }

    if(!state.lifepharmacy.womens_fragrance&&womensFragranceData?.length==0)
    try{
        womensFragranceData = await womens_fragrance(start,end,browser);
        console.log(`${womensFragranceData?.length} data items scraped for womens fragrance`);
        if(womensFragranceData?.length==0){
            state.lifepharmacy.womens_fragrance = true;
        }
    }catch(err){
        console.log("There was an error while scraping womens fragrance");
        logError(err);
    }

    if(!state.lifepharmacy.home_fragrance)
    try{
        homeFragranceData = await home_fragrance(start,end,browser);
        console.log(`${homeFragranceData?.length} data items scraped for home fragrance`);
    }catch(err){
        console.log("There was an error while scraping home fragrance");
        logError(err);
    }

    if(!state.lifepharmacy.home_fragrance&&homeFragranceData?.length==0)
    try{
        homeFragranceData = await home_fragrance(start,end,browser);
        console.log(`${homeFragranceData?.length} data items scraped for home fragrance`);
        if(homeFragranceData?.length==0){
            state.lifepharmacy.home_fragrance = true;
        }
    }catch(err){
        console.log("There was an error while scraping home fragrance");
        logError(err);
    }

    if(!state.lifepharmacy.face)
    try{
        faceData = await face(start,end,browser);
        console.log(`${faceData?.length} data items scraped for face`);
    }catch(err){
        console.log("There was an error while scraping face");
        logError(err);
    }

    if(!state.lifepharmacy.face&&faceData?.length==0)
    try{
        faceData = await face(start,end,browser);
        console.log(`${faceData?.length} data items scraped for face`);
        if(faceData?.length==0){
            state.lifepharmacy.face = true;
        }
    }catch(err){
        console.log("There was an error while scraping face");
        logError(err);
    }

    if(!state.lifepharmacy.eyes)
    try{
        eyesData = await eyes(start,end,browser);
        console.log(`${eyesData?.length} data items scraped for eyes`);
    }catch(err){
        console.log("There was an error while scraping eyes");
        logError(err);
    }

    if(!state.lifepharmacy.eyes&&eyesData?.length==0)
    try{
        eyesData = await eyes(start,end,browser);
        console.log(`${eyesData?.length} data items scraped for eyes`);
        if(eyesData?.length==0){
            state.lifepharmacy.eyes = true;
        }
    }catch(err){
        console.log("There was an error while scraping eyes");
        logError(err);
    }

    if(!state.lifepharmacy.lips)
    try{
        lipsData = await lips(start,end,browser);
        console.log(`${lipsData?.length} data items scraped for lips`);
    }catch(err){
        console.log("There was an error while scraping lips");
        logError(err);
    }

    if(!state.lifepharmacy.lips&&lipsData?.length==0)
    try{
        lipsData = await lips(start,end,browser);
        console.log(`${lipsData?.length} data items scraped for lips`);
        if(lipsData?.length==0){
            state.lifepharmacy.lips = true;
        }
    }catch(err){
        console.log("There was an error while scraping lips");
        logError(err);
    }

    if(!state.lifepharmacy.nails)
    try{
        nailsData = await nails(start,end,browser);
        console.log(`${nailsData?.length} data items scraped for nails`);
    }catch(err){
        console.log("There was an error while scraping nails");
        logError(err);
    }

    if(!state.lifepharmacy.nails&&nailsData?.length==0)
    try{
        nailsData = await nails(start,end,browser);
        console.log(`${nailsData?.length} data items scraped for nails`);
        if(nailsData?.length==0){
            state.lifepharmacy.nails = true;
        }
    }catch(err){
        console.log("There was an error while scraping nails");
        logError(err);
    }

    if(!state.lifepharmacy.make_up_sets)
    try{
        makeUpSetsData = await make_up_sets(start,end,browser);
        console.log(`${makeUpSetsData?.length} data items scraped for make up sets`);
    }catch(err){
        console.log("There was an error while scraping make up sets");
        logError(err);
    }

    if(!state.lifepharmacy.make_up_sets&&makeUpSetsData?.length==0)
    try{
        makeUpSetsData = await make_up_sets(start,end,browser);
        console.log(`${makeUpSetsData?.length} data items scraped for make up sets`);
        if(makeUpSetsData?.length==0){
            state.lifepharmacy.make_up_sets = true;
        }
    }catch(err){
        console.log("There was an error while scraping make up sets");
        logError(err);
    }

    if(!state.lifepharmacy.make_up_accessories)
    try{
        makeUpAccessoriesData = await make_up_accessories(start,end,browser);
        console.log(`${makeUpAccessoriesData?.length} data items scraped for make up accessories`);
    }catch(err){
        console.log("There was an error while scraping make up accessories");
        logError(err);
    }

    if(!state.lifepharmacy.make_up_accessories&&makeUpAccessoriesData?.length==0)
    try{
        makeUpAccessoriesData = await make_up_accessories(start,end,browser);
        console.log(`${makeUpAccessoriesData?.length} data items scraped for make up accessories`);
        if(makeUpAccessoriesData?.length==0){
            state.lifepharmacy.make_up_accessories = true;
        }
    }catch(err){
        console.log("There was an error while scraping make up accessories");
        logError(err);
    }

    let allData = [...medicinesData,...skincareTreatmentsData,...familyPlanningData,...firstAidData,...hairCareData,...skinCareData,...homeHealthDevicesData,...menFragranceData,...womensFragranceData,...homeFragranceData,...faceData,...eyesData,...lipsData,...nailsData,...makeUpSetsData,...makeUpAccessoriesData];


    // process data
    try{
        allData = await processDataForSpirits(allData);
        console.log(`${allData.length} data items proccessed`);
    }catch(err){
        console.log("There was an error while proccessing data");
        logError(err);
    }

    //update db
    try{
        await updateDBEntry(allData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for life pharmacy");
    return allData?.length==0;
}

module.exports = scrapeLifepharmacy;