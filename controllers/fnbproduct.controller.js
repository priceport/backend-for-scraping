const pool = require("../configs/postgresql.config");
const catchAsync = require("../utils/catchAsync");
const xlsx = require('xlsx');
const fs = require('fs');
const AppError = require("../utils/appError");
const redisClient = require("../configs/redis.config");

function looseMatch(string, search) {
    // Convert both strings to lowercase for case-insensitive comparison
    const lowerString = string.toLowerCase();
    const lowerSearch = search.toLowerCase();

    // Check if the search term exists in the string
    return lowerString.includes(lowerSearch);
}

exports.addFnbProductsWithExcel = catchAsync(async (req,res,next)=>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Read the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets['product'];
    if (!sheet) {
        return res.status(400).send('Sheet named "product" not found.');
    }

    const data = xlsx.utils.sheet_to_json(sheet, { defval: null });

    // Process each row in the sheet
    for (const row of data) {
        const id = row['id'];
        const name = row['name'];
        const store_id = row['store_id'];
        const note = row['note'];
        const type = row['type'];
        const description = row['description'];
        const terminal_id = row['terminal_id'];
        const canprod_id = row['cannonical_id'];
        const price = row['price'];

        if (!price || !name  || !terminal_id) {
            console.warn('Skipping row with missing required fields:', row);
            continue;
        }

        if (!id) {
            // Create a new product
            const productQuery = `
                INSERT INTO product_fnb (name, store_id, note, type, description, terminal_id, canprod_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
            `;
            const productResult = await pool.query(productQuery, [
                name, store_id, note, type, description, terminal_id, canprod_id
            ]);

            const newProductId = productResult.rows[0].id;

            // Insert price for the new product
            const priceQuery = `
                INSERT INTO price_fnb (product_id, date, price)
                VALUES ($1, CURRENT_DATE, $2);
            `;
            await pool.query(priceQuery, [newProductId, price]);
        } else {
            // Insert price for existing product
            const priceQuery = `
                INSERT INTO price_fnb (product_id, date, price)
                VALUES ($1, CURRENT_DATE, $2);
            `;
            await pool.query(priceQuery, [id, price]);
        }
    }

    fs.unlinkSync(req.file.path); // Clean up uploaded file
    res.status(200).send('File processed successfully.');
});

exports.getAllFnbProductsFor = catchAsync(async (req,res,next)=>{
    const limit = parseInt(req.query.limit, 10) || 1000;
    const offset = parseInt(req.query.offset, 10) || 0;
    const terminal = req.query.terminal?.split(",") || null;
    const store = req.query.store?.split(",") || null;
    const sort = req.query.sort || 'price_low_to_high';
    const search = req.query.search || null;
    const pricerange = req.query.pricerange || null;

    if (limit > 1000) {
        return next(new AppError("Limit should be equal or less than 1000", 400));
    }

    // Fetch precomputed data from Redis
    const cachedData = await redisClient.get('daily_product_data_fnb');
    if (!cachedData) {
        return next(new AppError("Precomputed data not available. Try again later.", 500));
    }

    // Parse cached data
    let products = JSON.parse(cachedData);

    if(terminal){
        products=products?.filter(product=>terminal.includes(product?.terminal_name))
    }

    if(store){
        products=products?.filter(product=>store.includes(product?.store_name))
    }

    // Remove products where all products_data entries were filtered out
    products = products.filter(p => p.products_data.length > 1);

    // Apply pricerank filter
    // if (pricerank) {
    //     products = products.filter(p =>
    //         pricerank.includes(p.source_pricerank)
    //     );
    // }

    if(search){
        products = products.filter(p=>
            looseMatch(p.product_name,search)
        );
    }

    // Sort data
    if (sort === 'price_low_to_high') {
        products = products.sort((a, b) => parseFloat(a.store_price) - parseFloat(b.store_price));
    } else if (sort === 'price_high_to_low') {
        products = products.sort((a, b) => parseFloat(b.store_price) - parseFloat(a.store_price));
    } else if (sort === 'pricerank_low_to_high') {
        products = products.sort((a, b) => parseInt(a.store_pricerank?.split("/")[0]) - parseInt(b.store_pricerank?.split("/")[0]));
    } else if (sort === 'pricerank_high_to_low') {
        products = products.sort((a, b) => parseInt(b.store_pricerank?.split("/")[0]) - parseInt(a.store_pricerank?.split("/")[0]));
    }

    let paginatedProducts=products;

    let product_count , cheapest_count = 0, midrange_count = 0, expensive_count = 0,store_stats={},terminal_stats={};
   
    for(let i=0;i<products?.length;i++){
        let maxrank = 0, sourcerank = 0, isConsidered=false;

        for(let j=0;j<products[i]?.products_data?.length;j++){

            if(parseInt(products[i]?.products_data[j]?.pricerank?.split("/")[0]) > maxrank) maxrank =  parseInt(products[i]?.products_data[j]?.pricerank?.split("/")[0]);

            if(products[i]?.products_data[j]?.store_name == products[i]?.store_name) {
                sourcerank = parseInt(products[i]?.products_data[j]?.pricerank?.split("/")[0]);
            }
        }

        if(!store_stats[products[i]?.store_name]) 
        store_stats[products[i]?.store_name] = { 
            store: products[i]?.store_name,
            terminal: products[i]?.terminal_name,
            cheapest_count: 0,
            midrange_count: 0,
            expensive_count: 0,
            pricerank_wise_product_count:{1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0}
        }

        if(!terminal_stats[products[i]?.terminal_name]) 
        terminal_stats[products[i]?.terminal_name] = { 
            terminal: products[i]?.terminal_name,
            cheapest_count: 0,
            midrange_count: 0,
            expensive_count: 0,
            pricerank_wise_product_count:{1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0}
        }

        if(sourcerank == 1) {
            if((!pricerange || pricerange=="cheapest")){
                cheapest_count+=1;
                store_stats[products[i]?.store_name].cheapest_count+=1;
                terminal_stats[products[i]?.terminal_name].cheapest_count+=1;
                products[i].price_range = "cheapest";
                isConsidered=true;
            }
        }
        else if(sourcerank == maxrank){ 
            if(!pricerange || pricerange=="expensive"){
                expensive_count +=1;
                store_stats[products[i]?.store_name].expensive_count+=1;
                terminal_stats[products[i]?.terminal_name].expensive_count+=1;
                products[i].price_range = "expensive";
                isConsidered=true;
            }
        }
        else{
            if((!pricerange || pricerange=="midrange")){
                midrange_count +=1;
                store_stats[products[i]?.store_name].midrange_count+=1;
                terminal_stats[products[i]?.terminal_name].midrange_count+=1;
                products[i].price_range = "midrange";
                isConsidered=true;
            }
        }

        if(isConsidered){

            if(!store_stats[products[i]?.store_name].pricerank_wise_product_count[sourcerank]) store_stats[products[i]?.store_name].pricerank_wise_product_count[sourcerank]=1;
            else  store_stats[products[i]?.store_name].pricerank_wise_product_count[sourcerank]+=1;

            if(!terminal_stats[products[i]?.terminal_name].pricerank_wise_product_count[sourcerank]) terminal_stats[products[i]?.terminal_name].pricerank_wise_product_count[sourcerank]=1;
            else  terminal_stats[products[i]?.terminal_name].pricerank_wise_product_count[sourcerank]+=1;
        }
    }

    if(pricerange){
        products = products.filter(p=>
            p.price_range==pricerange
        );
    }

    product_count = products?.length;

    store_stats = Object.keys(store_stats)?.map(key=>{
        let data = store_stats[key];
        data.pricerank_wise_product_count = Object.keys(data.pricerank_wise_product_count).map(el=>data.pricerank_wise_product_count[el]);
        return data;
    })

    terminal_stats = Object.keys(terminal_stats)?.map(key=>{
        let data = terminal_stats[key];
        data.pricerank_wise_product_count = Object.keys(data.pricerank_wise_product_count).map(el=>data.pricerank_wise_product_count[el]);
        return data;
    })

    store_stats = store_stats.filter(el=>(el?.cheapest_count+el?.midrange_count+el?.expensive_count)!==0);
    terminal_stats = terminal_stats.filter(el=>(el?.cheapest_count+el?.midrange_count+el?.expensive_count)!==0);


    paginatedProducts = products.slice(offset, offset + limit);

    // Send response
    return res.status(200).json({
        status: "success",
        message: `All products for auckland fetched successfully`,
        stats:{
            productCount:product_count,
            cheapestProducts:cheapest_count,
            midrangeProducts:midrange_count,
            expensiveProducts:expensive_count,
            stores:store_stats?.length,
            terminals:terminal_stats?.length
        },
        store_stats,
        terminal_stats,
        data: paginatedProducts,
    });

});