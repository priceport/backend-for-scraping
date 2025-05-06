const pool = require("../configs/postgresql.config");
const catchAsync = require("../utils/catchAsync");
const xlsx = require('xlsx');
const fs = require('fs');
const AppError = require("../utils/appError");
const redisClient = require("../configs/redis.config");
const isBodyComplete = require("../utils/isBodyComplete");
const precomputeDailyDataFNB = require("../helpers/precomputeDailyDataFNB");
const { v4: uuidv4 } = require('uuid');

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
        const name = row['name'];
        const store = row['store'];
        const note = row['note'];
        const type = row['type'];
        const description = row['description'];
        const terminal = row['terminal'];
        const canprod_id = row['cannonical_id'];
        const price = row['price'];

        if (!price || !name  || !terminal) {
            console.warn('Skipping row with missing required fields:', row);
            continue;
        }

        let terminalData = await pool.query(`SELECT * FROM terminal where name=$1 and location=$2;`,[terminal,"AUCKLAND"]);

        if(!terminalData||terminalData?.rows?.length==0){
            terminalData = await pool.query('insert into terminal(name, location) VALUES($1,$2) RETURNING *;',[terminal,"AUCKLAND"])
        }

        let storeData = await pool.query(`SELECT * FROM store where name=$1 and terminal_id=$2;`,[store,terminalData?.rows[0]?.id]);

        if(!storeData||storeData?.rows?.length==0){
            storeData = await pool.query(`insert into store(name,terminal_id) values($1,$2) RETURNING *;`,[store,terminalData?.rows[0]?.id]);
        }
   
        let productData = await pool.query(`SELECT * FROM product_fnb where name=$1 and store_id=$2 and terminal_id=$3;`,[name,storeData?.rows[0]?.id,terminalData?.rows[0]?.id]);

        if(!productData||productData?.rows?.length==0){
            productData = await pool.query(`insert into product_fnb(name, store_id, note, type, description, terminal_id, canprod_id) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,[name, storeData?.rows[0]?.id, note, type, description, terminalData?.rows[0]?.id, canprod_id]);
        } 


        await pool.query(`INSERT INTO price_fnb (product_id, date, price) VALUES ($1, CURRENT_DATE, $2);`, [productData?.rows[0]?.id, price]);
    }
    precomputeDailyDataFNB('aelia_auckland');
    redisClient.del("/api/v1/fnbproduct/terminal?admin=true");
    redisClient.del("/api/v1/fnbproduct/store?admin=true");

    fs.unlinkSync(req.file.path); // Clean up uploaded file
    res.status(200).send('File processed successfully.');
});

function uniqueCanprodObjects(arr) {
    const seen = new Set();
    return arr.filter(obj => {
      if (!seen.has(obj.canprod_id)) {
        seen.add(obj.canprod_id);
        return true;
      }
      return false;
    });
  }

exports.getAllFnbProductsFor = catchAsync(async (req,res,next)=>{
    const limit = parseInt(req.query.limit, 10) || 1000;
    const offset = parseInt(req.query.offset, 10) || 0;
    const terminal = req.query.terminal?.split(",") || null;
    const store = req.query.store?.split(",") || null;
    const sort = req.query.sort || 'price_low_to_high';
    const search = req.query.search || null;
    const pricerange = req.query.pricerange || null;
    const admin = req.query.admin;

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

    products = products?.map(p=>{
        let products_data = p.products_data;

        let newStore = store?.map(s => decodeURIComponent(s?.trim()));
        let newTerminal = terminal?.map(t => t?.trim());

        if(newTerminal)
        products_data = products_data?.filter(p=>[...newTerminal,"OTHERS"]?.includes(p?.terminal_name?.trim()));

        if(newStore)
        products_data = products_data?.filter(p=>newStore?.includes(p?.store_name?.trim())||p?.terminal_name=="OTHERS");

        return {...p,products_data};
    })

    products = products?.filter(p=>store?.map(s => decodeURIComponent(s?.trim()))?.includes(p?.store_name?.trim()));
    // products?.forEach(p=>console.log(p?.products_data));

    
    // if(terminal){
    //     products=products?.filter(product=>terminal.includes(product?.terminal_name?.trim()))
    // }

    // if(store){
    //     let newStore = store?.map(s => decodeURIComponent(s));

    //     products=products?.filter(product=>{
    //         return newStore.includes(product?.store_name?.trim())
    //     })
    // }

    // Remove products where all products_data entries were filtered out
    // products = products.filter(p => p.products_data.length > 1);

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

    for(let i = 0;i<products?.length;i++){
        products[i].products_data.sort((a, b) => a.latest_price - b.latest_price);

        let prank = 1, plength = 0, lastprice=0,source_pricerank,total_price=0,source_price;

        for(let j=0;j<products[i]?.products_data?.length;j++){
            if(j==0){
                products[i].products_data[j].pricerank = `${prank}/${products[i]?.products_data?.length}`;
                lastprice = products[i].products_data[j].latest_price;
                if(products[i]?.products_data[j]?.store_name!==products[i]?.store_name) total_price+= parseFloat(products[i].products_data[j].latest_price);
            }
            else{
                if(lastprice==products[i].products_data[j].latest_price){
                    products[i].products_data[j].pricerank = `${prank}/${products[i]?.products_data?.length}`;
                    plength+=1;
                }
                else{
                    prank+=(1+plength);
                    products[i].products_data[j].pricerank = `${prank}/${products[i]?.products_data?.length}`;
                    plength=0;
                    lastprice=products[i].products_data[j].latest_price;
                }
                if(products[i]?.products_data[j]?.store_name!==products[i]?.store_name) total_price+= parseFloat(products[i].products_data[j].latest_price);
            }
        }

        products[i].average = total_price / (products[i]?.products_data?.length - 1)
        console.log(total_price / (products[i]?.products_data?.length - 1),products[i].average);
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
    } else if(sort == 'difference_low_to_high'){
        products = products.sort((a, b) => a.difference - b.difference);
    } else if(sort == 'difference_high_to_low'){
        products = products.sort((a, b) => b.difference - a.difference);
    } else if(sort == 'difference_percentage_low_to_high'){
        products = products.sort((a, b) => a.difference_percentage - b.difference_percentage);
    } else if(sort == 'difference_percentage_high_to_low'){
        products = products.sort((a, b) => b.difference_percentage - a.difference_percentage);
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
        if(!store_stats[products[i]?.store_name?.trim()]) 
        store_stats[products[i]?.store_name?.trim()] = { 
            store: products[i]?.store_name?.trim(),
            terminal: products[i]?.terminal_name?.trim(),
            cheapest_count: 0,
            midrange_count: 0,
            expensive_count: 0,
            pricerank_wise_product_count:{1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0}
        }

        if(!terminal_stats[products[i]?.terminal_name?.trim()]) 
        terminal_stats[products[i]?.terminal_name?.trim()] = { 
            terminal: products[i]?.terminal_name?.trim(),
            cheapest_count: 0,
            midrange_count: 0,
            expensive_count: 0,
            pricerank_wise_product_count:{1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0}
        }

        if(sourcerank == 1) {
            if((!pricerange || pricerange=="cheapest")){
                cheapest_count+=1;
                store_stats[products[i]?.store_name?.trim()].cheapest_count+=1;
                terminal_stats[products[i]?.terminal_name?.trim()].cheapest_count+=1;
                products[i].price_range = "cheapest";
                isConsidered=true;
            }
        }
        else if(sourcerank == maxrank){ 
            if(!pricerange || pricerange=="expensive"){
                expensive_count +=1;
                store_stats[products[i]?.store_name?.trim()].expensive_count+=1;
                terminal_stats[products[i]?.terminal_name?.trim()].expensive_count+=1;
                products[i].price_range = "expensive";
                isConsidered=true;
            }
        }
        else{
            if((!pricerange || pricerange=="midrange")){
                midrange_count +=1;
                store_stats[products[i]?.store_name?.trim()].midrange_count+=1;
                terminal_stats[products[i]?.terminal_name?.trim()].midrange_count+=1;
                products[i].price_range = "midrange";
                isConsidered=true;
            }
        }

        if(isConsidered){

            if(!store_stats[products[i]?.store_name?.trim()].pricerank_wise_product_count[sourcerank]) store_stats[products[i]?.store_name?.trim()].pricerank_wise_product_count[sourcerank]=1;
            else  store_stats[products[i]?.store_name?.trim()].pricerank_wise_product_count[sourcerank]+=1;

            if(!terminal_stats[products[i]?.terminal_name?.trim()].pricerank_wise_product_count[sourcerank]) terminal_stats[products[i]?.terminal_name?.trim()].pricerank_wise_product_count[sourcerank]=1;
            else  terminal_stats[products[i]?.terminal_name?.trim()].pricerank_wise_product_count[sourcerank]+=1;
        }
    }

    if(pricerange){
        products = products.filter(p=>
            p.price_range==pricerange
        );
    }

    if(admin){
        products = uniqueCanprodObjects(products);
    }
    
    if(products){
        products = products?.filter(p=>p?.products_data?.length> 0)
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


    let totals = products.length;
    paginatedProducts = products.slice(offset, offset + limit);

    // Send response
    return res.status(200).json({
        status: "success",
        message: `All products for auckland fetched successfully`,
        stats:{
            productCount:totals,
            cheapestProducts:cheapest_count,
            midrangeProducts:midrange_count,
            expensiveProducts:expensive_count,
            stores:store_stats?.length,
            terminals:terminal_stats?.length
        },
        store_stats:store_stats,
        terminal_stats:terminal_stats,
        data: paginatedProducts,
        totals
    });

});

exports.getAllStores = catchAsync(async (req,res,next)=>{
    let data;
    if(!req.query.admin)
    data = await pool.query(`SELECT DISTINCT name, id  
    FROM store 
    WHERE terminal_id != 8 
    ORDER BY name ASC;
    `);
    else
    data = await pool.query(`SELECT DISTINCT name, id  
    FROM store 
    ORDER BY name ASC;
    `);

    return res.status(200).json({
        status:"success",
        message:"All stores fetched",
        data:data?.rows
    })
})

exports.getAllTerminal = catchAsync(async (req,res,next)=>{

    let data;
    if(!req.query.admin)
    data = await pool.query(`SELECT DISTINCT name, id  
    FROM terminal 
    WHERE id != 8 
    ORDER BY name ASC;
    `);
    else
    data = await pool.query(`SELECT DISTINCT name, id  
    FROM terminal 
    ORDER BY name ASC;
    `);

    return res.status(200).json({
        status:"success",
        message:"All terminal fetched",
        data:data?.rows
    })
})

exports.getPriceHistory = catchAsync(async (req,res,next)=>{
    const canprod_id = req?.params?.canprod_id;

    if(!canprod_id){
        return next(
            new AppError(`canprod_id required!`,400)
        )
    }
    const data = await pool.query(`
        SELECT 
        p.canprod_id,
        p.name AS product_title,
        ph.date AS price_date,
        ph.price AS product_price,
        s.name AS store
    FROM 
        product_fnb p
    JOIN 
        store s
    ON 
       p.store_id = s.id
    JOIN 
        price_fnb ph 
    ON 
        p.id = ph.product_id
    WHERE 
        p.canprod_id = $1
    ORDER BY 
        ph.date ASC;
    `,[canprod_id]);

    const outputData = {};

    for(let i=0;i<data?.rows?.length;i++){
        if(!outputData[data?.rows[i]?.store]) outputData[data?.rows[i]?.store] = {};

        if(!outputData[data?.rows[i]?.store][data?.rows[i]?.product_title]) outputData[data?.rows[i]?.store][data?.rows[i]?.product_title] = [];
        outputData[data?.rows[i]?.store][data?.rows[i]?.product_title].push(data?.rows[i]);
    }

    return res.status(200).json({
        status:"success",
        message:"Price history fetched succesfully!",
        data:outputData
    })
})

exports.editProduct = catchAsync(async (req,res,next)=>{
    const isComplete = isBodyComplete(req, ["name", "store_id","terminal_id","price","note","description","type"]);
    if (!isComplete[0]) {
        return next(
            new AppError(`${isComplete[1]} missing from request body!`, 400)
        );
    }

    const data = await pool.query(`update product_fnb
    set
        name = $1,
        store_id = $2,
        terminal_id = $3,
        note = $4,
        description = $5,
        type = $6
    where
        id = $7
    returning *;
    `,[req.body.name,req.body.store_id,req.body.terminal_id,req.body.note,req.body.description,req.body.type,req.params.id]);

    const price = await pool.query(`update price_fnb
    set
        price = $1
    where
        product_id = $2
    AND date = (
        SELECT MAX(date) FROM price_fnb WHERE product_id = $2
    )
    returning *;
    `,[req.body.price,req.params.id])

    precomputeDailyDataFNB('aelia_auckland');

    return res.status(200).json({
        status:"success",
        message:"Product edited succesfully",
        data:{
            product:data.rows[0],
            price:price.rows[0]
        }
    });
})

exports.changeProductComplainceStatus = catchAsync(async (req,res,next)=>{
    if(req.body.complaint===undefined){
        return next(
            new AppError(`complaint missing from request body!`, 400)
        );
    }

    const data = await pool.query(`update product_fnb
    set
        compliant = $1
    where
        id = $2
    returning *;
    `,[req.body.complaint,req.params.id]);

    precomputeDailyDataFNB('aelia_auckland');

    return res.status(200).json({
        status:"success",
        message:"Product complaince changed succesfully",
        data:data.rows
    });
})

exports.removeMapping = catchAsync(async (req,res,next)=>{
    const data = await pool.query(`
    update product_fnb 
    set canprod_id = null
    where 
      id = $1
    returning *;`,
    [req.params.id]);

    precomputeDailyDataFNB('aelia_auckland');

    return res.status(200).json({
        status:"success",
        message:"Mapping removed succesfully",
        data:data.rows
    })
})

exports.addProduct = catchAsync(async (req, res, next) => {
    const {
      name,
      store_id,
      note,
      type,
      description,
      terminal_id,
      canprod_id,
      price,
    } = req.body;
  
    const compliant = req.body.compliant ?? false;
    let finalCanprodId = canprod_id;
  
    // If no canprod_id is provided, get the max and increment
    if (!finalCanprodId) {
      const maxResult = await pool.query(
        `SELECT MAX(canprod_id) as max_id FROM product_fnb;`
      );
      finalCanprodId = (maxResult.rows[0].max_id || 0) + 1;
    }
  
    // Insert product
    const productResult = await pool.query(
      `INSERT INTO product_fnb 
        (name, store_id, note, type, description, terminal_id, canprod_id, compliant, created_at, last_checked)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *;`,
      [name, store_id, note, type, description, terminal_id, finalCanprodId, compliant]
    );
  
    const product = productResult.rows[0];
  
    // Insert price
    const priceResult = await pool.query(
      `INSERT INTO price_fnb 
        (date, product_id, price)
       VALUES 
        (NOW(), $1, $2)
       RETURNING *;`,
      [product.id, price]
    );

    precomputeDailyDataFNB('aelia_auckland');
  
    return res.status(201).json({
      status: "success",
      message: "Product and price added successfully",
      data: {
        product: product,
        price: priceResult.rows[0]
      }
    });
  });