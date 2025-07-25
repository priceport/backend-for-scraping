const   redWine  = require("../scripts/scraping_scripts/domestic/dan_murphy/red_wine");
const whiteWine = require("../scripts/scraping_scripts/domestic/dan_murphy/white_wine");
const champagneSparkling = require("../scripts/scraping_scripts/domestic/dan_murphy/champagne_sparkling");
const fortifiedWine = require("../scripts/scraping_scripts/domestic/dan_murphy/fortified_wine");
const spirits = require("../scripts/scraping_scripts/domestic/dan_murphy/spirits");
const whisky = require("../scripts/scraping_scripts/domestic/dan_murphy/whisky");
const bourbon = require("../scripts/scraping_scripts/domestic/dan_murphy/bourbon");
const vodka = require("../scripts/scraping_scripts/domestic/dan_murphy/vodka");
const gin = require("../scripts/scraping_scripts/domestic/dan_murphy/gin");
const rum = require("../scripts/scraping_scripts/domestic/dan_murphy/rum");
const liqueurs = require("../scripts/scraping_scripts/domestic/dan_murphy/liqueurs");
const tequila = require("../scripts/scraping_scripts/domestic/dan_murphy/tequila");
const aperitifs = require("../scripts/scraping_scripts/domestic/dan_murphy/aperitifs");
const brandyCognac = require("../scripts/scraping_scripts/domestic/dan_murphy/brandy_cognac");
const sake = require("../scripts/scraping_scripts/domestic/dan_murphy/sake");
const baijiu = require("../scripts/scraping_scripts/domestic/dan_murphy/baijiu");
const sojuShochu = require("../scripts/scraping_scripts/domestic/dan_murphy/soju_shochu");
const beer = require("../scripts/scraping_scripts/domestic/dan_murphy/beer");
const cider = require("../scripts/scraping_scripts/domestic/dan_murphy/cider");
const premixDrinks = require("../scripts/scraping_scripts/domestic/dan_murphy/premix_drinks");
const logError = require("./logError");
const processDataForSpirits = require("./data_processing/dan_murphy/spirits");
const updateDBEntry = require("./update_db_entry/dan_murphy/spirits");

const scrapeDanMurphy = async (start_page) =>{
    console.log("scraping started for dan murphy at:"+Date.now());

    //variable initialization
    let redWineData = [], whiteWineData = [], champagneSparklingData = [], fortifiedWineData = [], whiskyData = [], bourbonData = [], vodkaData = [], ginData = [], rumData = [], liqueursData = [], tequilaData = [], aperitifsData = [], brandyCognacData = [], sakeData = [], baijiuData = [], sojuShochuData = [], beerData = [], ciderData = [], premixDrinksData = [];

    if(start_page==1)
    try{
        redWineData = await redWine();
        console.log(`${redWineData?.length} data items scraped for red wine`);
    }catch(err){
        console.log("There was an error while scraping red wine");
        logError(err);
    }

    // if(start_page==2)
    // try{
    //     whiteWineData = await whiteWine();
    //     console.log(`${whiteWineData?.length} data items scraped for white wine`);
    // }catch(err){
    //     console.log("There was an error while scraping white wine");
    //     logError(err);
    // }

    // if(start_page==3)
    // try{
    //     champagneSparklingData = await champagneSparkling();
    //     console.log(`${champagneSparklingData?.length} data items scraped for champagne sparkling`);
    // }catch(err){
    //     console.log("There was an error while scraping champagne sparkling");
    //     logError(err);
    // }

    // if(start_page==4)
    // try{
    //     fortifiedWineData = await fortifiedWine();
    //     console.log(`${fortifiedWineData?.length} data items scraped for fortified wine`);
    // }catch(err){
    //     console.log("There was an error while scraping fortified wine");
    //     logError(err);
    // }

    // if(start_page==5)
    // try{
    //     whiskyData = await whisky();
    //     console.log(`${whiskyData?.length} data items scraped for whisky`);
    // }catch(err){
    //     console.log("There was an error while scraping whisky");
    //     logError(err);
    // }

    // if(start_page==6)
    // try{
    //     bourbonData = await bourbon();
    //     console.log(`${bourbonData?.length} data items scraped for bourbon`);
    // }catch(err){
    //     console.log("There was an error while scraping bourbon");
    //     logError(err);
    // }

    // if(start_page==7)
    // try{
    //     vodkaData = await vodka();
    //     console.log(`${vodkaData?.length} data items scraped for vodka`);
    // }catch(err){
    //     console.log("There was an error while scraping vodka");
    //     logError(err);
    // }

    // if(start_page==8)
    // try{
    //     ginData = await gin();
    //     console.log(`${ginData?.length} data items scraped for gin`);
    // }catch(err){
    //     console.log("There was an error while scraping gin");
    //     logError(err);
    // }

    // if(start_page==9)
    // try{
    //     rumData = await rum();
    //     console.log(`${rumData?.length} data items scraped for rum`);
    // }catch(err){
    //     console.log("There was an error while scraping rum");
    //     logError(err);
    // }

    // if(start_page==10)
    // try{
    //     liqueursData = await liqueurs();
    //     console.log(`${liqueursData?.length} data items scraped for liqueurs`);
    // }catch(err){
    //     console.log("There was an error while scraping liqueurs");
    //     logError(err);
    // }

    // if(start_page==11)
    // try{
    //     tequilaData = await tequila();
    //     console.log(`${tequilaData?.length} data items scraped for tequila`);
    // }catch(err){
    //     console.log("There was an error while scraping tequila");
    //     logError(err);
    // }

    // if(start_page==12)
    // try{
    //     aperitifsData = await aperitifs();
    //     console.log(`${aperitifsData?.length} data items scraped for aperitifs`);
    // }catch(err){
    //     console.log("There was an error while scraping aperitifs");
    //     logError(err);
    // }

    // if(start_page==13)
    // try{
    //     brandyCognacData = await brandyCognac();
    //     console.log(`${brandyCognacData?.length} data items scraped for brandy cognac`);
    // }catch(err){
    //     console.log("There was an error while scraping brandy cognac");
    //     logError(err);
    // }

    // if(start_page==14)
    // try{
    //     sakeData = await sake();
    //     console.log(`${sakeData?.length} data items scraped for sake`);
    // }catch(err){
    //     console.log("There was an error while scraping sake");
    //     logError(err);
    // }

    // if(start_page==15)
    // try{
    //     baijiuData = await baijiu();
    //     console.log(`${baijiuData?.length} data items scraped for baijiu`);
    // }catch(err){
    //     console.log("There was an error while scraping baijiu");
    //     logError(err);
    // }

    // if(start_page==16)
    // try{
    //     sojuShochuData = await sojuShochu();
    //     console.log(`${sojuShochuData?.length} data items scraped for soju shochu`);
    // }catch(err){
    //     console.log("There was an error while scraping soju shochu");
    //     logError(err);
    // }

    // if(start_page==17)
    // try{
    //     beerData = await beer();
    //     console.log(`${beerData?.length} data items scraped for beer`);
    // }catch(err){
    //     console.log("There was an error while scraping beer");
    //     logError(err);
    // }

    // if(start_page==18)
    // try{
    //     ciderData = await cider();
    //     console.log(`${ciderData?.length} data items scraped for cider`);
    // }catch(err){
    //     console.log("There was an error while scraping cider");
    //     logError(err);
    // }

    // if(start_page==19)
    // try{
    //     premixDrinksData = await premixDrinks();
    //     console.log(`${premixDrinksData?.length} data items scraped for premix drinks`);
    // }catch(err){
    //     console.log("There was an error while scraping premix drinks");
    //     logError(err);
    // }

    let allData = [...redWineData,...whiteWineData,...champagneSparklingData,...fortifiedWineData,...whiskyData,...bourbonData,...vodkaData,...ginData,...rumData,...liqueursData,...tequilaData,...aperitifsData,...brandyCognacData,...sakeData,...baijiuData,...sojuShochuData,...beerData,...ciderData,...premixDrinksData];

    //process data
    try{
        allData = await processDataForSpirits(allData);
        console.log(allData);
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
    
    console.log("entries updated for dan murphy");
    return allData?.length==0;
}

module.exports = scrapeDanMurphy;