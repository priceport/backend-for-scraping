module.exports = (req,attributes)=>{

    if(!req.body){
        return [false,attributes[0]];
    }

    for(let i = 0;i<attributes.length;i++){
        if(Object.keys(req.body).findIndex(el=>el==attributes[i])==-1) return [false,attributes[i]];
    }

    return [true];
}