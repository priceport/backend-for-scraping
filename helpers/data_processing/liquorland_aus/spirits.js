//currency conversion
const aud_to_usd = require("../../currency_conversion/aud_to_usd");
const logError = require("../../logError");
const logInvalid = require("../../logInvalidFormat");

/////helper functions start//////
//INPUT: 2 for $79 OR 15% Off OR Buy 2 save 15%
//OUTPUT: [{text: "...", price: 34.5}]
function calculatePriceFromText(text, og_price) {
    const prices = [];

    // Split by '/' in case there are multiple offers like "2 for $79 / 3 for $110"
    const offers = text.split('/');

    offers.forEach(offer => {
        offer = offer.trim(); // Clean up extra spaces
        
        // Case 1: Handle "2 for $79" or "2 For $4.80" type texts
        const matchForXForY = offer.match(/(\d+)\s*(?:for|tor|For)\s*\$(\d+(?:\.\d+)?)/i);
        if (matchForXForY) {
            const quantity = parseInt(matchForXForY[1], 10);
            const price = parseFloat(matchForXForY[2]);
            const pricePerItem = (price / quantity).toFixed(3);
            const convertedPrice = aud_to_usd(pricePerItem, "liquorland_aus");
            if(convertedPrice && convertedPrice !== "Invalid input") {
                prices.push({ text: offer, price: convertedPrice }); // Price per item
            }
            return;
        }

        // Case 2: Handle "Buy 2 save 15%" type texts
        const matchBuyXSaveYPercent = offer.match(/buy\s*(\d+)\s*save\s*(\d+)%/i);
        if (matchBuyXSaveYPercent) {
            const quantity = parseInt(matchBuyXSaveYPercent[1], 10);
            const discount = parseInt(matchBuyXSaveYPercent[2], 10) / 100;
            const effectivePrice = og_price * (1 - discount);
            prices.push({text:offer,price:aud_to_usd(effectivePrice.toFixed(3), "liquorland_aus")}); // Apply the discount to the original price
            return;
        }

        // Case 3: Handle simple "15% Off" or "15% Discount" type texts
        const matchPercentOff = offer.match(/(\d+)\s*%\s*(?:off|discount|save)/i);
        if (matchPercentOff) {
            const discount = parseInt(matchPercentOff[1], 10) / 100;
            const effectivePrice = og_price * (1 - discount);
            prices.push({text:offer,price:aud_to_usd(effectivePrice.toFixed(3), "liquorland_aus")}); // Apply the discount to the original price
            return;
        }

        // Case 4: Handle "$10 Off" or "Save $10" type texts
        const matchDollarOff = offer.match(/(?:save\s*)?\$(\d+(?:\.\d+)?)\s*(?:off|discount)?/i);
        if (matchDollarOff) {
            const discount = parseFloat(matchDollarOff[1]);
            const effectivePrice = og_price - discount;
            if (effectivePrice > 0) { // Make sure we don't get negative prices
                const convertedPrice = aud_to_usd(effectivePrice.toFixed(3), "liquorland_aus");
                if(convertedPrice && convertedPrice !== "Invalid input") {
                    prices.push({text:offer,price:convertedPrice}); // Subtract discount from original price
                }
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
    logInvalid({text:input,source:"liquorland_aus"});
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


        // Clean price - remove $ prefix
        let cleanPrice = rawData.price.replace(/^\$/, "");
        
        // Check if price is valid
        if (!cleanPrice || isNaN(parseFloat(cleanPrice))) {
            console.log(`Skipping product with invalid price: "${rawData.title}" - "${rawData.price}"`);
            iterator+=1;
            continue;
        }
        
        const convertedPrice = aud_to_usd(cleanPrice, "liquorland_aus");
        
        if(convertedPrice == "Invalid input" || convertedPrice == null || convertedPrice == undefined){
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

            finalData.brand = rawData.brand ? rawData.brand.toLowerCase().trim() : null;

            finalData.source = rawData.source;
            finalData.last_check = Date.now();

            finalData.price = [{text:"",price:convertedPrice}];
            finalData.promo = []; // Initialize promo array

            // Process promo prices if available
            if(rawData?.promo) {
                // Handle null/undefined promo
                if(rawData.promo === null || rawData.promo === undefined) {
                    // No promo, skip
                } else if (typeof rawData.promo === 'string' && rawData.promo.trim().length > 0) {
                    // Skip promos that contain "LOW PRICE EVERYDAY"
                    const promoText = rawData.promo.trim();
                    if (promoText.toUpperCase().includes('LOW PRICE EVERYDAY')) {
                        // Skip this promo
                    } else {
                        const promoPrices = calculatePriceFromText(promoText, parseFloat(cleanPrice));
                        if(promoPrices && promoPrices.length > 0) {
                            // Add to price array
                            finalData.price.push(...promoPrices);
                            // Also keep as separate promo field for DB insertion
                            finalData.promo = promoPrices;
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