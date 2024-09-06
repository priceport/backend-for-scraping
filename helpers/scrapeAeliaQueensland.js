
const spirits = require("../scripts/scraping_scripts/url_checker/Aelia_queensland_url_checker/spirits");
const processDataForSpirits = require("./data_processing/aelia_queensland/spirits");
const updateDBEntry = require("./update_db_entry/aelia_queensland/spirits");




const scrapeAeliaQueensland = async () =>{
    let spiritsData;

    try{
        spiritsData = await spirits();
    }catch(err){
        console.log(err);
    }

    try{
        spiritsData = await processDataForSpirits(spiritsData);
    }catch(err){
        console.log(err);
    }

    try{
        await updateDBEntry(spiritsData);
    }catch(err){
        console.log(err);
    }
    
    console.log("entries updated for aelia auckland");

}

module.exports = scrapeAeliaQueensland;




//testing
        // spiritsData = [
        //     {
        //       title: 'The Cardrona Single Malt Whisky The Falcon Single Malt 700ml',
        //       brand: 'THE CARDRONA SINGLE MALT WHISKY',
        //       price: '$300.00',
        //       promo: 'https://www.aeliadutyfree.co.nz/media/amasty/amlabel/Travel_Exclusive_-_Black_1__1.png',
        //       url: 'https://www.aeliadutyfree.co.nz/auckland/the-cardrona-single-malt-whisky-the-falcon-single-malt-700ml.html',
        //       category: 'liquour',
        //       source: {
        //         webite_base: 'https://www.aeliadutyfree.co.nz/auckland',
        //         location: 'auckland',
        //         tag: 'duty-free'
        //       },
        //       date: 1723032201778,
        //       last_check: 1723032201778,
        //       mapping_ref: null,
        //       subcategory: 'spirits'
        //     },
        //     {
        //       title: 'Balvenie Creation Of A Classic 700ml',
        //       brand: 'BALVENIE',
        //       price: '$139.00',
        //       promo: null,
        //       url: 'https://www.aeliadutyfree.co.nz/auckland/balvenie-creation-of-a-classic-700ml.html',
        //       category: 'liquour',
        //       source: {
        //         webite_base: 'https://www.aeliadutyfree.co.nz/auckland',
        //         location: 'auckland',
        //         tag: 'duty-free'
        //       },
        //       date: 1723032201778,
        //       last_check: 1723032201778,
        //       mapping_ref: null,
        //       subcategory: 'spirits'
        //     },
        //     {
        //       title: 'Aberfeldy 12 Year Old Madeira Whiskey 700ml',
        //       brand: 'ABERFELDY',
        //       price: '$112.00',
        //       promo: 'https://www.aeliadutyfree.co.nz/media/amasty/amlabel/Travel_Exclusive_-_Black_1__1.png',
        //       url: 'https://www.aeliadutyfree.co.nz/auckland/aberfeldy-12-year-old-madeira-whiskey-700ml.html',
        //       category: 'liquour',
        //       source: {
        //         webite_base: 'https://www.aeliadutyfree.co.nz/auckland',
        //         location: 'auckland',
        //         tag: 'duty-free'
        //       },
        //       date: 1723032201778,
        //       last_check: 1723032201778,
        //       mapping_ref: null,
        //       subcategory: 'spirits'
        //     },
        //     {
        //       title: 'Dancing Sands Feijoa Vodka 700ml',
        //       brand: 'DANCING SANDS',
        //       price: '$50.00',
        //       promo: null,
        //       url: 'https://www.aeliadutyfree.co.nz/auckland/dancing-sands-feijoa-vodka-700ml.html',
        //       category: 'liquour',
        //       source: {
        //         webite_base: 'https://www.aeliadutyfree.co.nz/auckland',
        //         location: 'auckland',
        //         tag: 'duty-free'
        //       },
        //       date: 1723032201778,
        //       last_check: 1723032201778,
        //       mapping_ref: null,
        //       subcategory: 'spirits'
        //     },
        //     {
        //       title: 'Broken Shed Premium Vodka 1.75L',
        //       brand: 'BROKEN SHED',
        //       price: '$110.00',
        //       promo: null,
        //       url: 'https://www.aeliadutyfree.co.nz/auckland/broken-shed-premium-vodka-1-75l.html',
        //       category: 'liquour',
        //       source: {
        //         webite_base: 'https://www.aeliadutyfree.co.nz/auckland',
        //         location: 'auckland',
        //         tag: 'duty-free'
        //       },
        //       date: 1723032201778,
        //       last_check: 1723032201778,
        //       mapping_ref: null,
        //       subcategory: 'spirits'
        //     },
        //     {
        //       title: 'Howling Wolf Spiced Rum 700ml',
        //       brand: 'HOWLING WOLF',
        //       price: '$65.00',
        //       promo: null,
        //       url: 'https://www.aeliadutyfree.co.nz/auckland/howling-wolf-spiced-rum-700ml.html',
        //       category: 'liquour',
        //       source: {
        //         webite_base: 'https://www.aeliadutyfree.co.nz/auckland',
        //         location: 'auckland',
        //         tag: 'duty-free'
        //       },
        //       date: 1723032201778,
        //       last_check: 1723032201778,
        //       mapping_ref: null,
        //       subcategory: 'spirits'
        //     },
        //     {
        //       title: 'Jura The Bay 12YO 1L',
        //       brand: 'JURA',
        //       price: '$136.00',
        //       promo: null,
        //       url: 'https://www.aeliadutyfree.co.nz/auckland/jura-the-bay-12yo-1l.html',
        //       category: 'liquour',
        //       source: {
        //         webite_base: 'https://www.aeliadutyfree.co.nz/auckland',
        //         location: 'auckland',
        //         tag: 'duty-free'
        //       },
        //       date: 1723032201778,
        //       last_check: 1723032201778,
        //       mapping_ref: null,
        //       subcategory: 'spirits'
        //     },
        //     {
        //       title: 'Jura The Road 1L',
        //       brand: 'JURA',
        //       price: '$103.00',
        //       promo: null,
        //       url: 'https://www.aeliadutyfree.co.nz/auckland/jura-the-road-1l.html',
        //       category: 'liquour',
        //       source: {
        //         webite_base: 'https://www.aeliadutyfree.co.nz/auckland',
        //         location: 'auckland',
        //         tag: 'duty-free'
        //       },
        //       date: 1723032201778,
        //       last_check: 1723032201778,
        //       mapping_ref: null,
        //       subcategory: 'spirits'
        //     },
        //     {
        //       title: 'Fettercairn 12YO PX 1L',
        //       brand: 'FETTERCAIRN',
        //       price: '$152.00',
        //       promo: null,
        //       url: 'https://www.aeliadutyfree.co.nz/auckland/fettercairn-12yo-px-1l.html',
        //       category: 'liquour',
        //       source: {
        //         webite_base: 'https://www.aeliadutyfree.co.nz/auckland',
        //         location: 'auckland',
        //         tag: 'duty-free'
        //       },
        //       date: 1723032201778,
        //       last_check: 1723032201778,
        //       mapping_ref: null,
        //       subcategory: 'spirits'
        //     },
        //     {
        //       title: 'Dalmore The Quintet 700ml',
        //       brand: 'DALMORE',
        //       price: '$233.00',
        //       promo: 'https://www.aeliadutyfree.co.nz/media/amasty/amlabel/Travel_Exclusive_-_Black_1__1.png',
        //       url: 'https://www.aeliadutyfree.co.nz/auckland/dalmore-the-quintet-700ml.html',
        //       category: 'liquour',
        //       source: {
        //         webite_base: 'https://www.aeliadutyfree.co.nz/auckland',
        //         location: 'auckland',
        //         tag: 'duty-free'
        //       },
        //       date: 1723032201779,
        //       last_check: 1723032201779,
        //       mapping_ref: null,
        //       subcategory: 'spirits'
        //     },
        //     {
        //       title: 'Dalmore The Quartet 1L',
        //       brand: 'DALMORE',
        //       price: '$206.00',
        //       promo: 'https://www.aeliadutyfree.co.nz/media/amasty/amlabel/Travel_Exclusive_-_Black_1__1.png',
        //       url: 'https://www.aeliadutyfree.co.nz/auckland/dalmore-the-quartet-1l.html',
        //       category: 'liquour',
        //       source: {
        //         webite_base: 'https://www.aeliadutyfree.co.nz/auckland',
        //         location: 'auckland',
        //         tag: 'duty-free'
        //       },
        //       date: 1723032201779,
        //       last_check: 1723032201779,
        //       mapping_ref: null,
        //       subcategory: 'spirits'
        //     }
        //   ]