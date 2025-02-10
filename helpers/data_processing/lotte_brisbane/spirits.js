const fs = require('fs');
const aud_to_usd = require("../../currency_conversion/aud_to_usd");
const logError = require('../../logError');
const logInvalid = require('../../logInvalidFormat');

//INPUT: Dalmore The Quartet 1L 75.4%
//OUTPUT: { title: 'Dalmore The Quartet', quantity: 1, unit: 'L' }
function parseProductTitle(input) {
    let match = input.match(/^(.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*\d+y.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)\s?(.*)?$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)\s(gift\s(pack|box))$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)%\s(\d+)\sx\s(\d+(\.\d+)?)(ml|l|L|Litre)\s(twin|trio)\spack$/);
    if (match) {
        return {
            title: input,
            quantity: !isNaN(parseFloat(match[4])*parseFloat(match[5]))?(parseFloat(match[4])*parseFloat(match[5])) : null,
            unit: match[7] || null,
        };
    }

    match = input.match(/^(.*\d+y.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)\s(gift\s(pack|box))$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    // scapegrace single malt 700ml 46% abv- fortuna vi not working
    match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|l|L|Litre)\s(\d+(\.\d+)?)%\sabv(\s.*)?$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)\smini\smaster\s(\d+(\.\d+)?)%\s(\d+)x(\d+(\.\d+)?)(ml|l|L|Litre)$/);
    if (match) {
        return {
            title: input,
            quantity: !isNaN(parseFloat(match[4])*parseFloat(match[5]))?(parseFloat(match[4])*parseFloat(match[5])) : null,
            unit: match[7] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+)\sproof\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)$/);
    if (match) {
        return {
            title: input,
            quantity: match[5] ? parseFloat(match[5]) : null,
            unit: match[7] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)\s–\stravel\s(retail\sexclusive|pack|exclusive)\s(giftpack)?$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)\s(travel\s)?pack\s(\d+)x(\d+(\.\d+)?)(ml|l|L|Litre)\s(\d+(\.\d+)?)%,\scontains\.:\s(.*)$/);
    if (match) {
        return {
            title: input,
            quantity: !isNaN(parseFloat(match[3])*parseFloat(match[4]))?(parseFloat(match[3])*parseFloat(match[4])) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)\s(partypack|spritz)$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)\s(gp|gift\s(pack|box))$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|mL)\s(\d+(\.\d+)?)%$/);
    if (match) {
        return {
            title: input,
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|l|L|Litre)$/);
    if (match) {
        return {
            title: input,
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|l|L|Litre)\s(\d+(\.\d+)?)%\sabv(.*)?$/);
    if (match) {
        return {
            title: input,
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?%)\s(\d+(\.\d+)?)(ml|l|L|Litre)\*?$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*),?\s?(\d+yo)?,?\s?(\d+(\.\d+)?%)?,?\s(\d+(\.\d+)?)(ml|l|L|Litre)(\s(gp|gift\s(pack|box)))?$/);
    if (match) {
        return {
            title: input,
            quantity: match[5] ? parseFloat(match[5]) : null,
            unit: match[7] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+)\s?%\s(\d+(\.\d+)?)(ml|l|L|Litre)$/);
    if (match) {
        return {
            title: input,
            quantity: match[3] ? parseFloat(match[3]) : null,
            unit: match[5] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)(lt|l|L|Litre)\s(\d+(\.\d+)?)%$/);
    if (match) {
        return {
            title: input,
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null,
        };
    }

    match = input.match(/^^(.*)\s(\d+(\.\d+)?)(ml|l|L|Litre)$/);
    if (match) {
        return {
            title: input,
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)\s(trio|twin)\spack$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre),?\s(giftbox)?$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*\sminiature\sset)\s(\d+(\.\d+)?%)\s(\d+)x(\d+(\.\d+)?)(ml|l|L|Litre)$/);
    if (match) {
        return {
            title: input,
            quantity: !isNaN(parseFloat(match[4])*parseFloat(match[5]))?(parseFloat(match[4])*parseFloat(match[5])) : null,
            unit: match[7] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?%)\sabv\s(\d+(\.\d+)?)(ml|mL)$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)%\s(\d+)x(\d+(\.\d+)?)(ml|l|L|Litre)$/);
    if (match) {
        return {
            title: input,
            quantity: !isNaN(parseFloat(match[4])*parseFloat(match[5]))?(parseFloat(match[4])*parseFloat(match[5])) : null,
            unit: match[7] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)\sgift\s(pack|box)\*?$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)(ml|l|L|Litre)\s(\d+(\.\d+)?)%\s-\s(.*)$/);
    if (match) {
        return {
            title: input,
            quantity: match[2] ? parseFloat(match[2]) : null,
            unit: match[4] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+)x(\d+(\.\d+)?)(ml|l|L|Litre)$/);
    if (match) {
        return {
            title: input,
            quantity: !isNaN(parseFloat(match[2])*parseFloat(match[3]))?(parseFloat(match[2])*parseFloat(match[3])) : null,
            unit: match[5] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?)%\s(\d+(\.\d+)?)(ml|l|L|Litre)\sgiftpack$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)\s(\d+(\.\d+)?%)\s?(\d+(\.\d+)?)(ml|l|L|Litre)$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)\.(\d+(\.\d+)?%)\s(\d+)x(\d+(\.\d+)?)(ml|l|L|Litre)$/);
    if (match) {
        return {
            title: input,
            quantity: !isNaN(parseFloat(match[4])*parseFloat(match[5]))?(parseFloat(match[4])*parseFloat(match[5])) : null,
            unit: match[7] || null,
        };
    }

    match = input.match(/^(.*\d+y.*)\s(\d+(\.\d+)?%)\s(\d+)x(\d+(\.\d+)?)(ml|l|L|Litre)\s(twinpack)$/);
    if (match) {
        return {
            title: input,
            quantity: match[4] ? parseFloat(match[4]) : null,
            unit: match[6] || null,
        };
    }

    match = input.match(/^(.*)$/);
    if (match) {
        return {
            title: input,
            quantity: null,
            unit: null,
        };
    }

    match = input.match(/(\d+(?:\.\d+)?)\s*(ml|l|g|kg)/i);
    if(match){
        let result={};
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
    

    // console.error("Invalid format or unit.", input);
    logInvalid({text:input,source:"lotte brisbane"});
    return null;
}


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

        if(aud_to_usd(rawData.price.replace("$",""),"lotte brisbane")=="Invalid input"){
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
            
            finalData.price = [{text:"",price:aud_to_usd(rawData.price.replace("$",""),"lotte brisbane")}];

            //promo processing with ocr and open ai to be done later

            finalData.img = rawData.img;

            finalData.promo = rawData?.promo?.map(promotxt=>{
                const regex = /Buy (\d+) for \$(\d+)/
                const match = promotxt.match(regex);

                if(match){
                    const quantity = match[1];
                    const price = match[2];

                    const effective_price = parseFloat(aud_to_usd(price,"lotte brisbane"))/parseFloat(quantity);

                    if(!isNaN(effective_price)){
                        return {
                            price:effective_price,
                            text:promotxt
                        }
                    }
                    else{
                        console.log("Nan for: quantity="+quantity+" price="+price);
                    }
                }
                else{
                    console.log("match not found for:",match);
                }
            });

            if(rawData?.promo2){
                finalData.promo2 = {
                    text: rawData?.promo2,
                    price: (aud_to_usd(rawData?.price?.replace("$",""),"lotte brisbane") * ((100 - parseFloat(rawData?.promo2?.split(" ")[3]?.replace("%","")))/100))
                }
            }

            output.push(finalData);
            
        }catch(err){
            logError(err);
        }

        iterator+=1;
    }
    
    return output;
}

module.exports = processDataForSpirits;