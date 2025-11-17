//processing script imports
const medicines = require("../scripts/scraping_scripts/domestic/lifepharmacy/medicines");
const processDataForSpirits = require("./data_processing/lifepharmacy/spirits");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/lifepharmacy/spirits");


const scrapeLifepharmacy = async (start,end,state,browser) =>{
    console.log("scraping started for life pharmacy at:"+Date.now());

    //variable initialization
    let medicinesData = [];
    

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

    let allData = [...medicinesData];


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