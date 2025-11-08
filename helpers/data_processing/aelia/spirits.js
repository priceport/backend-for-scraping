//currency conversion
const nzd_to_usd = require("../../currency_conversion/nzd_to_usd");
const logError = require("../../logError");
const logInvalid = require("../../logInvalidFormat");

//ocr
const detectTextFromURL = require('../../ocr_tesseract/detectTextFromURL');

const UNWANTED_PROMO_TEXTS = [
    'travel exclusive',
    'exclusive',
    'limited edition',
    'award winner',
    'best seller',
    'staff pick',
    'popular',
    'trending'
];

/////helper functions start//////
//INPUT: 2 for $79 OR 15% Off OR Buy 2 save 15%
//OUTPUT: [{text: "...", price: 34.5}]
function calculatePriceFromText(text, og_price) {
    const prices = [];

    // Split by '/' in case there are multiple offers like "2 for $79 / 3 for $110"
    const offers = text.split('/');

    offers.forEach(offer => {
        offer = offer.trim(); // Clean up extra spaces
        
        // Case 1: Handle "2 for $79" type texts
        const matchForXForY = offer.match(/(\d+)\s*(?:for|tor)\s*\$(\d+)/i);
        if (matchForXForY) {
            const quantity = parseInt(matchForXForY[1], 10);
            const price = parseFloat(matchForXForY[2]);
            prices.push({ text: offer, price: nzd_to_usd((price / quantity).toFixed(3)) }); // Price per item
            return;
        }

        // Case 2: Handle "Buy 2 save 15%" type texts
        const matchBuyXSaveYPercent = offer.match(/buy\s*(\d+)\s*save\s*(\d+)%/i);
        if (matchBuyXSaveYPercent) {
            const quantity = parseInt(matchBuyXSaveYPercent[1], 10);
            const discount = parseInt(matchBuyXSaveYPercent[2], 10) / 100;
            const effectivePrice = og_price * (1 - discount);
            prices.push({text:offer,price:nzd_to_usd(effectivePrice.toFixed(3))}); // Apply the discount to the original price
            return;
        }

        // Case 3: Handle simple "15% Off" or "15% Discount" type texts
        const matchPercentOff = offer.match(/(\d+)\s*%\s*(?:off|discount|save)/i);
        if (matchPercentOff) {
            const discount = parseInt(matchPercentOff[1], 10) / 100;
            const effectivePrice = og_price * (1 - discount);
            prices.push({text:offer,price:nzd_to_usd(effectivePrice.toFixed(3))}); // Apply the discount to the original price
            return;
        }

        // Case 4: Handle "$10 Off" or "Save $10" type texts
        const matchDollarOff = offer.match(/(?:save\s*)?\$(\d+(?:\.\d+)?)\s*(?:off|discount)?/i);
        if (matchDollarOff) {
            const discount = parseFloat(matchDollarOff[1]);
            const effectivePrice = og_price - discount;
            if (effectivePrice > 0) { // Make sure we don't get negative prices
                prices.push({text:offer,price:nzd_to_usd(effectivePrice.toFixed(3))}); // Subtract discount from original price
                return;
            }
        }
    });

    if(prices?.length==0) return null;

    return prices;
}

//INPUT: Dalmore The Quartet 1L 75.4%
//OUTPUT: { title: 'Dalmore The Quartet', quantity: 1, unit: 'L' }
function parseProductTitle(input) {
    const patterns = [
        /^(.*)\s(\d+(\.\d+)?)(ml|L)(\s\d+(\.\d+)?%)?$/,
        /^(.*?)(?=\s*$)/,  // Pattern 1
        /^(.*?)(?:\sTwin Pack\s)(\d+)\sX\s(\d+(\.\d+)?)\s?(L|Litre|ml)(?:\s\d+(\.\d+)?%)?$/,  // Pattern 2
        /^(.*?)(\d+(\.\d+)?)\s?(L|Litre|ml)(?:\sTravel Exclusive)$/,  // Pattern 3
        /^(.*?\s\d+\s(?:YO|Year Old))(?:.*?)(\d+(\.\d+)?)\s?(L|Litre|ml|Cl|Bottle)?(?:\s\d+(\.\d+)?%)?$/,  // Pattern 4
        /^(.*?)(\d+(\.\d+)?)\s?(ml|L|Litre|Bottle)?(?:\s\d+(\.\d+)?%)?$/,  // Pattern 5
        /^(.*?)(\d+(\.\d+)?)\s?(ml|L|Litre|Cl)?(?:\s(\d+(\.\d+)?%))$/,  // Pattern 6
        /^(.*?)(?:\sGift Pack\s)(\d+)X(\d+(\.\d+)?)(ml|L|Litre)$/,  // Pattern 7
        /^(.*?)(\d+(\.\d+)?)\s?(ml|L|Litre|Cl)(?:.*)$/,  // Pattern 8
    ];

    for (const regex of patterns) {
        const match = input.match(regex);
        if (match) {
            return {
                title: input,
                quantity: match[2] ? parseFloat(match[2]) : null,
                unit: match[4] || null,
            };
        }
    }
    // console.error("Invalid format or unit.", input);
    logInvalid({text:input,source:"aelia"});
    return null;
}
/////helper functions end//////


//main function
const processDataForSpirits = async (data)=>{
    const output = [];
    let iterator = 0;

    while(iterator<data?.length){
        const rawData = data[iterator];
        const finalData = {};

        if(!rawData?.url||!rawData?.category||!rawData?.title||!rawData?.brand||!rawData?.source||!rawData?.price){
            //some logic to retry for that url
            // console.log("Something missing in",rawData);
            iterator+=1;
            continue;
        }

        if(nzd_to_usd(rawData.price.replace("$",""),"aelia auckland")=="Invalid input"){
            iterator+=1;
            continue;
        } 

        try{
            finalData.url = rawData?.url;
            finalData.category = rawData?.category;
            finalData.sub_category = rawData?.subcategory;

            let breaktitle = parseProductTitle(rawData?.title);

            if(!breaktitle) throw new Error("Invalid pattern for: "+rawData?.title);
            
            finalData.title = breaktitle.title?.toLowerCase();
            finalData.unit = breaktitle.unit?.toLowerCase();
            finalData.quantity = breaktitle.quantity;

            finalData.brand = rawData.brand.toLowerCase().trim();

            finalData.source = rawData.source;
            finalData.last_check = Date.now();

            finalData.price = [{text:"",price:nzd_to_usd(rawData.price.replace("$",""),"aelia auckland")}];

            if(rawData?.promo&&rawData?.promo?.length>0){
                for(let i=0;i<rawData?.promo?.length;i++){
                    let promoURL = rawData.promo[i];
                    
                    let text = await detectTextFromURL(promoURL);
                    
                    if(text){
                        
                        const textLower = text.trim().toLowerCase();
                        const isUnwanted = UNWANTED_PROMO_TEXTS.some(unwanted => textLower.includes(unwanted));
                        
                        if (isUnwanted) {
                            continue; 
                        }
                        
                        // Clean the price string (remove $ and convert to number)
                        const cleanPrice = parseFloat(rawData.price.replace("$", ""));
                        let res = calculatePriceFromText(text, cleanPrice);

                        if(res) {
                            finalData.promo = res;
                            break;
                        } 
                    }
                }
            }

            finalData.img = rawData.img;

            output.push(finalData);
            
        }catch(err){
            logError(err);
        }

        iterator+=1;
    }

    return output;
}

module.exports = processDataForSpirits;