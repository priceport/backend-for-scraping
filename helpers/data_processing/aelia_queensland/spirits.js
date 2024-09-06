const fs = require('fs');
const nzd_to_usd = require("../../currency_conversion/nzd_to_usd");

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
                title: match[1]?.trim(),
                quantity: match[2] ? parseFloat(match[2]) : null,
                unit: match[4] || null,
            };
        }
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
            console.log("Something missing in",rawData);
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

            finalData.price = [{text:"",price:nzd_to_usd(rawData.price.replace("$",""))}];
            //promo processing with ocr and open ai to be done later

            finalData.img = rawData.img;

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