const nzd_to_usd = (nzd)=>{
    if(nzd.includes(",")) nzd = nzd.replace(",","");
    
    if(isNaN(nzd)) return "Invalid input";

    return nzd * 0.6;
}

module.exports = nzd_to_usd;