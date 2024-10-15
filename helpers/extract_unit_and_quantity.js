const pool = require("../configs/postgresql.config");
const logError = require("./logError");

function getQuantityAndUnitFromTitle (title){
    const match = title.match(/(\d+(?:\.\d+)?)\s*(ml|l|g|kg)/i);

    let result = {};

    if(match){
        result.quantity= match[1]; 
        result.unit = match[2];
        result.title = title;

        // Follow-up check for cases like "2x1l"
        const multiMatch = title.match(/(\d+)\s*x\s*(\d+)\s*(ml|l)/i);
        if (multiMatch) {
            const multiplier = parseFloat(multiMatch[1]);  // First part (e.g., 2 in 2x1)
            const perUnitQuantity = parseFloat(multiMatch[2]);  // Second part (e.g., 1 in 2x1)
            result.quantity = multiplier * perUnitQuantity;  // Calculate total quantity
        }

        return result;
    }

    return null;
}

const extract_unit_and_quantity = async (data)=>{
    let count =0;
    try{
        let data = await pool.query(`SELECT * FROM product_from_heinemann_sydney where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_heinemann_sydney SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }

    try{
        let data = await pool.query(`SELECT * FROM product_from_aelia_auckland where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_aelia_auckland SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }

    try{
        let data = await pool.query(`SELECT * FROM product_from_aelia_queensland where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_aelia_queensland SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }

    try{
        let data = await pool.query(`SELECT * FROM product_from_aelia_christchurch where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_aelia_christchurch SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }

    try{
        let data = await pool.query(`SELECT * FROM product_from_lotte_melbourne where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_lotte_melbourne SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }

    try{
        let data = await pool.query(`SELECT * FROM product_from_lotte_brisbane where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_lotte_brisbane SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }

    try{
        let data = await pool.query(`SELECT * FROM product_from_whisky_and_more where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_whisky_and_more SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }

    try{
        let data = await pool.query(`SELECT * FROM product_from_nzliquor where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_nzliquor SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }

    try{
        let data = await pool.query(`SELECT * FROM product_from_big_barrel where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_big_barrel SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }

    try{
        let data = await pool.query(`SELECT * FROM product_from_sephora where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_sephora SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }

    try{
        let data = await pool.query(`SELECT * FROM product_from_beauty_bliss where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_beauty_bliss SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }

    try{
        let data = await pool.query(`SELECT * FROM product_from_mecca where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_mecca SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }

    try{
        let data = await pool.query(`SELECT * FROM product_from_farmers where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_farmers SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }

    try{
        let data = await pool.query(`SELECT * FROM product_from_chemist_warehouse where unit is null;`);

        for(let i=0;i<data?.rows?.length;i++){
            let ans = getQuantityAndUnitFromTitle(data.rows[i].title);

            if(ans){
                await pool.query(`UPDATE product_from_chemist_warehouse SET unit = $1, qty = $2 WHERE id = $3;`,[ans.unit,ans.quantity,data.rows[i].id]);
                count+=1;
            }
        }
    }
    catch(err){
        logError(err);
    }
}

module.exports = extract_unit_and_quantity;