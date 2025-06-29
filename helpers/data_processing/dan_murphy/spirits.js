//currency conversion
const nzd_to_usd = require("../../currency_conversion/nzd_to_usd");
const aud_to_usd = require("../../currency_conversion/aud_to_usd");
const logError = require("../../logError");
const logInvalid = require("../../logInvalidFormat");

/////helper functions end//////
function extractPrice(str) {
    const match = str.match(/\$([0-9,.]+)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : null;
}

function extractUnitAndQuantity(description) {
    const match = description.match(/(\d+)\s*(ML|L|mL|l|ml)/i);
    if (match) {
      return {
        quantity: parseInt(match[1]),
        unit: match[2].toUpperCase()
      };
    }
    return { quantity: null, unit: null };
  }
  

//main function
const processDataForSpirits = async (data)=>{
    const output = [];
    let iterator = 0;

    while(iterator<data?.length){
        const rawData = data[iterator];
        const finalData = {};

        if(!rawData?.url||!rawData?.category||!rawData?.name||!rawData?.website||!rawData?.price){
            //some logic to retry for that url
            // console.log("Something missing in",rawData);
            iterator+=1;
            continue;
        }

        const price = aud_to_usd(extractPrice(rawData.price));
        if(price==null){
            iterator+=1;
            continue;
        } 

        try{
            finalData.url = rawData?.url;
            finalData.category = rawData?.category;
            finalData.sub_category = rawData?.sub_category;
            
            finalData.name = rawData?.name?.toLowerCase();

            const { unit, quantity } = extractUnitAndQuantity(rawData?.description);
            finalData.unit = unit?.toLowerCase();
            finalData.quantity = quantity;

            finalData.brand = rawData?.brand?.toLowerCase();

            finalData.website = rawData.website;
            finalData.last_check = Date.now();

            finalData.price = [{text:"",price:price}];

            finalData.img = rawData.img;

            finalData.description = rawData?.description;

            output.push(finalData);
            
        }catch(err){
            logError(err);
        }

        iterator+=1;
    }

    return output;
}

module.exports = processDataForSpirits;