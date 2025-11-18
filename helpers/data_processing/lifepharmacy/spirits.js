//currency conversion
const nzd_to_usd = require("../../currency_conversion/nzd_to_usd");
const logError = require("../../logError");
const logInvalid = require("../../logInvalidFormat");

//ocr
const detectTextFromURL = require('../../ocr_tesseract/detectTextFromURL');

/////helper functions start//////

// Build correct image URL for LifePharmacy
function toLifePharmacyImageStr(src){
    if(!src) return null;
    const qIndex = src.indexOf('?');
    const pathAndDomain = qIndex === -1 ? src : src.slice(0, qIndex);
    const query = qIndex === -1 ? '' : src.slice(qIndex);
    const lastFiles = pathAndDomain.lastIndexOf('/files/');
    if (lastFiles === -1) return src;
    const filename = pathAndDomain.slice(lastFiles + '/files/'.length);
    return 'https://www.lifepharmacy.co.nz/cdn/shop/files/' + filename + query;
}

const LIFE_PHARMACY_SOURCE_FALLBACK = {
    website_base: "https://www.lifepharmacy.co.nz",
    location: "new_zealand",
    tag: "duty free"
};
const LIFE_PHARMACY_CATEGORY = "health";
const LIFE_PHARMACY_SUBCATEGORY = "medicines";

//INPUT: 2 for $79
//OUTPUT: [34.5]
function calculatePriceFromText(text, og_price) {
    const prices = [];
    const offers = text.split('/');

    offers.forEach(offer => {
        offer = offer.trim();
        
        const matchForXForY = offer.match(/(\d+)\s*(?:for|tor)\s*\$(\d+)/i);
        if (matchForXForY) {
            const quantity = parseInt(matchForXForY[1], 10);
            const price = parseFloat(matchForXForY[2]);
            prices.push({ text: offer, price: nzd_to_usd((price / quantity).toFixed(3)) });
            return;
        }

        const matchBuyXSaveYPercent = offer.match(/buy\s*(\d+)\s*save\s*(\d+)%/i);
        if (matchBuyXSaveYPercent) {
            const quantity = parseInt(matchBuyXSaveYPercent[1], 10);
            const discount = parseInt(matchBuyXSaveYPercent[2], 10) / 100;
            const effectivePrice = og_price * (1 - discount);
            prices.push({text:offer,price:nzd_to_usd(effectivePrice.toFixed(3))});
            return;
        }
    });

    if(prices?.length==0) return null;
    return prices;
}

//INPUT: Dalmore The Quartet 1L 75.4%
function parseProductTitle(input) {
    const patterns = [
        /^(.*)\s(\d+(\.\d+)?)(ml|L)(\s\d+(\.\d+)?%)?$/,
        /^(.*?)(?=\s*$)/,
        /^(.*?)(?:\sTwin Pack\s)(\d+)\sX\s(\d+(\.\d+)?)\s?(L|Litre|ml)(?:\s\d+(\.\d+)?%)?$/,
        /^(.*?)(\d+(\.\d+)?)\s?(L|Litre|ml)(?:\sTravel Exclusive)$/,
        /^(.*?\s\d+\s(?:YO|Year Old))(?:.*?)(\d+(\.\d+)?)\s?(L|Litre|ml|Cl|Bottle)?(?:\s\d+(\.\d+)?%)?$/,
        /^(.*?)(\d+(\.\d+)?)\s?(ml|L|Litre|Bottle)?(?:\s\d+(\.\d+)?%)?$/,
        /^(.*?)(\d+(\.\d+)?)\s?(ml|L|Litre|Cl)?(?:\s(\d+(\.\d+)?%))$/,
        /^(.*?)(?:\sGift Pack\s)(\d+)X(\d+(\.\d+)?)(ml|L|Litre)$/,
        /^(.*?)(\d+(\.\d+)?)\s?(ml|L|Litre|Cl)(?:.*)$/,
        /^(.*?)(\d+)(?:\s)?(s|S|tabs|tablets|caps|capsules)$/ // pack count
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
    const countMatch = input.match(/(\d+)\s?(s|S|tabs|tablets|caps|capsules)\b/);
    if(countMatch){
        return {
            title: input,
            quantity: parseFloat(countMatch[1]),
            unit: "count"
        };
    }
    return {
        title: input,
        quantity: null,
        unit: null
    };
}

function sanitizePrice(price){
    if(price === null || price === undefined) return null;
    if(typeof price === "number") return price;
    if(typeof price !== "string") return null;

    const match = price.replace(/\s+/g," ").match(/[\d.,]+/);
    if(!match) return null;
    const normalized = match[0].replace(/,/g,"");
    const parsed = parseFloat(normalized);
    return Number.isNaN(parsed) ? null : parsed;
}

// Check if promo text should be skipped (generic labels like SALE, GIFT WITH PURCHASE)
function shouldSkipPromo(promoText){
    if(!promoText || typeof promoText !== "string") return false;
    
    const upperPromo = promoText.toUpperCase().trim();
    const skipPatterns = [
        /^SALE$/,
        /^GIFT WITH PURCHASE$/,
        /^OFFER$/
    ];
    
    return skipPatterns.some(pattern => pattern.test(upperPromo));
}

/////helper functions end//////


//main function
const processDataForSpirits = async (data)=>{
    const output = [];
    let iterator = 0;

    while(iterator < data?.length){
        const rawData = data[iterator];
        const finalData = {};

        if(!rawData?.url||!rawData?.category||!rawData?.title||!rawData?.price){
            iterator+=1;
            continue;
        }

        const sanitizedPrice = sanitizePrice(rawData.price);
        if(sanitizedPrice === null){
            iterator+=1;
            continue;
        }

        try{
            finalData.url = rawData.url;
            finalData.category = LIFE_PHARMACY_CATEGORY;
            finalData.sub_category = LIFE_PHARMACY_SUBCATEGORY;

            let breaktitle = parseProductTitle(rawData.title);
            if(!breaktitle) throw new Error("Invalid pattern for: "+rawData.title);
            
            finalData.title = breaktitle.title?.toLowerCase();
            finalData.unit = breaktitle.unit?.toLowerCase();
            finalData.quantity = breaktitle.quantity;

            finalData.brand = null;
            finalData.source = LIFE_PHARMACY_SOURCE_FALLBACK;
            finalData.last_check = Date.now();

            finalData.price = sanitizedPrice;

            // Initialize promo as null
            finalData.promo = null;

            if(Array.isArray(rawData?.promo) && rawData.promo.length > 0){
                for(let i=0;i<rawData.promo.length;i++){
                    let promoURL = rawData.promo[i];
                    let text = await detectTextFromURL(promoURL);
                    if(text && !shouldSkipPromo(text)){
                        const cleanPrice = sanitizedPrice;
                        let res = calculatePriceFromText(text, cleanPrice);
                        if(res) {
                            finalData.promo = res;
                            break;
                        }
                    }
                }
            }else if(typeof rawData?.promo === "string" && rawData.promo.trim().length > 0){
                const promoText = rawData.promo.trim();
                if(!shouldSkipPromo(promoText)){
                    finalData.promo = [{ text: promoText, price: null }];
                }
            }

            // Apply URL conversion here
            finalData.img = toLifePharmacyImageStr(rawData.img);

            output.push(finalData);
            
        }catch(err){
            logError(err);
        }

        iterator+=1;
    }

    return output;
}

module.exports = processDataForSpirits;
