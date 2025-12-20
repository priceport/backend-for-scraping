//scraping script imports
const bath_care = require("../scripts/scraping_scripts/domestic/farmers/bath_care");
const body_care = require("../scripts/scraping_scripts/domestic/farmers/body_care");
const cleansers = require("../scripts/scraping_scripts/domestic/farmers/cleansers");
const collagen = require("../scripts/scraping_scripts/domestic/farmers/collagen");
const deodorants = require("../scripts/scraping_scripts/domestic/farmers/deodorants");
const exfoliators = require("../scripts/scraping_scripts/domestic/farmers/exfoliators");
const eye_cream = require("../scripts/scraping_scripts/domestic/farmers/eye_cream");
const eyes = require("../scripts/scraping_scripts/domestic/farmers/eyes");
const face = require("../scripts/scraping_scripts/domestic/farmers/face");
const foot_care = require("../scripts/scraping_scripts/domestic/farmers/foot_care");
const grooming = require("../scripts/scraping_scripts/domestic/farmers/grooming");
const hair_accesories = require("../scripts/scraping_scripts/domestic/farmers/hair_accesories");
const hair_care = require("../scripts/scraping_scripts/domestic/farmers/hair_care");
const hair_color = require("../scripts/scraping_scripts/domestic/farmers/hair_color");
const lips = require("../scripts/scraping_scripts/domestic/farmers/lips");
const makeup_bags = require("../scripts/scraping_scripts/domestic/farmers/makeup_bags");
const menAftershave = require("../scripts/scraping_scripts/domestic/farmers/menAftershave");
const moisturizers = require("../scripts/scraping_scripts/domestic/farmers/moisturizers");
const nail_polish = require("../scripts/scraping_scripts/domestic/farmers/nail_polish");
const nail_tools = require("../scripts/scraping_scripts/domestic/farmers/nail_tools");
const sun_care = require("../scripts/scraping_scripts/domestic/farmers/sun_care");
const toners = require("../scripts/scraping_scripts/domestic/farmers/toners");
const tools = require("../scripts/scraping_scripts/domestic/farmers/tools");
const tools2 = require("../scripts/scraping_scripts/domestic/farmers/tools2");
const treatments = require("../scripts/scraping_scripts/domestic/farmers/treatments");
const wellness_skincare = require("../scripts/scraping_scripts/domestic/farmers/wellness_skincare");
const womensPerfume = require("../scripts/scraping_scripts/domestic/farmers/womensPerfume");

//processing script imports
const processDataForBeauty = require("./data_processing/farmers/beauty");
const logError = require("./logError");

//db update imports
const updateDBEntry = require("./update_db_entry/farmers/beauty");

const scrapeFarmers = async (start, end, state) => {
    console.log("scraping started for farmers at:" + Date.now());

    //variable initialization
    let faceData = [], makeupBagData = [], lipsData = [], eyesData = [], toolsData = [], tools2Data = [], 
        womensPerfumeData = [], menAftershaveData = [], deodorantData = [], moisturiserData = [], 
        exfoliatorsData = [], cleansersData = [], tonersData = [], treatmentsData = [], eyeCreamData = [], 
        groomingData = [], nailToolsData = [], nailPolishData = [], bodyCareData = [], footCareData = [], 
        bathCareData = [], sunCareData = [], hairCareData = [], hairColorData = [], hairAccesoriesData = [], 
        wSkincareData = [], collagensData = [];

    // Face
    if (!state.farmers.face) {
        try {
            faceData = await face(start, end);
            console.log(`${faceData?.length} data items scraped for face`);
        } catch (err) {
            console.log("There was an error while scraping face");
            logError(err);
        }
    }

    if (!state.farmers.face && faceData?.length == 0) {
        try {
            faceData = await face(start, end);
            console.log(`${faceData?.length} data items scraped for face`);
            if (faceData?.length == 0) {
                state.farmers.face = true;
            }
        } catch (err) {
            console.log("There was an error while scraping face");
            logError(err);
        }
    }

    // Makeup Bags
    if (!state.farmers.makeup) {
        try {
            makeupBagData = await makeup_bags(start, end);
            console.log(`${makeupBagData?.length} data items scraped for makeup bags`);
        } catch (err) {
            console.log("There was an error while scraping makeup bags");
            logError(err);
        }
    }

    if (!state.farmers.makeup && makeupBagData?.length == 0) {
        try {
            makeupBagData = await makeup_bags(start, end);
            console.log(`${makeupBagData?.length} data items scraped for makeup bags`);
            if (makeupBagData?.length == 0) {
                state.farmers.makeup = true;
            }
        } catch (err) {
            console.log("There was an error while scraping makeup bags");
            logError(err);
        }
    }

    // Lips
    if (!state.farmers.lips) {
        try {
            lipsData = await lips(start, end);
            console.log(`${lipsData?.length} data items scraped for lips`);
        } catch (err) {
            console.log("There was an error while scraping lips");
            logError(err);
        }
    }

    if (!state.farmers.lips && lipsData?.length == 0) {
        try {
            lipsData = await lips(start, end);
            console.log(`${lipsData?.length} data items scraped for lips`);
            if (lipsData?.length == 0) {
                state.farmers.lips = true;
            }
        } catch (err) {
            console.log("There was an error while scraping lips");
            logError(err);
        }
    }

    // Eyes
    if (!state.farmers.eyes) {
        try {
            eyesData = await eyes(start, end);
            console.log(`${eyesData?.length} data items scraped for eyes`);
        } catch (err) {
            console.log("There was an error while scraping eyes");
            logError(err);
        }
    }

    if (!state.farmers.eyes && eyesData?.length == 0) {
        try {
            eyesData = await eyes(start, end);
            console.log(`${eyesData?.length} data items scraped for eyes`);
            if (eyesData?.length == 0) {
                state.farmers.eyes = true;
            }
        } catch (err) {
            console.log("There was an error while scraping eyes");
            logError(err);
        }
    }

    // Tools
    if (!state.farmers.tools) {
        try {
            toolsData = await tools(start, end);
            console.log(`${toolsData?.length} data items scraped for tools`);
        } catch (err) {
            console.log("There was an error while scraping tools");
            logError(err);
        }
    }

    if (!state.farmers.tools && toolsData?.length == 0) {
        try {
            toolsData = await tools(start, end);
            console.log(`${toolsData?.length} data items scraped for tools`);
            if (toolsData?.length == 0) {
                state.farmers.tools = true;
            }
        } catch (err) {
            console.log("There was an error while scraping tools");
            logError(err);
        }
    }

    // Tools2
    if (!state.farmers.tools2) {
        try {
            tools2Data = await tools2(start, end);
            console.log(`${tools2Data?.length} data items scraped for tools2`);
        } catch (err) {
            console.log("There was an error while scraping tools2");
            logError(err);
        }
    }

    if (!state.farmers.tools2 && tools2Data?.length == 0) {
        try {
            tools2Data = await tools2(start, end);
            console.log(`${tools2Data?.length} data items scraped for tools2`);
            if (tools2Data?.length == 0) {
                state.farmers.tools2 = true;
            }
        } catch (err) {
            console.log("There was an error while scraping tools2");
            logError(err);
        }
    }

    // Women's Perfume
    if (!state.farmers.womenPerfume) {
        try {
            womensPerfumeData = await womensPerfume(start, end);
            console.log(`${womensPerfumeData?.length} data items scraped for womens perfume`);
        } catch (err) {
            console.log("There was an error while scraping womens perfume");
            logError(err);
        }
    }

    if (!state.farmers.womenPerfume && womensPerfumeData?.length == 0) {
        try {
            womensPerfumeData = await womensPerfume(start, end);
            console.log(`${womensPerfumeData?.length} data items scraped for womens perfume`);
            if (womensPerfumeData?.length == 0) {
                state.farmers.womenPerfume = true;
            }
        } catch (err) {
            console.log("There was an error while scraping womens perfume");
            logError(err);
        }
    }

    // Men's Aftershave
    if (!state.farmers.menAfterShave) {
        try {
            menAftershaveData = await menAftershave(start, end);
            console.log(`${menAftershaveData?.length} data items scraped for men aftershave`);
        } catch (err) {
            console.log("There was an error while scraping men aftershave");
            logError(err);
        }
    }

    if (!state.farmers.menAfterShave && menAftershaveData?.length == 0) {
        try {
            menAftershaveData = await menAftershave(start, end);
            console.log(`${menAftershaveData?.length} data items scraped for men aftershave`);
            if (menAftershaveData?.length == 0) {
                state.farmers.menAfterShave = true;
            }
        } catch (err) {
            console.log("There was an error while scraping men aftershave");
            logError(err);
        }
    }

    // Deodorants
    if (!state.farmers.deodorant) {
        try {
            deodorantData = await deodorants(start, end);
            console.log(`${deodorantData?.length} data items scraped for deodorants`);
        } catch (err) {
            console.log("There was an error while scraping deodorants");
            logError(err);
        }
    }

    if (!state.farmers.deodorant && deodorantData?.length == 0) {
        try {
            deodorantData = await deodorants(start, end);
            console.log(`${deodorantData?.length} data items scraped for deodorants`);
            if (deodorantData?.length == 0) {
                state.farmers.deodorant = true;
            }
        } catch (err) {
            console.log("There was an error while scraping deodorants");
            logError(err);
        }
    }

    // Moisturizers
    if (!state.farmers.moisturiser) {
        try {
            moisturiserData = await moisturizers(start, end);
            console.log(`${moisturiserData?.length} data items scraped for moisturizers`);
        } catch (err) {
            console.log("There was an error while scraping moisturizers");
            logError(err);
        }
    }

    if (!state.farmers.moisturiser && moisturiserData?.length == 0) {
        try {
            moisturiserData = await moisturizers(start, end);
            console.log(`${moisturiserData?.length} data items scraped for moisturizers`);
            if (moisturiserData?.length == 0) {
                state.farmers.moisturiser = true;
            }
        } catch (err) {
            console.log("There was an error while scraping moisturizers");
            logError(err);
        }
    }

    // Exfoliators
    if (!state.farmers.exfoliators) {
        try {
            exfoliatorsData = await exfoliators(start, end);
            console.log(`${exfoliatorsData?.length} data items scraped for exfoliators`);
        } catch (err) {
            console.log("There was an error while scraping exfoliators");
            logError(err);
        }
    }

    if (!state.farmers.exfoliators && exfoliatorsData?.length == 0) {
        try {
            exfoliatorsData = await exfoliators(start, end);
            console.log(`${exfoliatorsData?.length} data items scraped for exfoliators`);
            if (exfoliatorsData?.length == 0) {
                state.farmers.exfoliators = true;
            }
        } catch (err) {
            console.log("There was an error while scraping exfoliators");
            logError(err);
        }
    }

    // Cleansers
    if (!state.farmers.cleansers) {
        try {
            cleansersData = await cleansers(start, end);
            console.log(`${cleansersData?.length} data items scraped for cleansers`);
        } catch (err) {
            console.log("There was an error while scraping cleansers");
            logError(err);
        }
    }

    if (!state.farmers.cleansers && cleansersData?.length == 0) {
        try {
            cleansersData = await cleansers(start, end);
            console.log(`${cleansersData?.length} data items scraped for cleansers`);
            if (cleansersData?.length == 0) {
                state.farmers.cleansers = true;
            }
        } catch (err) {
            console.log("There was an error while scraping cleansers");
            logError(err);
        }
    }

    // Toners
    if (!state.farmers.toners) {
        try {
            tonersData = await toners(start, end);
            console.log(`${tonersData?.length} data items scraped for toners`);
        } catch (err) {
            console.log("There was an error while scraping toners");
            logError(err);
        }
    }

    if (!state.farmers.toners && tonersData?.length == 0) {
        try {
            tonersData = await toners(start, end);
            console.log(`${tonersData?.length} data items scraped for toners`);
            if (tonersData?.length == 0) {
                state.farmers.toners = true;
            }
        } catch (err) {
            console.log("There was an error while scraping toners");
            logError(err);
        }
    }

    // Treatments
    if (!state.farmers.treatments) {
        try {
            treatmentsData = await treatments(start, end);
            console.log(`${treatmentsData?.length} data items scraped for treatments`);
        } catch (err) {
            console.log("There was an error while scraping treatments");
            logError(err);
        }
    }

    if (!state.farmers.treatments && treatmentsData?.length == 0) {
        try {
            treatmentsData = await treatments(start, end);
            console.log(`${treatmentsData?.length} data items scraped for treatments`);
            if (treatmentsData?.length == 0) {
                state.farmers.treatments = true;
            }
        } catch (err) {
            console.log("There was an error while scraping treatments");
            logError(err);
        }
    }

    // Eye Cream
    if (!state.farmers.eyecream) {
        try {
            eyeCreamData = await eye_cream(start, end);
            console.log(`${eyeCreamData?.length} data items scraped for eye cream`);
        } catch (err) {
            console.log("There was an error while scraping eye cream");
            logError(err);
        }
    }

    if (!state.farmers.eyecream && eyeCreamData?.length == 0) {
        try {
            eyeCreamData = await eye_cream(start, end);
            console.log(`${eyeCreamData?.length} data items scraped for eye cream`);
            if (eyeCreamData?.length == 0) {
                state.farmers.eyecream = true;
            }
        } catch (err) {
            console.log("There was an error while scraping eye cream");
            logError(err);
        }
    }

    // Grooming
    if (!state.farmers.grooming) {
        try {
            groomingData = await grooming(start, end);
            console.log(`${groomingData?.length} data items scraped for grooming`);
        } catch (err) {
            console.log("There was an error while scraping grooming");
            logError(err);
        }
    }

    if (!state.farmers.grooming && groomingData?.length == 0) {
        try {
            groomingData = await grooming(start, end);
            console.log(`${groomingData?.length} data items scraped for grooming`);
            if (groomingData?.length == 0) {
                state.farmers.grooming = true;
            }
        } catch (err) {
            console.log("There was an error while scraping grooming");
            logError(err);
        }
    }

    // Nail Tools
    if (!state.farmers.nailtools) {
        try {
            nailToolsData = await nail_tools(start, end);
            console.log(`${nailToolsData?.length} data items scraped for nail tools`);
        } catch (err) {
            console.log("There was an error while scraping nail tools");
            logError(err);
        }
    }

    if (!state.farmers.nailtools && nailToolsData?.length == 0) {
        try {
            nailToolsData = await nail_tools(start, end);
            console.log(`${nailToolsData?.length} data items scraped for nail tools`);
            if (nailToolsData?.length == 0) {
                state.farmers.nailtools = true;
            }
        } catch (err) {
            console.log("There was an error while scraping nail tools");
            logError(err);
        }
    }

    // Nail Polish
    if (!state.farmers.nailpolish) {
        try {
            nailPolishData = await nail_polish(start, end);
            console.log(`${nailPolishData?.length} data items scraped for nail polish`);
        } catch (err) {
            console.log("There was an error while scraping nail polish");
            logError(err);
        }
    }

    if (!state.farmers.nailpolish && nailPolishData?.length == 0) {
        try {
            nailPolishData = await nail_polish(start, end);
            console.log(`${nailPolishData?.length} data items scraped for nail polish`);
            if (nailPolishData?.length == 0) {
                state.farmers.nailpolish = true;
            }
        } catch (err) {
            console.log("There was an error while scraping nail polish");
            logError(err);
        }
    }

    // Body Care
    if (!state.farmers.bodycare) {
        try {
            bodyCareData = await body_care(start, end);
            console.log(`${bodyCareData?.length} data items scraped for body care`);
        } catch (err) {
            console.log("There was an error while scraping body care");
            logError(err);
        }
    }

    if (!state.farmers.bodycare && bodyCareData?.length == 0) {
        try {
            bodyCareData = await body_care(start, end);
            console.log(`${bodyCareData?.length} data items scraped for body care`);
            if (bodyCareData?.length == 0) {
                state.farmers.bodycare = true;
            }
        } catch (err) {
            console.log("There was an error while scraping body care");
            logError(err);
        }
    }

    // Foot Care
    if (!state.farmers.footcare) {
        try {
            footCareData = await foot_care(start, end);
            console.log(`${footCareData?.length} data items scraped for foot care`);
        } catch (err) {
            console.log("There was an error while scraping foot care");
            logError(err);
        }
    }

    if (!state.farmers.footcare && footCareData?.length == 0) {
        try {
            footCareData = await foot_care(start, end);
            console.log(`${footCareData?.length} data items scraped for foot care`);
            if (footCareData?.length == 0) {
                state.farmers.footcare = true;
            }
        } catch (err) {
            console.log("There was an error while scraping foot care");
            logError(err);
        }
    }

    // Bath Care
    if (!state.farmers.bathcare) {
        try {
            bathCareData = await bath_care(start, end);
            console.log(`${bathCareData?.length} data items scraped for bath care`);
        } catch (err) {
            console.log("There was an error while scraping bath care");
            logError(err);
        }
    }

    if (!state.farmers.bathcare && bathCareData?.length == 0) {
        try {
            bathCareData = await bath_care(start, end);
            console.log(`${bathCareData?.length} data items scraped for bath care`);
            if (bathCareData?.length == 0) {
                state.farmers.bathcare = true;
            }
        } catch (err) {
            console.log("There was an error while scraping bath care");
            logError(err);
        }
    }

    // Sun Care
    if (!state.farmers.suncare) {
        try {
            sunCareData = await sun_care(start, end);
            console.log(`${sunCareData?.length} data items scraped for sun care`);
        } catch (err) {
            console.log("There was an error while scraping sun care");
            logError(err);
        }
    }

    if (!state.farmers.suncare && sunCareData?.length == 0) {
        try {
            sunCareData = await sun_care(start, end);
            console.log(`${sunCareData?.length} data items scraped for sun care`);
            if (sunCareData?.length == 0) {
                state.farmers.suncare = true;
            }
        } catch (err) {
            console.log("There was an error while scraping sun care");
            logError(err);
        }
    }

    // Hair Care
    if (!state.farmers.haircare) {
        try {
            hairCareData = await hair_care(start, end);
            console.log(`${hairCareData?.length} data items scraped for hair care`);
        } catch (err) {
            console.log("There was an error while scraping hair care");
            logError(err);
        }
    }

    if (!state.farmers.haircare && hairCareData?.length == 0) {
        try {
            hairCareData = await hair_care(start, end);
            console.log(`${hairCareData?.length} data items scraped for hair care`);
            if (hairCareData?.length == 0) {
                state.farmers.haircare = true;
            }
        } catch (err) {
            console.log("There was an error while scraping hair care");
            logError(err);
        }
    }

    // Hair Color
    if (!state.farmers.haircolor) {
        try {
            hairColorData = await hair_color(start, end);
            console.log(`${hairColorData?.length} data items scraped for hair color`);
        } catch (err) {
            console.log("There was an error while scraping hair color");
            logError(err);
        }
    }

    if (!state.farmers.haircolor && hairColorData?.length == 0) {
        try {
            hairColorData = await hair_color(start, end);
            console.log(`${hairColorData?.length} data items scraped for hair color`);
            if (hairColorData?.length == 0) {
                state.farmers.haircolor = true;
            }
        } catch (err) {
            console.log("There was an error while scraping hair color");
            logError(err);
        }
    }

    // Hair Accessories
    if (!state.farmers.hairaccessories) {
        try {
            hairAccesoriesData = await hair_accesories(start, end);
            console.log(`${hairAccesoriesData?.length} data items scraped for hair accessories`);
        } catch (err) {
            console.log("There was an error while scraping hair accessories");
            logError(err);
        }
    }

    if (!state.farmers.hairaccessories && hairAccesoriesData?.length == 0) {
        try {
            hairAccesoriesData = await hair_accesories(start, end);
            console.log(`${hairAccesoriesData?.length} data items scraped for hair accessories`);
            if (hairAccesoriesData?.length == 0) {
                state.farmers.hairaccessories = true;
            }
        } catch (err) {
            console.log("There was an error while scraping hair accessories");
            logError(err);
        }
    }

    // Wellness Skincare
    if (!state.farmers.skincare) {
        try {
            wSkincareData = await wellness_skincare(start, end);
            console.log(`${wSkincareData?.length} data items scraped for wellness skincare`);
        } catch (err) {
            console.log("There was an error while scraping wellness skincare");
            logError(err);
        }
    }

    if (!state.farmers.skincare && wSkincareData?.length == 0) {
        try {
            wSkincareData = await wellness_skincare(start, end);
            console.log(`${wSkincareData?.length} data items scraped for wellness skincare`);
            if (wSkincareData?.length == 0) {
                state.farmers.skincare = true;
            }
        } catch (err) {
            console.log("There was an error while scraping wellness skincare");
            logError(err);
        }
    }

    // Collagen
    if (!state.farmers.collegens) {
        try {
            collagensData = await collagen(start, end);
            console.log(`${collagensData?.length} data items scraped for collagen`);
        } catch (err) {
            console.log("There was an error while scraping collagen");
            logError(err);
        }
    }

    if (!state.farmers.collegens && collagensData?.length == 0) {
        try {
            collagensData = await collagen(start, end);
            console.log(`${collagensData?.length} data items scraped for collagen`);
            if (collagensData?.length == 0) {
                state.farmers.collegens = true;
            }
        } catch (err) {
            console.log("There was an error while scraping collagen");
            logError(err);
        }
    }

    //merge data
    const allData = [
        ...faceData, ...makeupBagData, ...lipsData, ...eyesData, ...toolsData, ...tools2Data,
        ...womensPerfumeData, ...menAftershaveData, ...deodorantData, ...moisturiserData,
        ...exfoliatorsData, ...cleansersData, ...tonersData, ...treatmentsData, ...eyeCreamData,
        ...groomingData, ...nailToolsData, ...nailPolishData, ...bodyCareData, ...footCareData,
        ...bathCareData, ...sunCareData, ...hairCareData, ...hairColorData, ...hairAccesoriesData,
        ...wSkincareData, ...collagensData
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
}

module.exports = scrapeFarmers;
