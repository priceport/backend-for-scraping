const fs = require('fs');
const nzd_to_usd = require('../../currency_conversion/nzd_to_usd');
const logError = require('../../logError');
const logInvalid = require('../../logInvalidFormat');

//INPUT: Dalmore The Quartet 1L 75.4%
//OUTPUT: { title: 'Dalmore The Quartet', quantity: 1, unit: 'L' }
function parseProductTitle(input) {
    let match = input.match(/^(.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)$/);
    
    ///
    match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm|floz)(\/\d+(\.\d+)?floz)?$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match( /^(.*)\s(\d+(\.\d+)?)(ml|gm)$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match(/^(.*)$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match(/^(.*)\s(\d+)\s(.*)\s(\d+(\.\d+)?)(ml|gm)$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm|floz)$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm)(\/\d+(\.\d+)?floz)?$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match(/^(.*)\s(\d+)$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match(/^(.*\d+.*)\s(\d+(\.\d+)?)(ml|gm)$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match( /^(.*)\s(\d+(\.\d+)?)(ml|gm)(.*)?$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm)\s?(.*)?$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm)(\/\d+(\.\d+)?(floz|oz))?$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|gm)\s?(.*)?$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match(/^(.+\d+.*)\s(\d+(\.\d+)?)(ml|gm)$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match(/^(.+)\s(\d+(\.\d+)?)(ml|gm)(.*)?$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match(/^(.+)\s(\d+(\.\d+)?)(ml|gm)\s?(.*)?$/);
    if (match&&match[2]&&match[4]) {
        return {
            title: match[1]?.trim(),
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null
        };
    }

    match = input.match(/(\d+(?:\.\d+)?)\s*(ml|l|g|kg)/i);
    if(match){
        let result = {};
        result.quantity= match[1]; 
        result.unit = match[2];
        result.title = input;

        // Follow-up check for cases like "2x1l"
        const multiMatch = input.match(/(\d+)\s*x\s*(\d+)\s*(ml|l)/i);
        if (multiMatch) {
            const multiplier = parseFloat(multiMatch[1]);  // First part (e.g., 2 in 2x1)
            const perUnitQuantity = parseFloat(multiMatch[2]);  // Second part (e.g., 1 in 2x1)
            result.quantity = multiplier * perUnitQuantity;  // Calculate total quantity
        }

        return result;
    }

    // console.log("Invalid format or unit.", input);
    logInvalid({text:input,source:"farmers"});
    return {
        title:input,
        quantity:null,
        unit:null
    }
}

// const matchForXForY = offer.match(/(\d+)\s*for\s*\$(\d+)/i);
//         if (matchForXForY) {
//             const quantity = parseInt(matchForXForY[1], 10);
//             const price = parseFloat(matchForXForY[2]);
//             prices.push({text:offer,price:(price / quantity).toFixed(3)}); // Price per item
//             return;
//         }

const processPromoText = (text,og_price)=>{

    if(!text) return null;

    const matchHalfPrice =  text.match(/Buy (\d+) Get (\d+) Half Price/i);
    if(matchHalfPrice){
        const buyQty = parseInt(matchHalfPrice[1], 10);
        const getQty = parseInt(matchHalfPrice[2], 10);
    
        // Calculate the total number of items (buyQty + getQty)
        const totalQty = buyQty + getQty;
    
        // Calculate the effective price
        // We pay full price for buyQty items and half price for getQty items
        const effectivePrice = ((buyQty * og_price) + (getQty * og_price * 0.5)) / totalQty;

        return {text,price:effectivePrice.toFixed(3)}; // Price per item
    }

    const matchGetThe1Free = text.match(/Buy (\d+) Get the (\d+)(?:rd|th|st|nd) FREE/i);
    if(matchGetThe1Free&&parseInt(matchGetThe1Free[2], 10) == (parseInt(matchGetThe1Free[1], 10) + 1)){
        const buyQty = parseInt(matchGetThe1Free[1], 10);

        // Total number of items
        const totalQty = buyQty + 1;

        // Calculate the effective price
        // We pay full price for buyQty items, and get one item free
        const effectivePrice = (buyQty * og_price) / totalQty;

        return {text,price:effectivePrice.toFixed(3)}; // Price per item
    }

    const matchGet1Free = text.match(/Buy (\d+) Get (\d+)(?:rd|th|st|nd) FREE/i);
    if(matchGet1Free&&parseInt(matchGet1Free[2], 10) == (parseInt(matchGet1Free[1], 10) + 1)){
        const buyQty = parseInt(matchGet1Free[1], 10);

        // Total number of items
        const totalQty = buyQty + 1;

        // Calculate the effective price
        // We pay full price for buyQty items, and get one item free
        const effectivePrice = (buyQty * og_price) / totalQty;

        return {text,price:effectivePrice.toFixed(3)}; // Price per item
    }

    const saveXwhen =  text.match(/Save (\d+)% when you buy (\d+) or more/i);
    if(saveXwhen){
        const discountPercent = parseInt(saveXwhen[1], 10); // e.g., 30% discount\

        // Calculate the effective price with the discount applied
        const discountMultiplier = (100 - discountPercent) / 100;
        const effectivePrice = og_price * discountMultiplier;

        return {text,price:effectivePrice.toFixed(3)}; // Price per item
    }

    console.log(text,og_price);

    return null;
}

const processDataForBeauty = async (data)=>{
    const output = [];
    let iterator = 0;

    while(iterator<data?.length){
        const rawData = data[iterator];
        const finalData = {};

        if(!rawData?.url||!rawData?.category||!rawData?.title||!rawData?.source||!rawData?.price){
            //some logic to retry for that url
            // console.log("Something missing in",rawData);
            iterator+=1;
            continue;
        }

        if(nzd_to_usd(rawData.price.replace("$",""),"farmers")=="Invalid input"){
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

            finalData.brand = rawData?.brand?.toLowerCase()?.trim();

            finalData.source = rawData.source;
            finalData.last_check = Date.now();
            
            finalData.price = [{text:"",price:nzd_to_usd(rawData.price.replace("$",""))}];

            finalData.img = rawData.img;

            finalData.promo = processPromoText(rawData.promo,nzd_to_usd(rawData.price.replace("$",""),"farmers"));

            if(isNaN(finalData?.price[0]?.price)) {
                iterator+=1;
                continue;
            }

            output.push(finalData);
            
        }catch(err){
            logError(err);
        }

        iterator+=1;
    }
    
    return output;
}

module.exports = processDataForBeauty;