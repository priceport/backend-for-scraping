const waitForXTime = async (time)=>{
    return await new Promise((res,rej)=>{
        setTimeout(()=>res(),time);
    });
}

module.exports = waitForXTime;