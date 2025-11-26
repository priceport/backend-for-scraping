const fs = require('fs');
const sgd_to_usd = require("../../currency_conversion/sgd_to_usd");
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

    // console.log("Invalid format or unit.", input);
    logInvalid({text:input,source:"ishopchangi"});
    return {
        title:input,
        quantity:null,
        unit:null
    }
}


const processDataForBeauty = async (data)=>{
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

        if(sgd_to_usd(rawData.price.replace("S$",""),"ishopchangi")=="Invalid input"){
            iterator+=1;
            continue;
        } 

        try{
            finalData.url = rawData?.url;
            finalData.category = rawData?.category;
            finalData.sub_category = rawData?.subcategory;

            let breaktitle = parseProductTitle(rawData?.title);

            if(!breaktitle) throw new Error("Invalid pattern for: "+rawData?.title);
            
            // Keep the entire original title, don't use the parsed title
            finalData.title = rawData?.title?.toLowerCase();
            finalData.unit = breaktitle.unit?.toLowerCase();
            finalData.quantity = breaktitle.quantity;

            finalData.brand = rawData.brand.toLowerCase().trim();

            finalData.source = rawData.source;
            finalData.last_check = Date.now();
            
            finalData.price = [{text:"",price:sgd_to_usd(rawData.price.replace("S$",""),"ishopchangi")}];

            finalData.img = rawData.img;

            // Process promo - convert string to array format if needed
            if (rawData.promo) {
                // Check if it's a valid promo text (has %, "off", or "promo")
                const promoText = rawData.promo;
                if (promoText.includes("%") || promoText.toLowerCase().includes("off") || promoText.toLowerCase().includes("promo")) {
                    finalData.promo = [promoText];
                } else {
                    finalData.promo = null;
                }
            } else {
                finalData.promo = null;
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

