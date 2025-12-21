const fs = require('fs');
const nzd_to_usd = require("../../currency_conversion/nzd_to_usd");
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
    logInvalid({text:input,source:"sephora"});
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

        // Validate and convert price
        const priceString = rawData.price ? rawData.price.replace("$","").trim() : "";
        const convertedPrice = nzd_to_usd(priceString, "sephora");
        
        // Skip if price conversion failed or returned invalid value
        if(!convertedPrice || convertedPrice === "Invalid input" || convertedPrice === null || isNaN(convertedPrice)){
            console.log(`Skipping item with invalid price conversion: ${rawData?.title || rawData?.url}, price: ${rawData.price}`);
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
            
            // Use the already validated converted price
            finalData.price = [{text:"",price:convertedPrice}];

            finalData.img = rawData.img;

            // Process promo data - convert promo prices to USD
            if (rawData?.promo && Array.isArray(rawData.promo) && rawData.promo.length > 0) {
              finalData.promo = rawData.promo.map(promoItem => {
                if (promoItem && promoItem.price !== undefined && promoItem.price !== null) {
                  // Convert promo price to USD if it's a number
                  let promoPrice = promoItem.price;
                  if (typeof promoPrice === 'string') {
                    promoPrice = parseFloat(promoPrice.replace(/[^0-9.]/g, ''));
                  }
                  if (!isNaN(promoPrice)) {
                    const convertedPromoPrice = nzd_to_usd(promoPrice.toString(), "sephora");
                    if (convertedPromoPrice && convertedPromoPrice !== "Invalid input" && !isNaN(convertedPromoPrice)) {
                      return {
                        text: promoItem.text || "",
                        price: convertedPromoPrice
                      };
                    }
                  }
                }
                // Return promo with text only if price conversion fails
                return {
                  text: promoItem.text || "",
                  price: null
                };
              }).filter(p => p !== null);
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