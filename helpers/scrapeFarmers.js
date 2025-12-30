//scraping script imports
const blushers_bronzers = require("../scripts/scraping_scripts/domestic/farmers/blushers_bronzers");
const makeup_brushes_tools = require("../scripts/scraping_scripts/domestic/farmers/makeup_brushes_tools");
const womens_perfumes = require("../scripts/scraping_scripts/domestic/farmers/womens_perfumes");
const mens_aftershaves_cologne = require("../scripts/scraping_scripts/domestic/farmers/mens_aftershaves_cologne");
const deodorants_body_sprays = require("../scripts/scraping_scripts/domestic/farmers/deodorants_body_sprays");
const rollerballs = require("../scripts/scraping_scripts/domestic/farmers/rollerballs");
const moisturisers_serums_anti_aging = require("../scripts/scraping_scripts/domestic/farmers/moisturisers_serums_anti_aging");
const cleansers_makeup_removers = require("../scripts/scraping_scripts/domestic/farmers/cleansers_makeup_removers");
const treatments_masks = require("../scripts/scraping_scripts/domestic/farmers/treatments_masks");
const mens_skincare_grooming = require("../scripts/scraping_scripts/domestic/farmers/mens_skincare_grooming");
const skincare_ingredients = require("../scripts/scraping_scripts/domestic/farmers/skincare_ingredients");
const nail_polish = require("../scripts/scraping_scripts/domestic/farmers/nail_polish");
const nail_care_tools = require("../scripts/scraping_scripts/domestic/farmers/nail_care_tools");
const body_care = require("../scripts/scraping_scripts/domestic/farmers/body_care");
const hand_foot_care = require("../scripts/scraping_scripts/domestic/farmers/hand_foot_care");
const bath_shower_care = require("../scripts/scraping_scripts/domestic/farmers/bath_shower_care");
const suncare_tanning = require("../scripts/scraping_scripts/domestic/farmers/suncare_tanning");
const hair_care_brushes = require("../scripts/scraping_scripts/domestic/farmers/hair_care_brushes");
const hair_colour = require("../scripts/scraping_scripts/domestic/farmers/hair_colour");
const hair_accessories = require("../scripts/scraping_scripts/domestic/farmers/hair_accessories");
const collagens = require("../scripts/scraping_scripts/domestic/farmers/collagens");
const sleep = require("../scripts/scraping_scripts/domestic/farmers/sleep");
const exfoliators = require("../scripts/scraping_scripts/domestic/farmers/exfoliators");
const eye_cream = require("../scripts/scraping_scripts/domestic/farmers/eye_cream");
const eyes = require("../scripts/scraping_scripts/domestic/farmers/eyes");
const face = require("../scripts/scraping_scripts/domestic/farmers/face");
const lips = require("../scripts/scraping_scripts/domestic/farmers/lips");
const makeup_bags = require("../scripts/scraping_scripts/domestic/farmers/makeup_bags");
const toners = require("../scripts/scraping_scripts/domestic/farmers/toners");

const puppeteer = require('puppeteer');

//processing script imports
const processDataForBeauty = require("./data_processing/farmers/beauty");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/farmers/beauty");

const scrapeFarmers = async (start, end, state) => {
    console.log("scraping started for farmers at:" + Date.now());

    const BRIGHT_DATA_WS = process.env.BRIGHT_DATA_WS;
    if (!BRIGHT_DATA_WS) {
        console.log('BRIGHT_DATA_WS environment variable is required');
        return true;
    }

    // CRITICAL: Bright Data Browser API allows only 1 navigation per browser instance
    // Solution: Create a NEW browser for EACH category
    let categoryCount = 0;
    
    const createBrowserForCategory = async () => {
        categoryCount++;
        try {
            const browser = await puppeteer.connect({
                browserWSEndpoint: BRIGHT_DATA_WS,
            });
            return browser;
        } catch (err) {
            logError(err);
            throw new Error(`Failed to create browser for category ${categoryCount}`);
        }
    };
    
    const createNewPage = async (browser) => {
        try {
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            return page;
        } catch (err) {
            throw err;
        }
    };
    
    const runCategoryScraper = async (scraperFunc, categoryName, start, end) => {
        let browser = null;
        let page = null;
        try {
            browser = await createBrowserForCategory();
            page = await createNewPage(browser);
            const result = await scraperFunc(start, end, browser, page);
            return result;
        } catch (err) {
            logError(err);
            return [];
        } finally {
            if (page) {
                try {
                    await page.close();
                } catch (e) {
                    // Ignore
                }
            }
            if (browser) {
                try {
                    await browser.close();
                } catch (e) {
                    // Ignore
                }
            }
        }
    };

    try {
        //variable initialization
        let blushersBronzersData = [], makeupBrushesToolsData = [], womensPerfumesData = [], 
            mensAftershavesCologneData = [], deodorantsBodySpraysData = [], rollerballsData = [],
            moisturisersSerumsAntiAgingData = [], cleansersMakeupRemoversData = [], treatmentsMasksData = [],
            mensSkincareGroomingData = [], skincareIngredientsData = [], nailPolishData = [],
            nailCareToolsData = [], bodyCareData = [], handFootCareData = [], bathShowerCareData = [],
            suncareTanningData = [], hairCareBrushesData = [], hairColourData = [], hairAccessoriesData = [],
            collagensData = [], sleepData = [], faceData = [], makeupBagData = [], lipsData = [], 
            eyesData = [], exfoliatorsData = [], tonersData = [], eyeCreamData = [];

        // Face
        if (!state.farmers.face) {
            faceData = await runCategoryScraper(face, 'face', start, end);
            console.log(`${faceData?.length} data items scraped for face`);
        }

        if (!state.farmers.face && faceData?.length == 0) {
            faceData = await runCategoryScraper(face, 'face retry', start, end);
            console.log(`${faceData?.length} data items scraped for face`);
            if (faceData?.length == 0) {
                state.farmers.face = true;
            }
        }

    // Makeup Bags
        if (!state.farmers.makeup) {
            makeupBagData = await runCategoryScraper(makeup_bags, 'makeup bags', start, end);
            console.log(`${makeupBagData?.length} data items scraped for makeup bags`);
        }

        if (!state.farmers.makeup && makeupBagData?.length == 0) {
            makeupBagData = await runCategoryScraper(makeup_bags, 'makeup bags retry', start, end);
            console.log(`${makeupBagData?.length} data items scraped for makeup bags`);
            if (makeupBagData?.length == 0) {
                state.farmers.makeup = true;
            }
        }

    // Lips
        if (!state.farmers.lips) {
            lipsData = await runCategoryScraper(lips, 'lips', start, end);
            console.log(`${lipsData?.length} data items scraped for lips`);
        }

        if (!state.farmers.lips && lipsData?.length == 0) {
            lipsData = await runCategoryScraper(lips, 'lips retry', start, end);
            console.log(`${lipsData?.length} data items scraped for lips`);
            if (lipsData?.length == 0) {
                state.farmers.lips = true;
            }
        }

    // Eyes
        if (!state.farmers.eyes) {
        try {
            eyesData = await runCategoryScraper(eyes, 'eyes', start, end);
            console.log(`${eyesData?.length} data items scraped for eyes`);
        } catch (err) {
            
            logError(err);
        }
        }

        if (!state.farmers.eyes && eyesData?.length == 0) {
        try {
            eyesData = await runCategoryScraper(eyes, 'eyes', start, end);
            console.log(`${eyesData?.length} data items scraped for eyes`);
            if (eyesData?.length == 0) {
                state.farmers.eyes = true;
            }
        } catch (err) {
            
            logError(err);
        }
        }

    // Exfoliators
        if (!state.farmers.exfoliators) {
        try {
            exfoliatorsData = await runCategoryScraper(exfoliators, 'exfoliators', start, end);
            console.log(`${exfoliatorsData?.length} data items scraped for exfoliators`);
        } catch (err) {
            
            logError(err);
        }
        }

        if (!state.farmers.exfoliators && exfoliatorsData?.length == 0) {
        try {
            exfoliatorsData = await runCategoryScraper(exfoliators, 'exfoliators', start, end);
            console.log(`${exfoliatorsData?.length} data items scraped for exfoliators`);
            if (exfoliatorsData?.length == 0) {
                state.farmers.exfoliators = true;
            }
        } catch (err) {
            
            logError(err);
        }
        }

    // Toners
        if (!state.farmers.toners) {
        try {
            tonersData = await runCategoryScraper(toners, 'toners', start, end);
            console.log(`${tonersData?.length} data items scraped for toners`);
        } catch (err) {
            
            logError(err);
        }
        }

        if (!state.farmers.toners && tonersData?.length == 0) {
        try {
            tonersData = await runCategoryScraper(toners, 'toners', start, end);
            console.log(`${tonersData?.length} data items scraped for toners`);
            if (tonersData?.length == 0) {
                state.farmers.toners = true;
            }
        } catch (err) {
            
            logError(err);
        }
        }

    // Eye Cream
        if (!state.farmers.eyecream) {
        try {
            eyeCreamData = await runCategoryScraper(eye_cream, 'eye cream', start, end);
            console.log(`${eyeCreamData?.length} data items scraped for eye cream`);
        } catch (err) {
            
            logError(err);
        }
        }

        if (!state.farmers.eyecream && eyeCreamData?.length == 0) {
        try {
            eyeCreamData = await runCategoryScraper(eye_cream, 'eye cream', start, end);
            console.log(`${eyeCreamData?.length} data items scraped for eye cream`);
            if (eyeCreamData?.length == 0) {
                state.farmers.eyecream = true;
            }
        } catch (err) {
            
            logError(err);
        }
        }

    // Blushers Bronzers
        if (!state.farmers.blushersBronzers) {
            blushersBronzersData = await runCategoryScraper(blushers_bronzers, 'blushers bronzers', start, end);
            console.log(`${blushersBronzersData?.length} data items scraped for blushers bronzers`);
        }

        if (!state.farmers.blushersBronzers && blushersBronzersData?.length == 0) {
            blushersBronzersData = await runCategoryScraper(blushers_bronzers, 'blushers bronzers retry', start, end);
            console.log(`${blushersBronzersData?.length} data items scraped for blushers bronzers`);
            if (blushersBronzersData?.length == 0) {
                state.farmers.blushersBronzers = true;
            }
        }

    // Makeup Brushes Tools
        if (!state.farmers.makeupBrushesTools) {
            makeupBrushesToolsData = await runCategoryScraper(makeup_brushes_tools, 'makeup brushes tools', start, end);
            console.log(`${makeupBrushesToolsData?.length} data items scraped for makeup brushes tools`);
        }

        if (!state.farmers.makeupBrushesTools && makeupBrushesToolsData?.length == 0) {
            makeupBrushesToolsData = await runCategoryScraper(makeup_brushes_tools, 'makeup brushes tools retry', start, end);
            console.log(`${makeupBrushesToolsData?.length} data items scraped for makeup brushes tools`);
            if (makeupBrushesToolsData?.length == 0) {
                state.farmers.makeupBrushesTools = true;
            }
        }

    // Womens Perfumes
        if (!state.farmers.womensPerfumes) {
            womensPerfumesData = await runCategoryScraper(womens_perfumes, 'womens perfumes', start, end);
            console.log(`${womensPerfumesData?.length} data items scraped for womens perfumes`);
        }

        if (!state.farmers.womensPerfumes && womensPerfumesData?.length == 0) {
            womensPerfumesData = await runCategoryScraper(womens_perfumes, 'womens perfumes retry', start, end);
            console.log(`${womensPerfumesData?.length} data items scraped for womens perfumes`);
            if (womensPerfumesData?.length == 0) {
                state.farmers.womensPerfumes = true;
            }
        }

    // Mens Aftershaves Cologne
        if (!state.farmers.mensAftershavesCologne) {
            mensAftershavesCologneData = await runCategoryScraper(mens_aftershaves_cologne, 'mens aftershaves cologne', start, end);
            console.log(`${mensAftershavesCologneData?.length} data items scraped for mens aftershaves cologne`);
        }

        if (!state.farmers.mensAftershavesCologne && mensAftershavesCologneData?.length == 0) {
            mensAftershavesCologneData = await runCategoryScraper(mens_aftershaves_cologne, 'mens aftershaves cologne retry', start, end);
            console.log(`${mensAftershavesCologneData?.length} data items scraped for mens aftershaves cologne`);
            if (mensAftershavesCologneData?.length == 0) {
                state.farmers.mensAftershavesCologne = true;
            }
        }

    // Deodorants Body Sprays
        if (!state.farmers.deodorantsBodySprays) {
            deodorantsBodySpraysData = await runCategoryScraper(deodorants_body_sprays, 'deodorants body sprays', start, end);
            console.log(`${deodorantsBodySpraysData?.length} data items scraped for deodorants body sprays`);
        }

        if (!state.farmers.deodorantsBodySprays && deodorantsBodySpraysData?.length == 0) {
            deodorantsBodySpraysData = await runCategoryScraper(deodorants_body_sprays, 'deodorants body sprays retry', start, end);
            console.log(`${deodorantsBodySpraysData?.length} data items scraped for deodorants body sprays`);
            if (deodorantsBodySpraysData?.length == 0) {
                state.farmers.deodorantsBodySprays = true;
            }
        }

    // Rollerballs
        if (!state.farmers.rollerballs) {
            rollerballsData = await runCategoryScraper(rollerballs, 'rollerballs', start, end);
            console.log(`${rollerballsData?.length} data items scraped for rollerballs`);
        }

        if (!state.farmers.rollerballs && rollerballsData?.length == 0) {
            rollerballsData = await runCategoryScraper(rollerballs, 'rollerballs retry', start, end);
            console.log(`${rollerballsData?.length} data items scraped for rollerballs`);
            if (rollerballsData?.length == 0) {
                state.farmers.rollerballs = true;
            }
        }

    // Moisturisers Serums Anti Aging
        if (!state.farmers.moisturisersSerumsAntiAging) {
            moisturisersSerumsAntiAgingData = await runCategoryScraper(moisturisers_serums_anti_aging, 'moisturisers serums anti aging', start, end);
            console.log(`${moisturisersSerumsAntiAgingData?.length} data items scraped for moisturisers serums anti aging`);
        }

        if (!state.farmers.moisturisersSerumsAntiAging && moisturisersSerumsAntiAgingData?.length == 0) {
            moisturisersSerumsAntiAgingData = await runCategoryScraper(moisturisers_serums_anti_aging, 'moisturisers serums anti aging retry', start, end);
            console.log(`${moisturisersSerumsAntiAgingData?.length} data items scraped for moisturisers serums anti aging`);
            if (moisturisersSerumsAntiAgingData?.length == 0) {
                state.farmers.moisturisersSerumsAntiAging = true;
            }
        }

    // Cleansers Makeup Removers
        if (!state.farmers.cleansersMakeupRemovers) {
            cleansersMakeupRemoversData = await runCategoryScraper(cleansers_makeup_removers, 'cleansers makeup removers', start, end);
            console.log(`${cleansersMakeupRemoversData?.length} data items scraped for cleansers makeup removers`);
        }

        if (!state.farmers.cleansersMakeupRemovers && cleansersMakeupRemoversData?.length == 0) {
            cleansersMakeupRemoversData = await runCategoryScraper(cleansers_makeup_removers, 'cleansers makeup removers retry', start, end);
            console.log(`${cleansersMakeupRemoversData?.length} data items scraped for cleansers makeup removers`);
            if (cleansersMakeupRemoversData?.length == 0) {
                state.farmers.cleansersMakeupRemovers = true;
            }
        }

    // Treatments Masks
        if (!state.farmers.treatmentsMasks) {
            treatmentsMasksData = await runCategoryScraper(treatments_masks, 'treatments masks', start, end);
            console.log(`${treatmentsMasksData?.length} data items scraped for treatments masks`);
        }

        if (!state.farmers.treatmentsMasks && treatmentsMasksData?.length == 0) {
            treatmentsMasksData = await runCategoryScraper(treatments_masks, 'treatments masks retry', start, end);
            console.log(`${treatmentsMasksData?.length} data items scraped for treatments masks`);
            if (treatmentsMasksData?.length == 0) {
                state.farmers.treatmentsMasks = true;
            }
        }

    // Mens Skincare Grooming
        if (!state.farmers.mensSkincareGrooming) {
            mensSkincareGroomingData = await runCategoryScraper(mens_skincare_grooming, 'mens skincare grooming', start, end);
            console.log(`${mensSkincareGroomingData?.length} data items scraped for mens skincare grooming`);
        }

        if (!state.farmers.mensSkincareGrooming && mensSkincareGroomingData?.length == 0) {
            mensSkincareGroomingData = await runCategoryScraper(mens_skincare_grooming, 'mens skincare grooming retry', start, end);
            console.log(`${mensSkincareGroomingData?.length} data items scraped for mens skincare grooming`);
            if (mensSkincareGroomingData?.length == 0) {
                state.farmers.mensSkincareGrooming = true;
            }
        }

    // Skincare Ingredients
        if (!state.farmers.skincareIngredients) {
            skincareIngredientsData = await runCategoryScraper(skincare_ingredients, 'skincare ingredients', start, end);
            console.log(`${skincareIngredientsData?.length} data items scraped for skincare ingredients`);
        }

        if (!state.farmers.skincareIngredients && skincareIngredientsData?.length == 0) {
            skincareIngredientsData = await runCategoryScraper(skincare_ingredients, 'skincare ingredients retry', start, end);
            console.log(`${skincareIngredientsData?.length} data items scraped for skincare ingredients`);
            if (skincareIngredientsData?.length == 0) {
                state.farmers.skincareIngredients = true;
            }
        }

    // Nail Polish
        if (!state.farmers.nailPolish) {
            nailPolishData = await runCategoryScraper(nail_polish, 'nail polish', start, end);
            console.log(`${nailPolishData?.length} data items scraped for nail polish`);
        }

        if (!state.farmers.nailPolish && nailPolishData?.length == 0) {
            nailPolishData = await runCategoryScraper(nail_polish, 'nail polish retry', start, end);
            console.log(`${nailPolishData?.length} data items scraped for nail polish`);
            if (nailPolishData?.length == 0) {
                state.farmers.nailPolish = true;
            }
        }

    // Nail Care Tools
        if (!state.farmers.nailCareTools) {
            nailCareToolsData = await runCategoryScraper(nail_care_tools, 'nail care tools', start, end);
            console.log(`${nailCareToolsData?.length} data items scraped for nail care tools`);
        }

        if (!state.farmers.nailCareTools && nailCareToolsData?.length == 0) {
            nailCareToolsData = await runCategoryScraper(nail_care_tools, 'nail care tools retry', start, end);
            console.log(`${nailCareToolsData?.length} data items scraped for nail care tools`);
            if (nailCareToolsData?.length == 0) {
                state.farmers.nailCareTools = true;
            }
        }

    // Body Care
        if (!state.farmers.bodyCare) {
            bodyCareData = await runCategoryScraper(body_care, 'body care', start, end);
            console.log(`${bodyCareData?.length} data items scraped for body care`);
        }

        if (!state.farmers.bodyCare && bodyCareData?.length == 0) {
            bodyCareData = await runCategoryScraper(body_care, 'body care retry', start, end);
            console.log(`${bodyCareData?.length} data items scraped for body care`);
            if (bodyCareData?.length == 0) {
                state.farmers.bodyCare = true;
            }
        }

    // Hand Foot Care
        if (!state.farmers.handFootCare) {
            handFootCareData = await runCategoryScraper(hand_foot_care, 'hand foot care', start, end);
            console.log(`${handFootCareData?.length} data items scraped for hand foot care`);
        }

        if (!state.farmers.handFootCare && handFootCareData?.length == 0) {
            handFootCareData = await runCategoryScraper(hand_foot_care, 'hand foot care retry', start, end);
            console.log(`${handFootCareData?.length} data items scraped for hand foot care`);
            if (handFootCareData?.length == 0) {
                state.farmers.handFootCare = true;
            }
        }

    // Bath Shower Care
        if (!state.farmers.bathShowerCare) {
            bathShowerCareData = await runCategoryScraper(bath_shower_care, 'bath shower care', start, end);
            console.log(`${bathShowerCareData?.length} data items scraped for bath shower care`);
        }

        if (!state.farmers.bathShowerCare && bathShowerCareData?.length == 0) {
            bathShowerCareData = await runCategoryScraper(bath_shower_care, 'bath shower care retry', start, end);
            console.log(`${bathShowerCareData?.length} data items scraped for bath shower care`);
            if (bathShowerCareData?.length == 0) {
                state.farmers.bathShowerCare = true;
            }
        }

    // Suncare Tanning
        if (!state.farmers.suncareTanning) {
            suncareTanningData = await runCategoryScraper(suncare_tanning, 'suncare tanning', start, end);
            console.log(`${suncareTanningData?.length} data items scraped for suncare tanning`);
        }

        if (!state.farmers.suncareTanning && suncareTanningData?.length == 0) {
            suncareTanningData = await runCategoryScraper(suncare_tanning, 'suncare tanning retry', start, end);
            console.log(`${suncareTanningData?.length} data items scraped for suncare tanning`);
            if (suncareTanningData?.length == 0) {
                state.farmers.suncareTanning = true;
            }
        }

    // Hair Care Brushes
        if (!state.farmers.hairCareBrushes) {
            hairCareBrushesData = await runCategoryScraper(hair_care_brushes, 'hair care brushes', start, end);
            console.log(`${hairCareBrushesData?.length} data items scraped for hair care brushes`);
        }

        if (!state.farmers.hairCareBrushes && hairCareBrushesData?.length == 0) {
            hairCareBrushesData = await runCategoryScraper(hair_care_brushes, 'hair care brushes retry', start, end);
            console.log(`${hairCareBrushesData?.length} data items scraped for hair care brushes`);
            if (hairCareBrushesData?.length == 0) {
                state.farmers.hairCareBrushes = true;
            }
        }

    // Hair Colour
        if (!state.farmers.hairColour) {
            hairColourData = await runCategoryScraper(hair_colour, 'hair colour', start, end);
            console.log(`${hairColourData?.length} data items scraped for hair colour`);
        }

        if (!state.farmers.hairColour && hairColourData?.length == 0) {
            hairColourData = await runCategoryScraper(hair_colour, 'hair colour retry', start, end);
            console.log(`${hairColourData?.length} data items scraped for hair colour`);
            if (hairColourData?.length == 0) {
                state.farmers.hairColour = true;
            }
        }

    // Hair Accessories
        if (!state.farmers.hairAccessories) {
            hairAccessoriesData = await runCategoryScraper(hair_accessories, 'hair accessories', start, end);
            console.log(`${hairAccessoriesData?.length} data items scraped for hair accessories`);
        }

        if (!state.farmers.hairAccessories && hairAccessoriesData?.length == 0) {
            hairAccessoriesData = await runCategoryScraper(hair_accessories, 'hair accessories retry', start, end);
            console.log(`${hairAccessoriesData?.length} data items scraped for hair accessories`);
            if (hairAccessoriesData?.length == 0) {
                state.farmers.hairAccessories = true;
            }
        }

    // Collagens
        if (!state.farmers.collagens) {
            collagensData = await runCategoryScraper(collagens, 'collagens', start, end);
            console.log(`${collagensData?.length} data items scraped for collagens`);
        }

        if (!state.farmers.collagens && collagensData?.length == 0) {
            collagensData = await runCategoryScraper(collagens, 'collagens retry', start, end);
            console.log(`${collagensData?.length} data items scraped for collagens`);
            if (collagensData?.length == 0) {
                state.farmers.collagens = true;
            }
        }

    // Sleep
        if (!state.farmers.sleep) {
            sleepData = await runCategoryScraper(sleep, 'sleep', start, end);
            console.log(`${sleepData?.length} data items scraped for sleep`);
        }

        if (!state.farmers.sleep && sleepData?.length == 0) {
            sleepData = await runCategoryScraper(sleep, 'sleep retry', start, end);
            console.log(`${sleepData?.length} data items scraped for sleep`);
            if (sleepData?.length == 0) {
                state.farmers.sleep = true;
            }
        }

        //merge data
        const allData = [
            ...blushersBronzersData, ...makeupBrushesToolsData, ...womensPerfumesData,
            ...mensAftershavesCologneData, ...deodorantsBodySpraysData, ...rollerballsData,
            ...moisturisersSerumsAntiAgingData, ...cleansersMakeupRemoversData, ...treatmentsMasksData,
            ...mensSkincareGroomingData, ...skincareIngredientsData, ...nailPolishData,
            ...nailCareToolsData, ...bodyCareData, ...handFootCareData, ...bathShowerCareData,
            ...suncareTanningData, ...hairCareBrushesData, ...hairColourData, ...hairAccessoriesData,
            ...collagensData, ...sleepData, ...faceData, ...makeupBagData, ...lipsData, ...eyesData,
            ...exfoliatorsData, ...tonersData, ...eyeCreamData
        ];

        //process data
        let processedData = allData;
        try {
            processedData = await processDataForBeauty(allData);
            console.log(`${processedData?.length} data items processed`);
        } catch (err) {
            console.log("There was an error while processing data");
            logError(err);
        }

        // update db
        try {
            await updateDBEntry(processedData);
            console.log(`data items updated`);
        } catch (err) {
            console.log("There was an error while updating data");
            logError(err);
        }

        console.log("entries updated for farmers");

        return allData?.length == 0;
    } catch (mainErr) {
        logError(mainErr);
        return true;
    }
    // No finally block needed - each category creates and closes its own browser
}

module.exports = scrapeFarmers;
