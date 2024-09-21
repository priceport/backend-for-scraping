const fs = require('fs');
const aud_to_usd = require("../../currency_conversion/aud_to_usd");

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
    

    console.error("Invalid format or unit.", input);
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

            console.log("price:"+rawData.price.replace("$",""));
            
            finalData.price = [{text:"",price:aud_to_usd(rawData.price.replace("$",""))}];
            console.log("after:"+finalData.price[0].price);

            //promo processing with ocr and open ai to be done later

            finalData.img = rawData.img;

            finalData.promo = rawData.promo;

            output.push(finalData);
            
        }catch(err){
            console.log(err);
        }

        iterator+=1;
    }
    
    console.log("length in processing:"+output?.length);
    return output;
}

module.exports = processDataForSpirits;

// {
//     url: { type: String, required: true },
//     category: { type: String, enum: categoryEnum, required: true },
//     title: { type: String, required: true },
//     brand: { type: String, required: true },
//     source: {
//       website_base: { type: String, required: true },
//       location: { type: String, required: true },
//       tag: { type: String, enum: tagEnum, required: true }
//     },
//     created_at: { type: Date, default: Date.now },
//     last_check: { type: Date },
//     price: [{ type: Schema.Types.ObjectId, ref: 'Price' }],
//     map_ref: { type: Schema.Types.ObjectId, ref: 'Map' },
//     unit: { type: String, enum: unitEnum },
//     quantity: {type: Number},
//     sub_category:{type:String, required: true}
//   }
// {
//     title: 'Dalmore The Quartet 1L',
//     brand: 'DALMORE',
//     price: '$206.00',
//     promo: 'https://www.aeliadutyfree.co.nz/media/amasty/amlabel/Travel_Exclusive_-_Black_1__1.png',
//     url: 'https://www.aeliadutyfree.co.nz/auckland/dalmore-the-quartet-1l.html',
//     category: 'liquour',
//     source: {
//       webite_base: 'https://www.aeliadutyfree.co.nz/auckland',
//       location: 'auckland',
//       tag: 'duty-free'
//     },
//     date: 1723032201779,
//     last_check: 1723032201779,
//     mapping_ref: null,
//     subcategory: 'spirits'
//   }


// const patterns = [
//     /^(.*?)(?:\s\d+%?\s)(\d+(\.\d+)?)\s?(ml|L|l|Litre)?$/,
//     /^(.*?)(\d+(\.\d+)?%)\s(\d+(\.\d+)?)(ml|L|l|Litre|lt|cl)$/,
//     /^(.*?)(\d+(\.\d+)?%)\s(\d+(\.\d+)?)(ml|L|l|Litre|lt|cl)\s(gift pack|gift box)$/,
//     /^(.*?)(\d+(\.\d+)?%)\s(\d+(\.\d+)?)(ml|L|l|Litre|lt|cl)(\s(gp|\*))?$/,
//     /^(.*?\s\d+y.*?)(\d+(\.\d+)?%)\s(\d+(\.\d+)?)(ml|L|l|Litre|lt|cl)\s(gift pack|gift box)$/,
//     /^(.*?)(\d+y\s)?(.*?)(\d+(\.\d+)?%)\s(\d+(\.\d+)?)(ml|L|l|Litre|lt|cl)(\s(gift pack|gift box)?)?$/,
//     /^(.*?\sproof)(\s\d+(\.\d+)?%)\s(\d+(\.\d+)?)(ml|L|l|Litre|lt|cl)$/,
//     /^(.*?)(\d+(\.\d+)?%)\s(\d+)\sX\s(\d+(\.\d+)?)(ml|L|l|Litre|lt)\s(twin pack)$/,
//     /^(.*?)(\d+(\.\d+)?)(ml|L|l|Litre|lt)$/,
//     /^(.*?)(\d+(\.\d+)?%)\s(\d+)\s[xX]\s(\d+(\.\d+)?)(ml|l|L|Litre|lt)\s(twin pack)$/,
//     /^(.*?)(\d+(\.\d+)?)(cl|ml|L|l)(x|X)(\d+).*?(\d+°).*$/,
//     /^(.*?)(\d+(\.\d+)?)(ml|l|L|Litre|lt)\s(\d+(\.\d+)?%)$/,
//     /^(.*?)(\d+(\.\d+)?)(ml|l|L|Litre|lt)\s(\d+(\.\d+)?%)\sabv.*$/,
//     /^(.*?)(\d+(\.\d+)?%)\s(\d+(\.\d+)?)(ml|l|L|Litre|lt)(\*)$/,
//     /^(.*?)(\d+(\.\d+)?)(lt|L|l|ml|Litre)\s(\d+(\.\d+)?%)$/
// ];