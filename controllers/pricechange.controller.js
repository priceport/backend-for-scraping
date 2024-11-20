const pool = require("../configs/postgresql.config");
const catchAsync = require("../utils/catchAsync");

exports.priceChangeGraph = catchAsync(async (req,res,next)=>{

    const start_date = req?.query?.start_date;
    const end_date = req?.query?.end_date;

    let query,queryArr=[];

    if(start_date&&end_date){
        query=`WITH DateRange AS (
            SELECT 
                $1::date AS start_date, -- Custom start date
                $2::date AS end_date   -- Custom end date
        ),
        TenDates AS (
            SELECT 
                start_date + ((n * (end_date - start_date) / 10) * INTERVAL '1 day') AS snapshot_date
            FROM DateRange, generate_series(1, 10) n
        ),
        PriceChanges AS (
            SELECT 
                pfa.date AS current_date,
                pfa.prod_id,
                pfa.price AS current_price,
                LAG(pfa.price) OVER (PARTITION BY pfa.prod_id ORDER BY pfa.date) AS previous_price
            FROM price_from_aelia_auckland pfa
        ),
        ChangeCounts AS (
            SELECT 
                td.snapshot_date::date AS snapshot_date,
                COUNT(CASE WHEN pc.current_price > pc.previous_price THEN 1 END) AS increased_count,
                COUNT(CASE WHEN pc.current_price < pc.previous_price THEN 1 END) AS decreased_count
            FROM TenDates td
            LEFT JOIN PriceChanges pc
                ON pc.current_date = td.snapshot_date::date
            GROUP BY td.snapshot_date
        )
        SELECT 
            snapshot_date,
            COALESCE(increased_count, 0) AS increased_count,
            COALESCE(decreased_count, 0) AS decreased_count
        FROM ChangeCounts
        ORDER BY snapshot_date;
        `;
        queryArr=[start_date,end_date];
    }
    else{
        query=`WITH DateRange AS (
            SELECT 
                MIN(date) AS start_date,
                MAX(date) AS end_date
            FROM price_from_aelia_auckland
        ),
        TenDates AS (
            SELECT 
                start_date + ((n * (end_date - start_date) / 10) * INTERVAL '1 day') AS snapshot_date
            FROM DateRange, generate_series(1, 10) n
        ),
        PriceChanges AS (
            SELECT 
                pfa.date AS current_date,
                pfa.prod_id,
                pfa.price AS current_price,
                LAG(pfa.price) OVER (PARTITION BY pfa.prod_id ORDER BY pfa.date) AS previous_price
            FROM price_from_aelia_auckland pfa
        ),
        ChangeCounts AS (
            SELECT 
                td.snapshot_date::date AS snapshot_date,
                COUNT(CASE WHEN pc.current_price > pc.previous_price THEN 1 END) AS increased_count,
                COUNT(CASE WHEN pc.current_price < pc.previous_price THEN 1 END) AS decreased_count,
                COUNT(CASE WHEN pc.current_price = pc.previous_price THEN 1 END) AS same_count
            FROM TenDates td
            LEFT JOIN PriceChanges pc
                ON pc.current_date = td.snapshot_date::date
            GROUP BY td.snapshot_date
        )
        SELECT 
            snapshot_date,
            COALESCE(increased_count, 0) AS increased_count,
            COALESCE(decreased_count, 0) AS decreased_count
        FROM ChangeCounts
        ORDER BY snapshot_date;`
    }

    const data = await pool.query(query,queryArr);

    return res.status(200).json({
        status:"success",
        message:"Price changes graph fetched succesfully",
        data:data.rows
    })
});

exports.getLivePriceChanges = catchAsync(async (req,res,next)=>{

    let limit = req?.query?.limit;
    let offset = req?.query?.offset;
    let category = req?.query?.category?.split(",");
    let brand = req?.query?.brand?.split(",");
    let start_date = req?.query?.start_date;
    let end_date = req?.query?.end_date;
    let locations = req?.query?.locations?.split(",");

    let query=``;
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="auckland")!=-1){
        query+=`
        SELECT
        paa.*,
        ppaa.date AS new_price_date,
        ppaa.price AS new_price,
        LAG(ppaa.price) OVER (PARTITION BY ppaa.prod_id ORDER BY ppaa.date ASC) AS old_price, -- ASC ensures earlier dates come first
        paa.canprod_id AS source_canprod_id
        FROM price_from_aelia_auckland ppaa
        JOIN product_from_aelia_auckland paa
        ON ppaa.prod_id = paa.id
        WHERE 
        ($1::TEXT[] IS NULL OR paa.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR paa.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="christchurch")!=-1){
        query+=`
        SELECT
        pac.*,
        ppac.date AS new_price_date,
        ppac.price AS new_price,
        LAG(ppac.price) OVER (PARTITION BY ppac.prod_id ORDER BY ppac.date ASC) AS old_price, -- ASC ensures earlier dates come first
        pac.canprod_id AS source_canprod_id
        FROM price_from_aelia_christchurch ppac
        JOIN product_from_aelia_christchurch pac
        ON ppac.prod_id = pac.id
        WHERE 
        ($1::TEXT[] IS NULL OR pac.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR pac.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="beauty_bliss")!=-1){
        query+=`
        SELECT
        pbb.*,
        ppbb.date AS new_price_date,
        ppbb.price AS new_price,
        LAG(ppbb.price) OVER (PARTITION BY ppbb.prod_id ORDER BY ppbb.date ASC) AS old_price, -- ASC ensures earlier dates come first
        pbb.canprod_id AS source_canprod_id
        FROM price_from_beauty_bliss ppbb
        JOIN product_from_beauty_bliss pbb
        ON ppbb.prod_id = pbb.id
        WHERE 
        ($1::TEXT[] IS NULL OR pbb.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR pbb.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="big_barrel")!=-1){
        query+=`
        SELECT
        pbab.*,
        ppbab.date AS new_price_date,
        ppbab.price AS new_price,
        LAG(ppbab.price) OVER (PARTITION BY ppbab.prod_id ORDER BY ppbab.date ASC) AS old_price, -- ASC ensures earlier dates come first
        pbab.canprod_id AS source_canprod_id
        FROM price_from_big_barrel ppbab
        JOIN product_from_big_barrel pbab
        ON ppbab.prod_id = pbab.id
        WHERE 
        ($1::TEXT[] IS NULL OR pbab.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR pbab.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="chemist_warehouse")!=-1){
        query+=`
        SELECT
        pcw.*,
        ppcw.date AS new_price_date,
        ppcw.price AS new_price,
        LAG(ppcw.price) OVER (PARTITION BY ppcw.prod_id ORDER BY ppcw.date ASC) AS old_price, -- ASC ensures earlier dates come first
        pcw.canprod_id AS source_canprod_id
        FROM price_from_chemist_warehouse ppcw
        JOIN product_from_chemist_warehouse pcw
        ON ppcw.prod_id = pcw.id
        WHERE 
        ($1::TEXT[] IS NULL OR pcw.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR pcw.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="farmers")!=-1){
        query+=`
        SELECT
        pf.*,
        ppf.date AS new_price_date,
        ppf.price AS new_price,
        LAG(ppf.price) OVER (PARTITION BY ppf.prod_id ORDER BY ppf.date ASC) AS old_price, -- ASC ensures earlier dates come first
        pf.canprod_id AS source_canprod_id
        FROM price_from_farmers ppf
        JOIN product_from_farmers pf
        ON ppf.prod_id = pf.id
        WHERE 
        ($1::TEXT[] IS NULL OR pf.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR pf.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="brisbane")!=-1){
        query+=`
        SELECT
        plb.*,
        pplb.date AS new_price_date,
        pplb.price AS new_price,
        LAG(pplb.price) OVER (PARTITION BY pplb.prod_id ORDER BY pplb.date ASC) AS old_price, -- ASC ensures earlier dates come first
        plb.canprod_id AS source_canprod_id
        FROM price_from_lotte_brisbane pplb
        JOIN product_from_lotte_brisbane plb
        ON pplb.prod_id = plb.id
        WHERE 
        ($1::TEXT[] IS NULL OR plb.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR plb.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="mecca")!=-1){
        query+=`
        SELECT
        pm.*,
        ppm.date AS new_price_date,
        ppm.price AS new_price,
        LAG(ppm.price) OVER (PARTITION BY ppm.prod_id ORDER BY ppm.date ASC) AS old_price, -- ASC ensures earlier dates come first
        pm.canprod_id AS source_canprod_id
        FROM price_from_mecca ppm
        JOIN product_from_mecca pm
        ON ppm.prod_id = pm.id
        WHERE 
        ($1::TEXT[] IS NULL OR pm.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR pm.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="nz_liquor")!=-1){
        query+=`
        SELECT
        pnzl.*,
        ppnzl.date AS new_price_date,
        ppnzl.price AS new_price,
        LAG(ppnzl.price) OVER (PARTITION BY ppnzl.prod_id ORDER BY ppnzl.date ASC) AS old_price, -- ASC ensures earlier dates come first
        pnzl.canprod_id AS source_canprod_id
        FROM price_from_nzliquor ppnzl
        JOIN product_from_nzliquor pnzl
        ON ppnzl.prod_id = pnzl.id
        WHERE 
        ($1::TEXT[] IS NULL OR pnzl.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR pnzl.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="sephora")!=-1){
        query+=`
        SELECT
        ps.*,
        pps.date AS new_price_date,
        pps.price AS new_price,
        LAG(pps.price) OVER (PARTITION BY pps.prod_id ORDER BY pps.date ASC) AS old_price, -- ASC ensures earlier dates come first
        ps.canprod_id AS source_canprod_id
        FROM price_from_sephora pps
        JOIN product_from_sephora ps
        ON pps.prod_id = ps.id
        WHERE 
        ($1::TEXT[] IS NULL OR ps.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR ps.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="whisky_and_more")!=-1){
        query+=`
        SELECT
        pwam.*,
        ppwam.date AS new_price_date,
        ppwam.price AS new_price,
        LAG(ppwam.price) OVER (PARTITION BY ppwam.prod_id ORDER BY ppwam.date ASC) AS old_price, -- ASC ensures earlier dates come first
        pwam.canprod_id AS source_canprod_id
        FROM price_from_whisky_and_more ppwam
        JOIN product_from_whisky_and_more pwam
        ON ppwam.prod_id = pwam.id
        WHERE 
        ($1::TEXT[] IS NULL OR pwam.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR pwam.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="sydney")!=-1){
        query+=`
        SELECT
        pws.*,
        ps.date AS new_price_date,
        ps.price AS new_price,
        LAG(ps.price) OVER (PARTITION BY ps.prod_id ORDER BY ps.date ASC) AS old_price, -- ASC ensures earlier dates come first
        pws.canprod_id AS source_canprod_id
        FROM price_from_heinemann_sydney ps
        JOIN product_from_heinemann_sydney pws
        ON ps.prod_id = pws.id
        WHERE 
        ($1::TEXT[] IS NULL OR pws.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR pws.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="melbourne")!=-1){
        query+=`
        SELECT
        pwm.*,
        pm.date AS new_price_date,
        pm.price AS new_price,
        LAG(pm.price) OVER (PARTITION BY pm.prod_id ORDER BY pm.date ASC) AS old_price,
        pwm.canprod_id AS source_canprod_id
        FROM price_from_lotte_melbourne pm
        JOIN product_from_lotte_melbourne pwm
        ON pm.prod_id = pwm.id
        WHERE 
        ($1::TEXT[] IS NULL OR pwm.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR pwm.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }
    if(!locations||locations[0]=="all"||locations?.findIndex(el=>el=="queenstown")!=-1){
        query+=`
        SELECT
        pwq.*,
        pq.date AS new_price_date,
        pq.price AS new_price,
        LAG(pq.price) OVER (PARTITION BY pq.prod_id ORDER BY pq.date ASC) AS old_price,
        pwq.canprod_id AS source_canprod_id
    FROM price_from_aelia_queensland pq
    JOIN product_from_aelia_queensland pwq
        ON pq.prod_id = pwq.id
        WHERE 
        ($1::TEXT[] IS NULL OR pwq.brand = ANY($1)) -- Filter by brand
        AND ($2::TEXT[] IS NULL OR pwq.category = ANY($2)) -- Filter by category
        UNION ALL`;
    }

    if(query?.length!=0) query = query.replace(/\s*UNION ALL\s*$/i, "")
    
    const data = await pool.query(`
    WITH SourcePriceChanges AS (
        ${query}
    ),
    FilteredChanges AS (
        SELECT *
        FROM SourcePriceChanges
        WHERE old_price IS NOT NULL -- Ensure there’s a previous price
          AND new_price != old_price -- Include only if the price actually changed
          AND ($3::DATE IS NULL OR new_price_date >= $3) -- Start date filter
          AND ($4::DATE IS NULL OR new_price_date <= $4) -- End date filter
    ),
    LatestAucklandPrices AS (
        SELECT
            pfa.id AS auckland_prod_id,
            pfa.canprod_id AS auckland_canprod_id,
            pfaa.price AS latest_auckland_price
        FROM product_from_aelia_auckland pfa
        JOIN price_from_aelia_auckland pfaa
            ON pfaa.prod_id = pfa.id
        WHERE pfaa.date = (SELECT MAX(date) FROM price_from_aelia_auckland WHERE prod_id = pfa.id)
    )
    SELECT 
        fsc.*,
        fsc.new_price_date,
        fsc.new_price,
        fsc.old_price,
        lap.latest_auckland_price
    FROM FilteredChanges fsc
    LEFT JOIN LatestAucklandPrices lap
        ON fsc.source_canprod_id = lap.auckland_canprod_id
    ORDER BY fsc.new_price_date DESC
    LIMIT $5 OFFSET $6;    
    `,[brand, category,start_date, end_date, limit,offset]);

    return res.status(200).json({
        status:"success",
        message:"Live price monitoring",
        data:data.rows
    })
})