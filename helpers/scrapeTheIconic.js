const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const serums_and_treatments = require("../scripts/scraping_scripts/domestic/au_the_iconic/serums_and_treatments");
const logError = require("./logError");
const moisturisers = require("../scripts/scraping_scripts/domestic/au_the_iconic/moisturisers");
const exfoliators = require("../scripts/scraping_scripts/domestic/au_the_iconic/exfoliators");
const toners_and_mists = require("../scripts/scraping_scripts/domestic/au_the_iconic/toners_and_mists");
const sun_care = require("../scripts/scraping_scripts/domestic/au_the_iconic/sun_care");
const masks = require("../scripts/scraping_scripts/domestic/au_the_iconic/masks");
const cosmeceuticals = require("../scripts/scraping_scripts/domestic/au_the_iconic/cosmeceuticals");
const tools = require("../scripts/scraping_scripts/domestic/au_the_iconic/tools");
const eye_and_lip_care = require("../scripts/scraping_scripts/domestic/au_the_iconic/eye_and_lip_care");
const cleansers = require("../scripts/scraping_scripts/domestic/au_the_iconic/cleansers");
const face = require("../scripts/scraping_scripts/domestic/au_the_iconic/face");
const lips = require("../scripts/scraping_scripts/domestic/au_the_iconic/lips");
const eyes = require("../scripts/scraping_scripts/domestic/au_the_iconic/eyes");
const eyebrows = require("../scripts/scraping_scripts/domestic/au_the_iconic/eyebrows");
const bags_and_tools = require("../scripts/scraping_scripts/domestic/au_the_iconic/bags_and_tools");
const nails = require("../scripts/scraping_scripts/domestic/au_the_iconic/nails");
const brushes = require("../scripts/scraping_scripts/domestic/au_the_iconic/brushes");
const lashes = require("../scripts/scraping_scripts/domestic/au_the_iconic/lashes");
const personal_fragrance = require("../scripts/scraping_scripts/domestic/au_the_iconic/personal_fragrance");
const home_fragrance = require("../scripts/scraping_scripts/domestic/au_the_iconic/home_fragrance");
const shampoo_and_conditioner = require("../scripts/scraping_scripts/domestic/au_the_iconic/shampoo_and_conditioner");
const hair_tools = require("../scripts/scraping_scripts/domestic/au_the_iconic/hair_tools");
const treatments = require("../scripts/scraping_scripts/domestic/au_the_iconic/treatments");
const styling = require("../scripts/scraping_scripts/domestic/au_the_iconic/styling");
const hair_colour = require("../scripts/scraping_scripts/domestic/au_the_iconic/hair_colour");
const bath_and_shower = require("../scripts/scraping_scripts/domestic/au_the_iconic/bath_and_shower");
const hands_and_feet = require("../scripts/scraping_scripts/domestic/au_the_iconic/hands_and_feet");
const body_moisturisers = require("../scripts/scraping_scripts/domestic/au_the_iconic/body_moisturisers");
const personal_care = require("../scripts/scraping_scripts/domestic/au_the_iconic/personal_care");
const sun_and_tanning = require("../scripts/scraping_scripts/domestic/au_the_iconic/sun_and_tanning");
const superfoods_and_supplements = require("../scripts/scraping_scripts/domestic/au_the_iconic/superfoods_and_supplements");
const aromatherapy = require("../scripts/scraping_scripts/domestic/au_the_iconic/aromatherapy");
const skincare = require("../scripts/scraping_scripts/domestic/au_the_iconic/skincare");
const fragrance = require("../scripts/scraping_scripts/domestic/au_the_iconic/fragrance");
const hair = require("../scripts/scraping_scripts/domestic/au_the_iconic/hair");
const grooming_tools = require("../scripts/scraping_scripts/domestic/au_the_iconic/grooming_tools");
const beard = require("../scripts/scraping_scripts/domestic/au_the_iconic/beard");
const grooming_treatments = require("../scripts/scraping_scripts/domestic/au_the_iconic/grooming_treatments");
const processDataForBeauty = require("./data_processing/au_the_iconic/processDataForBeauty");
const updateDBEntry = require("./update_db_entry/au_the_iconic/beauty");
const wellness_essentials = require("../scripts/scraping_scripts/domestic/au_the_iconic/wellness_essentials");
puppeteer.use(StealthPlugin());

const scrapeTheIconic = async (start, end, state) => {
  console.log("scraping started for australia the iconic at:" + Date.now());

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  let serums_and_treatmentsData = [],
    moisturisersData = [],
    cleansersData = [],
    eye_and_lip_careData = [],
    toolsData = [],
    cosmeceuticalsData = [],
    masksData = [],
    sun_careData = [],
    toners_and_mistsData = [],
    exfoliatorsData = [],
    faceData = [],
    lipsData = [],
    nailsData = [],
    brushesData = [],
    lashesData = [],
    personal_fragranceData = [],
    home_fragranceData = [],
    shampoo_and_conditionerData = [],
    hair_toolsData = [],
    treatmentsData = [],
    stylingData = [],
    hair_colourData = [],
    bath_and_showerData = [],
    hands_and_feetData = [],
    bodyMoisturisersData = [],
    personal_careData = [],
    sun_and_tanningData = [],
    superfoods_and_supplementsData = [],
    aromatherapyData = [],
    wellness_essentialsData = [],
    skincareData = [],
    fragranceData = [],
    hairData = [],
    groomingToolsData = [],
    beardData = [],
    groomingTreatmentsData = [];

  if (!state.theIconic.serums_and_treatments)
    try {
      serums_and_treatmentsData = await serums_and_treatments(
        start,
        end,
        browser
      );
      console.log(
        `${serums_and_treatmentsData?.length} data items scraped for serums_and_treatments`
      );
    } catch (err) {
      console.log("There was an error while scraping serums_and_treatments");
      logError(err);
    }

  if (
    !state.theIconic.serums_and_treatments &&
    serums_and_treatmentsData?.length == 0
  )
    try {
      serums_and_treatmentsData = await serums_and_treatments(
        start,
        end,
        browser
      );
      console.log(
        `${serums_and_treatmentsData?.length} data items scraped for serums_and_treatments`
      );

      if (serums_and_treatmentsData?.length == 0) {
        state.theIconic.serums_and_treatments = true;
      }
    } catch (err) {
      console.log("There was an error while scraping serums_and_treatments");
      logError(err);
    }

  if (!state.theIconic.moisturisers)
    try {
      moisturisersData = await moisturisers(start, end, browser);
      console.log(
        `${moisturisersData?.length} data items scraped for moisturisers`
      );
    } catch (err) {
      console.log("There was an error while scraping moisturisers");
      logError(err);
    }

  if (!state.theIconic.moisturisers && moisturisersData?.length == 0)
    try {
      moisturisersData = await moisturisers(start, end, browser);
      console.log(
        `${moisturisersData?.length} data items scraped for moisturisers`
      );

      if (moisturisersData?.length == 0) {
        state.theIconic.moisturisers = true;
      }
    } catch (err) {
      console.log("There was an error while scraping moisturisers");
      logError(err);
    }

  if (!state.theIconic.cleansers)
    try {
      cleansersData = await cleansers(start, end, browser);
      console.log(`${cleansersData?.length} data items scraped for cleansers`);
    } catch (err) {
      console.log("There was an error while scraping cleansers");
      logError(err);
    }

  if (!state.theIconic.cleansers && cleansersData?.length == 0)
    try {
      cleansersData = await cleansers(start, end, browser);
      console.log(`${cleansersData?.length} data items scraped for cleansers`);

      if (cleansersData?.length == 0) {
        state.theIconic.cleansers = true;
      }
    } catch (err) {
      console.log("There was an error while scraping cleansers");
      logError(err);
    }

  if (!state.theIconic.eye_and_lip_care)
    try {
      eye_and_lip_careData = await eye_and_lip_care(start, end, browser);
      console.log(
        `${eye_and_lip_careData?.length} data items scraped for eye_and_lip_care`
      );
    } catch (err) {
      console.log("There was an error while scraping eye_and_lip_care");
      logError(err);
    }

  if (!state.theIconic.eye_and_lip_care && eye_and_lip_careData?.length == 0)
    try {
      eye_and_lip_careData = await eye_and_lip_care(start, end, browser);
      console.log(
        `${eye_and_lip_careData?.length} data items scraped for eye_and_lip_care`
      );

      if (eye_and_lip_careData?.length == 0) {
        state.theIconic.eye_and_lip_care = true;
      }
    } catch (err) {
      console.log("There was an error while scraping eye_and_lip_care");
      logError(err);
    }

  if (!state.theIconic.tools)
    try {
      toolsData = await tools(start, end, browser);
      console.log(`${toolsData?.length} data items scraped for tools`);
    } catch (err) {
      console.log("There was an error while scraping tools");
      logError(err);
    }

  if (!state.theIconic.tools && toolsData?.length == 0)
    try {
      toolsData = await tools(start, end, browser);
      console.log(`${toolsData?.length} data items scraped for tools`);

      if (toolsData?.length == 0) {
        state.theIconic.tools = true;
      }
    } catch (err) {
      console.log("There was an error while scraping tools");
      logError(err);
    }

  if (!state.theIconic.cosmeceuticals)
    try {
      cosmeceuticalsData = await cosmeceuticals(start, end, browser);
      console.log(
        `${cosmeceuticalsData?.length} data items scraped for cosmeceuticals`
      );
    } catch (err) {
      console.log("There was an error while scraping cosmeceuticals");
      logError(err);
    }

  if (!state.theIconic.cosmeceuticals && cosmeceuticalsData?.length == 0)
    try {
      cosmeceuticalsData = await cosmeceuticals(start, end, browser);
      console.log(
        `${cosmeceuticalsData?.length} data items scraped for cosmeceuticals`
      );

      if (cosmeceuticalsData?.length == 0) {
        state.theIconic.cosmeceuticals = true;
      }
    } catch (err) {
      console.log("There was an error while scraping cosmeceuticals");
      logError(err);
    }

  if (!state.theIconic.masks)
    try {
      masksData = await masks(start, end, browser);
      console.log(`${masksData?.length} data items scraped for masks`);
    } catch (err) {
      console.log("There was an error while scraping masks");
      logError(err);
    }

  if (!state.theIconic.masks && masksData?.length == 0)
    try {
      masksData = await masks(start, end, browser);
      console.log(`${masksData?.length} data items scraped for masks`);

      if (masksData?.length == 0) {
        state.theIconic.masks = true;
      }
    } catch (err) {
      console.log("There was an error while scraping masks");
      logError(err);
    }

  if (!state.theIconic.sun_care)
    try {
      sun_careData = await sun_care(start, end, browser);
      console.log(`${sun_careData?.length} data items scraped for sun_care`);
    } catch (err) {
      console.log("There was an error while scraping sun_care");
      logError(err);
    }

  if (!state.theIconic.sun_care && sun_careData?.length == 0)
    try {
      sun_careData = await sun_care(start, end, browser);
      console.log(`${sun_careData?.length} data items scraped for sun_care`);

      if (sun_careData?.length == 0) {
        state.theIconic.sun_care = true;
      }
    } catch (err) {
      console.log("There was an error while scraping sun_care");
      logError(err);
    }

  if (!state.theIconic.toners_and_mists)
    try {
      toners_and_mistsData = await toners_and_mists(start, end, browser);
      console.log(
        `${toners_and_mistsData?.length} data items scraped for toners_and_mists`
      );
    } catch (err) {
      console.log("There was an error while scraping toners_and_mists");
      logError(err);
    }

  if (!state.theIconic.toners_and_mists && toners_and_mistsData?.length == 0)
    try {
      toners_and_mistsData = await toners_and_mists(start, end, browser);
      console.log(
        `${toners_and_mistsData?.length} data items scraped for toners_and_mists`
      );

      if (toners_and_mistsData?.length == 0) {
        state.theIconic.toners_and_mists = true;
      }
    } catch (err) {
      console.log("There was an error while scraping toners_and_mists");
      logError(err);
    }

  if (!state.theIconic.exfoliators)
    try {
      exfoliatorsData = await exfoliators(start, end, browser);
      console.log(
        `${exfoliatorsData?.length} data items scraped for exfoliators`
      );
    } catch (err) {
      console.log("There was an error while scraping exfoliators");
      logError(err);
    }

  if (!state.theIconic.exfoliators && exfoliatorsData?.length == 0)
    try {
      exfoliatorsData = await exfoliators(start, end, browser);
      console.log(
        `${exfoliatorsData?.length} data items scraped for exfoliators`
      );

      if (exfoliatorsData?.length == 0) {
        state.theIconic.exfoliators = true;
      }
    } catch (err) {
      console.log("There was an error while scraping exfoliators");
      logError(err);
    }

  // Face scraping
  if (!state.theIconic.face)
    try {
      faceData = await face(start, end, browser);
      console.log(`${faceData?.length} data items scraped for face`);
    } catch (err) {
      console.log("There was an error while scraping face");
      logError(err);
    }

  if (!state.theIconic.face && faceData?.length == 0)
    try {
      faceData = await face(start, end, browser);
      console.log(`${faceData?.length} data items scraped for face`);

      if (faceData?.length == 0) {
        state.theIconic.face = true;
      }
    } catch (err) {
      console.log("There was an error while scraping face");
      logError(err);
    }

  // LIPS SCRAPER
  if (!state.theIconic.lips)
    try {
      lipsData = await lips(start, end, browser);
      console.log(`${lipsData?.length} data items scraped for lips`);
    } catch (err) {
      console.log("There was an error while scraping lips");
      logError(err);
    }

  if (!state.theIconic.lips && lipsData?.length == 0)
    try {
      lipsData = await lips(start, end, browser);
      console.log(`${lipsData?.length} data items scraped for lips`);

      if (lipsData?.length == 0) {
        state.theIconic.lips = true;
      }
    } catch (err) {
      console.log("There was an error while scraping lips");
      logError(err);
    }

  // EYES SCRAPER
  if (!state.theIconic.eyes)
    try {
      eyesData = await eyes(start, end, browser);
      console.log(`${eyesData?.length} data items scraped for eyes`);
    } catch (err) {
      console.log("There was an error while scraping eyes");
      logError(err);
    }

  if (!state.theIconic.eyes && eyesData?.length == 0)
    try {
      eyesData = await eyes(start, end, browser);
      console.log(`${eyesData?.length} data items scraped for eyes`);

      if (eyesData?.length == 0) {
        state.theIconic.eyes = true;
      }
    } catch (err) {
      console.log("There was an error while scraping eyes");
      logError(err);
    }

  // EYEBROWS SCRAPER
  if (!state.theIconic.eyebrows)
    try {
      eyebrowsData = await eyebrows(start, end, browser);
      console.log(`${eyebrowsData?.length} data items scraped for eyebrows`);
    } catch (err) {
      console.log("There was an error while scraping eyebrows");
      logError(err);
    }

  if (!state.theIconic.eyebrows && eyebrowsData?.length == 0)
    try {
      eyebrowsData = await eyebrows(start, end, browser);
      console.log(`${eyebrowsData?.length} data items scraped for eyebrows`);

      if (eyebrowsData?.length == 0) {
        state.theIconic.eyebrows = true;
      }
    } catch (err) {
      console.log("There was an error while scraping eyebrows");
      logError(err);
    }

  // BAGS & TOOLS SCRAPER
  if (!state.theIconic.bags_and_tools)
    try {
      bags_and_toolsData = await bags_and_tools(start, end, browser);
      console.log(
        `${bags_and_toolsData?.length} data items scraped for bags_and_tools`
      );
    } catch (err) {
      console.log("There was an error while scraping bags_and_tools");
      logError(err);
    }

  if (!state.theIconic.bags_and_tools && bags_and_toolsData?.length == 0)
    try {
      bags_and_toolsData = await bags_and_tools(start, end, browser);
      console.log(
        `${bags_and_toolsData?.length} data items scraped for bags_and_tools`
      );

      if (bags_and_toolsData?.length == 0) {
        state.theIconic.bags_and_tools = true;
      }
    } catch (err) {
      console.log("There was an error while scraping bags_and_tools");
      logError(err);
    }

  // NAILS SCRAPER
  if (!state.theIconic.nails)
    try {
      nailsData = await nails(start, end, browser);
      console.log(`${nailsData?.length} data items scraped for nails`);
    } catch (err) {
      console.log("There was an error while scraping nails");
      logError(err);
    }

  if (!state.theIconic.nails && nailsData?.length == 0)
    try {
      nailsData = await nails(start, end, browser);
      console.log(`${nailsData?.length} data items scraped for nails`);

      if (nailsData?.length == 0) {
        state.theIconic.nails = true;
      }
    } catch (err) {
      console.log("There was an error while scraping nails");
      logError(err);
    }

  // BRUSHES SCRAPER
  if (!state.theIconic.brushes)
    try {
      brushesData = await brushes(start, end, browser);
      console.log(`${brushesData?.length} data items scraped for brushes`);
    } catch (err) {
      console.log("There was an error while scraping brushes");
      logError(err);
    }

  if (!state.theIconic.brushes && brushesData?.length == 0)
    try {
      brushesData = await brushes(start, end, browser);
      console.log(`${brushesData?.length} data items scraped for brushes`);

      if (brushesData?.length == 0) {
        state.theIconic.brushes = true;
      }
    } catch (err) {
      console.log("There was an error while scraping brushes");
      logError(err);
    }

  // LASHES SCRAPER
  if (!state.theIconic.lashes)
    try {
      lashesData = await lashes(start, end, browser);
      console.log(`${lashesData?.length} data items scraped for lashes`);
    } catch (err) {
      console.log("There was an error while scraping lashes");
      logError(err);
    }

  if (!state.theIconic.lashes && lashesData?.length == 0)
    try {
      lashesData = await lashes(start, end, browser);
      console.log(`${lashesData?.length} data items scraped for lashes`);

      if (lashesData?.length == 0) {
        state.theIconic.lashes = true;
      }
    } catch (err) {
      console.log("There was an error while scraping lashes");
      logError(err);
    }

  // PERSONAL FRAGRANCE SCRAPER
  if (!state.theIconic.personal_fragrance)
    try {
      personal_fragranceData = await personal_fragrance(start, end, browser);
      console.log(
        `${personal_fragranceData?.length} data items scraped for personal_fragrance`
      );
    } catch (err) {
      console.log("There was an error while scraping personal_fragrance");
      logError(err);
    }

  if (
    !state.theIconic.personal_fragrance &&
    personal_fragranceData?.length == 0
  )
    try {
      personal_fragranceData = await personal_fragrance(start, end, browser);
      console.log(
        `${personal_fragranceData?.length} data items scraped for personal_fragrance`
      );

      if (personal_fragranceData?.length == 0) {
        state.theIconic.personal_fragrance = true;
      }
    } catch (err) {
      console.log("There was an error while scraping personal_fragrance");
      logError(err);
    }

  // HOME FRAGRANCE SCRAPER
  if (!state.theIconic.home_fragrance)
    try {
      home_fragranceData = await home_fragrance(start, end, browser);
      console.log(
        `${home_fragranceData?.length} data items scraped for home_fragrance`
      );
    } catch (err) {
      console.log("There was an error while scraping home_fragrance");
      logError(err);
    }

  if (!state.theIconic.home_fragrance && home_fragranceData?.length == 0)
    try {
      home_fragranceData = await home_fragrance(start, end, browser);
      console.log(
        `${home_fragranceData?.length} data items scraped for home_fragrance`
      );

      if (home_fragranceData?.length == 0) {
        state.theIconic.home_fragrance = true;
      }
    } catch (err) {
      console.log("There was an error while scraping home_fragrance");
      logError(err);
    }

  // SHAMPOO & CONDITIONER SCRAPER
  if (!state.theIconic.shampoo_and_conditioner)
    try {
      shampoo_and_conditionerData = await shampoo_and_conditioner(
        start,
        end,
        browser
      );
      console.log(
        `${shampoo_and_conditionerData?.length} data items scraped for shampoo_and_conditioner`
      );
    } catch (err) {
      console.log("There was an error while scraping shampoo_and_conditioner");
      logError(err);
    }

  if (
    !state.theIconic.shampoo_and_conditioner &&
    shampoo_and_conditionerData?.length == 0
  )
    try {
      shampoo_and_conditionerData = await shampoo_and_conditioner(
        start,
        end,
        browser
      );
      console.log(
        `${shampoo_and_conditionerData?.length} data items scraped for shampoo_and_conditioner`
      );

      if (shampoo_and_conditionerData?.length == 0) {
        state.theIconic.shampoo_and_conditioner = true;
      }
    } catch (err) {
      console.log("There was an error while scraping shampoo_and_conditioner");
      logError(err);
    }

  // HAIR TOOLS SCRAPER
  if (!state.theIconic.hair_tools)
    try {
      hair_toolsData = await hair_tools(start, end, browser);
      console.log(
        `${hair_toolsData?.length} data items scraped for hair_tools`
      );
    } catch (err) {
      console.log("There was an error while scraping hair_tools");
      logError(err);
    }

  if (!state.theIconic.hair_tools && hair_toolsData?.length == 0)
    try {
      hair_toolsData = await hair_tools(start, end, browser);
      console.log(
        `${hair_toolsData?.length} data items scraped for hair_tools`
      );

      if (hair_toolsData?.length == 0) {
        state.theIconic.hair_tools = true;
      }
    } catch (err) {
      console.log("There was an error while scraping hair_tools");
      logError(err);
    }

  // TREATMENTS SCRAPER
  if (!state.theIconic.treatments)
    try {
      treatmentsData = await treatments(start, end, browser);
      console.log(
        `${treatmentsData?.length} data items scraped for treatments`
      );
    } catch (err) {
      console.log("There was an error while scraping treatments");
      logError(err);
    }

  if (!state.theIconic.treatments && treatmentsData?.length == 0)
    try {
      treatmentsData = await treatments(start, end, browser);
      console.log(
        `${treatmentsData?.length} data items scraped for treatments`
      );

      if (treatmentsData?.length == 0) {
        state.theIconic.treatments = true;
      }
    } catch (err) {
      console.log("There was an error while scraping treatments");
      logError(err);
    }

  // STYLING SCRAPER
  if (!state.theIconic.styling)
    try {
      stylingData = await styling(start, end, browser);
      console.log(`${stylingData?.length} data items scraped for styling`);
    } catch (err) {
      console.log("There was an error while scraping styling");
      logError(err);
    }

  if (!state.theIconic.styling && stylingData?.length == 0)
    try {
      stylingData = await styling(start, end, browser);
      console.log(`${stylingData?.length} data items scraped for styling`);

      if (stylingData?.length == 0) {
        state.theIconic.styling = true;
      }
    } catch (err) {
      console.log("There was an error while scraping styling");
      logError(err);
    }

  // HAIR COLOUR SCRAPER
  if (!state.theIconic.hair_colour)
    try {
      hair_colourData = await hair_colour(start, end, browser);
      console.log(
        `${hair_colourData?.length} data items scraped for hair_colour`
      );
    } catch (err) {
      console.log("There was an error while scraping hair_colour");
      logError(err);
    }

  if (!state.theIconic.hair_colour && hair_colourData?.length == 0)
    try {
      hair_colourData = await hair_colour(start, end, browser);
      console.log(
        `${hair_colourData?.length} data items scraped for hair_colour`
      );

      if (hair_colourData?.length == 0) {
        state.theIconic.hair_colour = true;
      }
    } catch (err) {
      console.log("There was an error while scraping hair_colour");
      logError(err);
    }

  if (!state.theIconic.bath_and_shower)
    try {
      bath_and_showerData = await bath_and_shower(start, end, browser);
      console.log(
        `${bath_and_showerData?.length} data items scraped for bath_and_shower`
      );
    } catch (err) {
      console.log("There was an error while scraping bath_and_shower");
      logError(err);
    }

  if (!state.theIconic.bath_and_shower && bath_and_showerData?.length == 0)
    try {
      bath_and_showerData = await bath_and_shower(start, end, browser);
      console.log(
        `${bath_and_showerData?.length} data items scraped for bath_and_shower`
      );
      if (bath_and_showerData?.length == 0) {
        state.theIconic.bath_and_shower = true;
      }
    } catch (err) {
      console.log("There was an error while scraping bath_and_shower");
      logError(err);
    }

  if (!state.theIconic.hands_and_feet)
    try {
      hands_and_feetData = await hands_and_feet(start, end, browser);
      console.log(
        `${hands_and_feetData?.length} data items scraped for hands_and_feet`
      );
    } catch (err) {
      console.log("There was an error while scraping hands_and_feet");
      logError(err);
    }

  if (!state.theIconic.hands_and_feet && hands_and_feetData?.length == 0)
    try {
      hands_and_feetData = await hands_and_feet(start, end, browser);
      console.log(
        `${hands_and_feetData?.length} data items scraped for hands_and_feet`
      );
      if (hands_and_feetData?.length == 0) {
        state.theIconic.hands_and_feet = true;
      }
    } catch (err) {
      console.log("There was an error while scraping hands_and_feet");
      logError(err);
    }

  if (!state.theIconic.body_moisturisers)
    try {
      bodyMoisturisersData = await body_moisturisers(start, end, browser);
      console.log(
        `${bodyMoisturisersData?.length} data items scraped for body_moisturisers`
      );
    } catch (err) {
      console.log("There was an error while scraping body_moisturisers");
      logError(err);
    }

  if (!state.theIconic.body_moisturisers && bodyMoisturisersData?.length == 0)
    try {
      bodyMoisturisersData = await body_moisturisers(start, end, browser);
      console.log(
        `${bodyMoisturisersData?.length} data items scraped for body_moisturisers`
      );
      if (bodyMoisturisersData?.length == 0) {
        state.theIconic.body_moisturisers = true;
      }
    } catch (err) {
      console.log("There was an error while scraping body_moisturisers");
      logError(err);
    }

  if (!state.theIconic.personal_care)
    try {
      personal_careData = await personal_care(start, end, browser);
      console.log(
        `${personal_careData?.length} data items scraped for personal_care`
      );
    } catch (err) {
      console.log("There was an error while scraping personal_care");
      logError(err);
    }

  if (!state.theIconic.personal_care && personal_careData?.length == 0)
    try {
      personal_careData = await personal_care(start, end, browser);
      console.log(
        `${personal_careData?.length} data items scraped for personal_care`
      );
      if (personal_careData?.length == 0) {
        state.theIconic.personal_care = true;
      }
    } catch (err) {
      console.log("There was an error while scraping personal_care");
      logError(err);
    }

  if (!state.theIconic.sun_and_tanning)
    try {
      sun_and_tanningData = await sun_and_tanning(start, end, browser);
      console.log(
        `${sun_and_tanningData?.length} data items scraped for sun_and_tanning`
      );
    } catch (err) {
      console.log("There was an error while scraping sun_and_tanning");
      logError(err);
    }

  if (!state.theIconic.sun_and_tanning && sun_and_tanningData?.length == 0)
    try {
      sun_and_tanningData = await sun_and_tanning(start, end, browser);
      console.log(
        `${sun_and_tanningData?.length} data items scraped for sun_and_tanning`
      );
      if (sun_and_tanningData?.length == 0) {
        state.theIconic.sun_and_tanning = true;
      }
    } catch (err) {
      console.log("There was an error while scraping sun_and_tanning");
      logError(err);
    }

  if (!state.theIconic.superfoods_and_supplements)
    try {
      superfoods_and_supplementsData = await superfoods_and_supplements(
        start,
        end,
        browser
      );
      console.log(
        `${superfoods_and_supplementsData?.length} data items scraped for superfoods_and_supplements`
      );
    } catch (err) {
      console.log(
        "There was an error while scraping superfoods_and_supplements"
      );
      logError(err);
    }

  if (
    !state.theIconic.superfoods_and_supplements &&
    superfoods_and_supplementsData?.length == 0
  )
    try {
      superfoods_and_supplementsData = await superfoods_and_supplements(
        start,
        end,
        browser
      );
      console.log(
        `${superfoods_and_supplementsData?.length} data items scraped for superfoods_and_supplements`
      );

      if (superfoods_and_supplementsData?.length == 0) {
        state.theIconic.superfoods_and_supplements = true;
      }
    } catch (err) {
      console.log(
        "There was an error while scraping superfoods_and_supplements"
      );
      logError(err);
    }

  if (!state.theIconic.aromatherapy)
    try {
      aromatherapyData = await aromatherapy(start, end, browser);
      console.log(
        `${aromatherapyData?.length} data items scraped for aromatherapy`
      );
    } catch (err) {
      console.log("There was an error while scraping aromatherapy");
      logError(err);
    }

  if (!state.theIconic.aromatherapy && aromatherapyData?.length == 0)
    try {
      aromatherapyData = await aromatherapy(start, end, browser);
      console.log(
        `${aromatherapyData?.length} data items scraped for aromatherapy`
      );

      if (aromatherapyData?.length == 0) {
        state.theIconic.aromatherapy = true;
      }
    } catch (err) {
      console.log("There was an error while scraping aromatherapy");
      logError(err);
    }

  if (!state.theIconic.wellness_essentials)
    try {
      wellness_essentialsData = await wellness_essentials(start, end, browser);
      console.log(
        `${wellness_essentialsData?.length} data items scraped for wellness_essentials`
      );
    } catch (err) {
      console.log("There was an error while scraping wellness_essentials");
      logError(err);
    }

  if (
    !state.theIconic.wellness_essentials &&
    wellness_essentialsData?.length == 0
  )
    try {
      wellness_essentialsData = await wellness_essentials(start, end, browser);
      console.log(
        `${wellness_essentialsData?.length} data items scraped for wellness_essentials`
      );

      if (wellness_essentialsData?.length == 0) {
        state.theIconic.wellness_essentials = true;
      }
    } catch (err) {
      console.log("There was an error while scraping wellness_essentials");
      logError(err);
    }

  // SKINCARE
  if (!state.theIconic.skincare)
    try {
      skincareData = await skincare(start, end, browser);
      console.log(`${skincareData?.length} data items scraped for skincare`);
    } catch (err) {
      console.log("There was an error while scraping skincare");
      logError(err);
    }

  if (!state.theIconic.skincare && skincareData?.length == 0)
    try {
      skincareData = await skincare(start, end, browser);
      console.log(`${skincareData?.length} data items scraped for skincare`);
      if (skincareData?.length == 0) {
        state.theIconic.skincare = true;
      }
    } catch (err) {
      console.log("There was an error while scraping skincare");
      logError(err);
    }

  // FRAGRANCE
  if (!state.theIconic.fragrance)
    try {
      fragranceData = await fragrance(start, end, browser);
      console.log(`${fragranceData?.length} data items scraped for fragrance`);
    } catch (err) {
      console.log("There was an error while scraping fragrance");
      logError(err);
    }

  if (!state.theIconic.fragrance && fragranceData?.length == 0)
    try {
      fragranceData = await fragrance(start, end, browser);
      console.log(`${fragranceData?.length} data items scraped for fragrance`);
      if (fragranceData?.length == 0) {
        state.theIconic.fragrance = true;
      }
    } catch (err) {
      console.log("There was an error while scraping fragrance");
      logError(err);
    }

  // HAIR
  if (!state.theIconic.hair)
    try {
      hairData = await hair(start, end, browser);
      console.log(`${hairData?.length} data items scraped for hair`);
    } catch (err) {
      console.log("There was an error while scraping hair");
      logError(err);
    }

  if (!state.theIconic.hair && hairData?.length == 0)
    try {
      hairData = await hair(start, end, browser);
      console.log(`${hairData?.length} data items scraped for hair`);
      if (hairData?.length == 0) {
        state.theIconic.hair = true;
      }
    } catch (err) {
      console.log("There was an error while scraping hair");
      logError(err);
    }

  // groomING TOOLS
  if (!state.theIconic.grooming_tools)
    try {
      groomingToolsData = await grooming_tools(start, end, browser);
      console.log(
        `${groomingToolsData?.length} data items scraped for grooming_tools`
      );
    } catch (err) {
      console.log("There was an error while scraping grooming_tools");
      logError(err);
    }

  if (!state.theIconic.grooming_tools && groomingToolsData?.length == 0)
    try {
      groomingToolsData = await grooming_tools(start, end, browser);
      console.log(
        `${groomingToolsData?.length} data items scraped for grooming_tools`
      );
      if (groomingToolsData?.length == 0) {
        state.theIconic.grooming_tools = true;
      }
    } catch (err) {
      console.log("There was an error while scraping grooming_tools");
      logError(err);
    }

  // BEARD
  if (!state.theIconic.beard)
    try {
      beardData = await beard(start, end, browser);
      console.log(`${beardData?.length} data items scraped for beard`);
    } catch (err) {
      console.log("There was an error while scraping beard");
      logError(err);
    }

  if (!state.theIconic.beard && beardData?.length == 0)
    try {
      beardData = await beard(start, end, browser);
      console.log(`${beardData?.length} data items scraped for beard`);
      if (beardData?.length == 0) {
        state.theIconic.beard = true;
      }
    } catch (err) {
      console.log("There was an error while scraping beard");
      logError(err);
    }

  // groomING TREATMENTS
  if (!state.theIconic.grooming_treatments)
    try {
      groomingTreatmentsData = await grooming_treatments(start, end, browser);
      console.log(
        `${groomingTreatmentsData?.length} data items scraped for grooming_treatments`
      );
    } catch (err) {
      console.log("There was an error while scraping grooming_treatments");
      logError(err);
    }

  if (
    !state.theIconic.grooming_treatments &&
    groomingTreatmentsData?.length == 0
  )
    try {
      groomingTreatmentsData = await grooming_treatments(start, end, browser);
      console.log(
        `${groomingTreatmentsData?.length} data items scraped for grooming_treatments`
      );
      if (groomingTreatmentsData?.length == 0) {
        state.theIconic.grooming_treatments = true;
      }
    } catch (err) {
      console.log("There was an error while scraping grooming_treatments");
      logError(err);
    }

  serums_and_treatmentsData = [
    ...serums_and_treatmentsData,
    ...moisturisersData,
    ...cleansersData,
    ...eye_and_lip_careData,
    ...toolsData,
    ...cosmeceuticalsData,
    ...masksData,
    ...sun_careData,
    ...toners_and_mistsData,
    ...exfoliatorsData,
    ...faceData,
    ...lipsData,
    ...nailsData,
    ...brushesData,
    ...lashesData,
    ...personal_fragranceData,
    ...home_fragranceData,
    ...shampoo_and_conditionerData,
    ...hair_toolsData,
    ...treatmentsData,
    ...stylingData,
    ...hair_colourData,
    ...bath_and_showerData,
    ...hands_and_feetData,
    ...bodyMoisturisersData,
    ...personal_careData,
    ...sun_and_tanningData,
    ...superfoods_and_supplementsData,
    ...aromatherapyData,
    ...wellness_essentialsData,
    ...skincareData,
    ...fragranceData,
    ...hairData,
    ...groomingToolsData,
    ...beardData,
    ...groomingTreatmentsData,
  ];

  try {
    serums_and_treatmentsData = await processDataForBeauty(
      serums_and_treatmentsData
    );
    console.log(`spirits data items proccessed`);
  } catch (err) {
    console.log("There was an error while proccessing spirits data");
    logError(err);
  }
  //update db
  try {
    await updateDBEntry(serums_and_treatmentsData);
    console.log(`data items updated`);
  } catch (err) {
    console.log("There was an error while updating data");
    logError(err);
  }
  await browser.close();

  console.log("entries updated for the_iconic");
  return serums_and_treatmentsData?.length == 0;
};

module.exports = scrapeTheIconic;
