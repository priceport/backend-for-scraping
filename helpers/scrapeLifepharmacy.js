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


const processDataForSpirits = require("./data_processing/lifepharmacy/spirits");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/lifepharmacy/spirits");


const scrapeLifepharmacy = async (start,end,state,browser) =>{
    console.log("scraping started for life pharmacy at:"+Date.now());

    //variable initialization
    let medicinesData = [],skincareTreatmentsData = [],familyPlanningData = [],firstAidData = [],hairCareData = [],skinCareData = [],homeHealthDevicesData = [],menFragranceData = [],womensFragranceData = [],homeFragranceData = [];
    

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

    let allData = [...medicinesData,...skincareTreatmentsData,...familyPlanningData,...firstAidData,...hairCareData,...skinCareData,...homeHealthDevicesData,...menFragranceData,...womensFragranceData,...homeFragranceData];


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