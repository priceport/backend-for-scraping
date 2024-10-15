//currency conversion
const nzd_to_usd = require("../../currency_conversion/nzd_to_usd");
const logError = require("../../logError");
const logInvalid = require("../../logInvalidFormat");

/////helper functions start//////
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
    logInvalid({text:input,source:"nz liquor"});
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

        if(!rawData?.url||!rawData?.category||!rawData?.title||!rawData?.source||!rawData?.price){
            //some logic to retry for that url
            // console.log("Something missing in",rawData);
            iterator+=1;
            continue;
        }

        if(nzd_to_usd(rawData.price.replace("NZ$",""),"nz liquor")=="Invalid input"){
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

            finalData.brand = null;

            finalData.source = rawData.source;
            finalData.last_check = Date.now();

            finalData.price = [{text:"",price:nzd_to_usd(rawData.price.replace("NZ$",""),"nz liquor")}];

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