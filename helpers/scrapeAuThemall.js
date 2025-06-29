const genericTheMallScraper = require("../scripts/scraping_scripts/duty_free/nz_themall/genericLiquorScraper");
const processData = require("./data_processing/nz_themall/processData");
const logError = require("./logError");
const updateDBEntry = require("./update_db_entry/nz_themall/updateDBEntry");

async function handleCategory(state, stateKey, scraperArgs) {
  let dataVar = [];
  if (!state.auThemall[stateKey])
    try {
      dataVar = await genericTheMallScraper(scraperArgs);
      console.log(`${dataVar?.length} data items scraped for ${stateKey}`);
    } catch (err) {
      console.log(`There was an error while scraping ${stateKey}`);
      logError(err);
    }

  if (!state.auThemall[stateKey] && dataVar?.length == 0)
    try {
      dataVar = await genericTheMallScraper(scraperArgs);
      console.log(`${dataVar?.length} data items scraped for ${stateKey}`);

      if (dataVar?.length == 0) {
        state.auThemall[stateKey] = true;
      }
    } catch (err) {
      console.log(`There was an error while scraping ${stateKey}`);
      logError(err);
    }

  return dataVar;
}

const scrapeAuThemall = async (start, end, state, browser) => {
  console.log("scraping started for auckland themall at:" + Date.now());

  // Variable initialization for all categories
  let whiskeyData = [],
    ginData = [],
    liqueursData = [],
    rumData = [],
    vodkaData = [],
    brandyData = [],
    cognacData = [],
    tequilaData = [],
    baijiuData = [],
    bourbonData = [],
    champagneSparklingData = [],
    portSherryData = [],
    redWineData = [],
    roseWineData = [],
    whiteWineData = [],
    luxuryWineData = [],
    womensFragranceData = [],
    mensFragranceData = [],
    unisexFragranceData = [],
    under80Data = [],
    moisturisersData = [],
    cleansersTonersData = [],
    masksExfoliatorsData = [],
    serumsBoostersData = [],
    eyesData = [],
    lipsData = [],
    suncareData = [],
    faceData = [],
    makeupEyesData = [],
    makeupLipsData = [],
    toolsData = [],
    bodyData = [],
    bathShowerData = [],
    hairData = [],
    handFeetCareData = [],
    bathSuncareData = [],
    nzSkincareData = [],
    nzBodyData = [],
    mensData = [],
    mensSkincareData = [],
    mensBodyData = [],
    mensGroomingData = [];

  // Scrape whiskey data with retry logic and state update
  whiskeyData = await handleCategory(state, "whiskey", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_whiskey/whiskey.html",
    subcategory: "whiskey",
    category: "liquor",
  });

  ginData = await handleCategory(state, "gin", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_gin/gin.html",
    subcategory: "gin",
    category: "liquor",
  });

  liqueursData = await handleCategory(state, "liqueurs", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_liqueurs/liqueurs.html",
    subcategory: "liqueurs",
    category: "liquor",
  });

  rumData = await handleCategory(state, "rum", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_rum/rum.html",
    subcategory: "rum",
    category: "liquor",
  });

  vodkaData = await handleCategory(state, "vodka", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_vodka/vodka.html",
    subcategory: "vodka",
    category: "liquor",
  });

  brandyData = await handleCategory(state, "brandy", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_brandy/brandy.html",
    subcategory: "brandy",
    category: "liquor",
  });

  cognacData = await handleCategory(state, "cognac", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_cognac/cognac.html",
    subcategory: "cognac",
    category: "liquor",
  });

  tequilaData = await handleCategory(state, "tequila", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_tequila/tequila.html",
    subcategory: "tequila",
    category: "liquor",
  });

  baijiuData = await handleCategory(state, "baijiu", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_baijiu/baijiu.html",
    subcategory: "baijiu",
    category: "liquor",
  });

  bourbonData = await handleCategory(state, "bourbon", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_and_wine_spirit_bourbon/bourbon.html",
    subcategory: "bourbon",
    category: "liquor",
  });

  champagneSparklingData = await handleCategory(state, "champagne_sparkling", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_champagne_and_sparkling/champagne-%26-sparkling.html",
    subcategory: "champagne_sparkling",
    category: "liquor",
  });

  portSherryData = await handleCategory(state, "port_sherry", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_port_sherry/port-%26-sherry.html",
    subcategory: "port_sherry",
    category: "liquor",
  });

  redWineData = await handleCategory(state, "red_wine", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_red/red-wine.html",
    subcategory: "red_wine",
    category: "liquor",
  });

  roseWineData = await handleCategory(state, "rose_wine", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_rose/rose-wine.html",
    subcategory: "rose_wine",
    category: "liquor",
  });

  whiteWineData = await handleCategory(state, "white_wine", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_white/white-wine.html",
    subcategory: "white_wine",
    category: "liquor",
  });

  luxuryWineData = await handleCategory(state, "luxury_wine", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/spirits_wines_luxury_wine/luxury-wine.html",
    subcategory: "luxury_wine",
    category: "liquor",
  });

  womensFragranceData = await handleCategory(state, "womens_fragrance", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_fragrances_women/women%27s.html",
    subcategory: "womens_fragrance",
    category: "beauty",
  });

  mensFragranceData = await handleCategory(state, "mens_fragrance", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_fragrances_men/men%27s.html",
    subcategory: "mens_fragrance",
    category: "beauty",
  });

  unisexFragranceData = await handleCategory(state, "unisex_fragrance", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_fragrances_unisex/unisex.html",
    subcategory: "unisex_fragrance",
    category: "beauty",
  });

  under80Data = await handleCategory(state, "under_80", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/under-80/%2480-%26-under.html",
    subcategory: "under_80",
    category: "beauty",
  });

  moisturisersData = await handleCategory(state, "moisturisers", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_skincare_moisturisers/moisturisers.html",
    subcategory: "moisturisers",
    category: "beauty",
  });

  cleansersTonersData = await handleCategory(state, "cleansers_toners", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_skincare_cleansers/cleansers-%26-toners.html",
    subcategory: "cleansers_toners",
    category: "beauty",
  });

  masksExfoliatorsData = await handleCategory(state, "masks_exfoliators", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_skincare_masks/masks-%26-exfoliators.html",
    subcategory: "masks_exfoliators",
    category: "beauty",
  });

  serumsBoostersData = await handleCategory(state, "serums_boosters", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_skincare_serums_boosters/serums-%26-boosters.html",
    subcategory: "serums_boosters",
    category: "beauty",
  });

  eyesData = await handleCategory(state, "eyes", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_skincare_eye_care/eyes.html",
    subcategory: "eyes",
    category: "beauty",
  });

  lipsData = await handleCategory(state, "lips", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_skincare_lips/lips.html",
    subcategory: "lips",
    category: "beauty",
  });

  suncareData = await handleCategory(state, "suncare", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_skincare_suncare/suncare.html",
    subcategory: "suncare",
    category: "beauty",
  });

  faceData = await handleCategory(state, "face", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_makeup_face/face.html",
    subcategory: "face",
    category: "beauty",
  });

  makeupEyesData = await handleCategory(state, "makeup_eyes", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_makeup_eyes/eyes.html",
    subcategory: "makeup_eyes",
    category: "beauty",
  });

  makeupLipsData = await handleCategory(state, "makeup_lips", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_makeup_lips/lips.html",
    subcategory: "makeup_lips",
    category: "beauty",
  });

  toolsData = await handleCategory(state, "tools", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_makeup_accessories/tools.html",
    subcategory: "tools",
    category: "beauty",
  });

  bodyData = await handleCategory(state, "body", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_bodycare_bodylotion/body.html",
    subcategory: "body",
    category: "beauty",
  });

  bathShowerData = await handleCategory(state, "bath_shower", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_bodycare_soap/bath-%26-shower.html",
    subcategory: "bath_shower",
    category: "beauty",
  });

  hairData = await handleCategory(state, "hair", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_hair/hair.html",
    subcategory: "hair",
    category: "beauty",
  });

  handFeetCareData = await handleCategory(state, "hand_feet_care", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_skincare_hand_feet/hand-%26-feet-care.html",
    subcategory: "hand_feet_care",
    category: "beauty",
  });

  bathSuncareData = await handleCategory(state, "bath_suncare", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_bodycare_suncare/suncare.html",
    subcategory: "bath_suncare",
    category: "beauty",
  });

  nzSkincareData = await handleCategory(state, "nz_skincare", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_nzbeauty_skincare/skincare.html",
    subcategory: "nz_skincare",
    category: "beauty",
  });

  nzBodyData = await handleCategory(state, "nz_body", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_nzbeauty_body/body.html",
    subcategory: "nz_body",
    category: "beauty",
  });

  mensSkincareData = await handleCategory(state, "mens_skincare", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_men_skincare/skincare.html",
    subcategory: "mens_skincare",
    category: "beauty",
  });

  mensBodyData = await handleCategory(state, "mens_body", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_men_body/body.html",
    subcategory: "mens_body",
    category: "beauty",
  });

  mensGroomingData = await handleCategory(state, "mens_grooming", {
    start,
    end,
    browser,
    url: "https://themall.aucklandairport.co.nz/en/intl-duty-free/category/beauty_men_grooming/grooming.html",
    subcategory: "mens_grooming",
    category: "beauty",
  });

  whiskeyData = [
    ...whiskeyData,
    ...ginData,
    ...liqueursData,
    ...rumData,
    ...vodkaData,
    ...brandyData,
    ...cognacData,
    ...tequilaData,
    ...baijiuData,
    ...bourbonData,
    ...champagneSparklingData,
    ...portSherryData,
    ...redWineData,
    ...roseWineData,
    ...whiteWineData,
    ...luxuryWineData,
    ...womensFragranceData,
    ...mensFragranceData,
    ...unisexFragranceData,
    ...under80Data,
    ...moisturisersData,
    ...cleansersTonersData,
    ...masksExfoliatorsData,
    ...serumsBoostersData,
    ...eyesData,
    ...lipsData,
    ...suncareData,
    ...faceData,
    ...makeupEyesData,
    ...makeupLipsData,
    ...toolsData,
    ...bodyData,
    ...bathShowerData,
    ...hairData,
    ...handFeetCareData,
    ...bathSuncareData,
    ...nzSkincareData,
    ...nzBodyData,
    ...mensSkincareData,
    ...mensBodyData,
    ...mensGroomingData,
  ];

  //process data
  try {
    whiskeyData = await processData(whiskeyData);
    console.log(`${whiskeyData.length} data items proccessed`);
  } catch (err) {
    console.log("There was an error while proccessing data");
    logError(err);
  }

  //update db
  try {
    await updateDBEntry(whiskeyData);
    console.log(`data items updated`);
  } catch (err) {
    console.log("There was an error while updating data");
    logError(err);
  }

  console.log("entries updated for nz_themall");
  return whiskeyData?.length == 0;
};

module.exports = scrapeAuThemall;
