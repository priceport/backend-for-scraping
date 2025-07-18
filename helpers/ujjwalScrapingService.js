const redisClient = require('../configs/redis.config');
const extract_unit_and_quantity = require('./extract_unit_and_quantity');
const logError = require('./logError');
const precomputeDailyData = require('./precomputeDailyData');
const precomputeDailyDataFNB = require('./precomputeDailyDataFNB');
const scrapeAelia = require('./scrapeAelia');
const scrapeAeliaAdelaide = require('./scrapeAeliaAdelaide');
const scrapeAeliaChristchurch = require('./scrapeAeliaChristchurch');
const scrapeAeliaQueensland = require('./scrapeAeliaQueensland');
const scrapeAeliaCairns = require('./scrapeAeliaCairns');
const scrapeBeautyBliss = require('./scrapeBeautyBliss');
const scrapeBigBarrel = require('./scrapeBigBarrel');
const scrapeChemistWarehouse = require('./scrapeChemistWarehourse');
const scrapeFarmers = require('./scrapeFarmers');
const scrapeHeinemannSydney = require('./scrapeHeinemannSydney');
const scrapeHeinemannGoldcoast = require('./scrapeHeinemannGoldcoast');
const scrapeLotteBrisbane = require('./scrapeLotteBrisbane');
const scrapeLotteMelbourne = require('./scrapeLotteMelbourne');
const scrapeMecca = require('./scrapeMecca');
const scrapeNzLiquor = require('./scrapeNzLiquor');
const scrapeSephora = require('./scrapeSephora');
const scrapeWhiskyAndMore = require('./scrapeWhiskyAndMore');
const scrapeDanMurphy = require('./scrapeDanMurphy');

const updateDailyPriceStats = require('./updateDailyPriceStats');
const updateProductPriceRank = require('./updateProductPriceRank');
const waitForXTime = require('./waitForXTime');
const puppeteer = require('puppeteer');
const scrapeTheIconic = require('./scrapeTheIconic');
const scrapeAuMecca = require('./scrapeAuMecca');
const scrapeAuSephora = require('./scrapeAuSephora');
const scrapeAuChemistWarehouse = require('./scrapeAuChemistWarehouse');
const scrapeAuThemall = require('./scrapeAuThemall');

const ujjwalScrapingService = async () => {
  let doneAuckland = false,
    doneAdelaide = false,
    doneQueensland = false,
    doneSydney = false,
    doneGoldcoast = false,
    doneMelbourne = false,
    doneBrisbane = false,
    doneChristchurch = false,
    doneCairns = false,
    doneWhiskyAndMore = false,
    doneNzLiquor = false,
    doneBigBarrel = false,
    doneSephora = false,
    doneBeautyBliss = false,
    doneMecca = false,
    doneFarmers = false,
    doneChemistWarehouse = false,
    doneTheIconic = false,
    doneAuMecca = false,
    doneAuSephora = false,
    doneAuChemistWarehouse = false,
    doneAuThemall = false,
    doneDanMurphy = false;

  let start_page = 1,
    end_page = 1;

    let internalStates = {
        auckland: {
          baijiu: false,
          brandy: false,
          cognac: false,
          fortified: false,
          fragrance: false,
          gift_sets: false,
          gin: false,
          liqueurs: false,
          makeup: false,
          mini_bottles: false,
          premium_spirits: false,
          premium_wine: false,
          red: false,
          rose: false,
          rum: false,
          skin_care: false,
          sparkling_champagne: false,
          tequila: false,
          vodka: false,
          whisky: false,
          white: false,
        },
        adelaide: {
          brandy: false,
          cognac: false,
          fragrance: false,
          gift_sets: false,
          gin: false,
          liqueurs: false,
          makeup: false,
          red: false,
          rose: false,
          rum: false,
          skin_care: false,
          sparkling_champagne: false,
          tequila: false,
          vodka: false,
          whisky: false,
          white: false,
        },
        cairns: {
          brandy: false,
          cognac: false,
          fragrance: false,
          gift_sets: false,
          gin: false,
          liqueurs: false,
          makeup: false,
          red: false,
          rose: false,
          rum: false,
          skin_care: false,
          sparkling_champagne: false,
          tequila: false,
          vodka: false,
          whisky: false,
          white: false,
        },
        queensland: {
          baijiu: false,
          brandy: false,
          cognac: false,
          fragrance: false,
          gift_sets: false,
          gin: false,
          liqueurs: false,
          makeup: false,
          mini_bottles: false,
          premium_spirits: false,
          premium_wine: false,
          red: false,
          rose: false,
          rum: false,
          skin_care: false,
          sparkling_champagne: false,
          tequila: false,
          vodka: false,
          whisky: false,
          white: false,
        },
        sydney: {
          accessories: false,
          american_whisky: false,
          australian_whisky: false,
          bath_and_shower: false,
          bitter_aperitif: false,
          blended_whisky: false,
          blusher: false,
          body_care: false,
          bodycare_care: false,
          canadian_whisky: false,
          care: false,
          champagne: false,
          cleansing: false,
          cognac_brandy: false,
          concealer: false,
          eye_care: false,
          eye_shadow: false,
          eyebrows: false,
          eyeliner: false,
          foot_care: false,
          fortified_wine: false,
          foundation: false,
          gin: false,
          hair_care: false,
          hand_care: false,
          home_fragrance_candle: false,
          irish_whisky: false,
          japanese_whisky: false,
          lipstick_and_lipliner: false,
          liqueur: false,
          makeup_sets: false,
          mascara: false,
          masks: false,
          men_bath_and_shower: false,
          men_fragrance_set: false,
          men_fragrance: false,
          men_skincare: false,
          powders: false,
          red_wine: false,
          rose_wine: false,
          rum: false,
          scotch_whisky: false,
          serum: false,
          sherry_port: false,
          single_malt_whisky: false,
          skin_care_sets: false,
          sparkling_wine: false,
          sun_care: false,
          tequila: false,
          toiletries: false,
          vodka: false,
          white_wine: false,
          women_fragrance_set: false,
          women_fragrance: false,
        },
        goldcoast: {
          accessories: false,
          american_whisky: false,
          australian_whisky: false,
          bath_and_shower: false,
          bitter_aperitif: false,
          blended_whisky: false,
          blusher: false,
          body_care: false,
          bodycare_care: false,
          canadian_whisky: false,
          care: false,
          champagne: false,
          cleansing: false,
          cognac_brandy: false,
          concealer: false,
          eye_care: false,
          eye_shadow: false,
          eyebrows: false,
          eyeliner: false,
          foot_care: false,
          fortified_wine: false,
          foundation: false,
          gin: false,
          hair_care: false,
          hand_care: false,
          home_fragrance_candle: false,
          irish_whisky: false,
          japanese_whisky: false,
          lipstick_and_lipliner: false,
          liqueur: false,
          makeup_sets: false,
          mascara: false,
          masks: false,
          men_bath_and_shower: false,
          men_fragrance_set: false,
          men_fragrance: false,
          men_skincare: false,
          powders: false,
          red_wine: false,
          rose_wine: false,
          rum: false,
          scotch_whisky: false,
          serum: false,
          sherry_port: false,
          single_malt_whisky: false,
          skin_care_sets: false,
          sparkling_wine: false,
          sun_care: false,
          tequila: false,
          toiletries: false,
          vodka: false,
          white_wine: false,
          women_fragrance_set: false,
          women_fragrance: false,
        },
        melbourne: {
          baijiu: false,
          bath_shower: false,
          body_care: false,
          brandy: false,
          champagne: false,
          cleansers_and_toners: false,
          cognac: false,
          devices: false,
          eau_de_cologne: false,
          eau_de_parfum: false,
          eau_de_toilette: false,
          eyes: false,
          face: false,
          gin: false,
          home_fragrance: false,
          korean_liquor: false,
          lips: false,
          liqueurs: false,
          masks: false,
          moisturisers: false,
          port_and_sherry: false,
          red_wine: false,
          rum: false,
          serums_essences: false,
          sets_pack: false,
          single_malt: false,
          sparkling_wine: false,
          sun_care: false,
          tequila: false,
          treatments: false,
          vodka: false,
          whiskey: false,
          white_wine: false,
          wine_champagne_beer: false,
        },
        brisbane: {
          baijiu: false,
          bath_shower: false,
          body_care: false,
          brandy: false,
          champagne: false,
          cleansers_and_toners: false,
          cognac: false,
          devices: false,
          eau_de_cologne: false,
          eau_de_parfum: false,
          eau_de_toilette: false,
          eyes: false,
          face: false,
          gin: false,
          home_fragrance: false,
          korean_liquor: false,
          lips: false,
          liqueurs: false,
          masks: false,
          moisturisers: false,
          port_and_sherry: false,
          red_wine: false,
          rum: false,
          serums_essences: false,
          sets_pack: false,
          single_malt: false,
          sparkling_wine: false,
          sun_care: false,
          tequila: false,
          treatments: false,
          vodka: false,
          whiskey: false,
          white_wine: false,
          wine_champagne_beer: false,
        },
        christchurch: {
          baijiu: false,
          brandy: false,
          cognac: false,
          fragrance: false,
          gift_sets: false,
          gin: false,
          liqueurs: false,
          makeup: false,
          mini_bottles: false,
          premium_spirits: false,
          premium_wine: false,
          red: false,
          rose: false,
          rum: false,
          skin_care: false,
          sparkling_champagne: false,
          tequila: false,
          vodka: false,
          whisky: false,
          white: false,
        },
        whiskyAndMore: {
          whisky: false,
          malt: false,
          intlWhisky: false,
          beer: false,
          wine: false,
        },
        nzLiquor: {
          spirits: false,
          wine: false,
          beer: false,
        },
        bigBarrel: {
          spirits: false,
          wine: false,
          beer: false,
          special: false,
        },
        sephora: {
          makeup: false,
          skincare: false,
          tools: false,
          hair: false,
          fragrance: false,
          clean: false,
          bath: false,
        },
        auSephora: {
          makeup: false,
          skincare: false,
          tools: false,
          hair: false,
          fragrance: false,
          clean: false,
          bath: false,
        },
        beautyBliss: {
          makeup: false,
          skincare: false,
          tools: false,
          hair: false,
          bath: false,
        },
        mecca: {
          makeup: false,
          skincare: false,
          hair: false,
          fragrance: false,
          body: false,
        },
        auMecca: {
          makeup: false,
          skincare: false,
          hair: false,
          fragrance: false,
          body: false,
        },
        farmers: {
          face: false,
          makeup: false,
          lips: false,
          eyes: false,
          tools: false,
          tools2: false,
          womenPerfume: false,
          menAfterShave: false,
          deodorant: false,
          moisturiser: false,
          exfoliators: false,
          cleansers: false,
          toners: false,
          treatments: false,
          eyecream: false,
          grooming: false,
          nailtools: false,
          nailpolish: false,
          bodycare: false,
          footcare: false,
          bathcare: false,
          suncare: false,
          haircare: false,
          haircolor: false,
          hairaccessories: false,
          skincare: false,
          collegens: false,
        },
        chemistWarehouse: {
          fragrance: false,
          beauty: false,
          skincare: false,
          cosmetic: false,
          haircare: false,
        },
        auChemistWarehouse: {
          fragrance: false,
          personal_care: false,
          skincare: false,
          cosmetic: false,
          haircare: false,
        },
        theIconic: {
          serums_and_treatments: false,
          moisturisers: false,
          cleansers: false,
          eye_and_lip_care: false,
          tools: false,
          cosmeceuticals: false,
          masks: false,
          sun_care: false,
          toners_and_mists: false,
          exfoliators: false,
          face: false,
          lips: false,
          eyes: false,
          eyebrows: false,
          bags_and_tools: false,
          nails: false,
          brushes: false,
          lashes: false,
          personal_fragrance: false,
          home_fragrance: false,
          shampoo_and_conditioner: false,
          hair_tools: false,
          treatments: false,
          styling: false,
          hair_colour: false,
          bath_and_shower: false,
          hands_and_feet: false,
          body_moisturisers: false,
          personal_care: false,
          sun_and_tanning: false,
          superfoods_and_supplements: false,
          aromatherapy: false,
          wellness_essentials: false,
          skincare: false,
          fragrance: false,
          hair: false,
          grooming_tools: false,
          beard: false,
          grooming_treatments: false,
        },
        auThemall: {
          whiskey: false,
          gin: false,
          liqueurs: false,
          rum: false,
          vodka: false,
          brandy: false,
          cognac: false,
          tequila: false,
          baijiu: false,
          bourbon: false,
          champagne_sparkling: false,
          port_sherry: false,
          red_wine: false,
          rose_wine: false,
          white_wine: false,
          luxury_wine: false,
          womens_fragrance: false,
          mens_fragrance: false,
          unisex_fragrance: false,
          under_80: false,
          moisturisers: false,
          cleansers_toners: false,
          masks_exfoliators: false,
          serums_boosters: false,
          eyes: false,
          lips: false,
          suncare: false,
          face: false,
          makeup_eyes: false,
          makeup_lips: false,
          tools: false,
          body: false,
          bath_shower: false,
          hair: false,
          hand_feet_care: false,
          bath_suncare: false,
          nz_skincare: false,
          nz_body: false,
          mens_skincare: false,
          mens_body: false,
          mens_grooming: false,
        },
        danMurphy: {
          aperitifs: false,
          baijiu: false,
          beer: false,
          bourbon: false,
          brandy_cognac: false,
          champagne_sparkling: false,
          cider: false,
          gin: false,
          liqueurs: false,
          premix_drinks: false,
          red_wine: false,
          rum: false,
          sake: false,
          soju_shochu: false,
          spirits: false,
          tequila: false,
          vodka: false,
          whisky: false,
          white_wine: false,
        },
      };

  // =============== OXYLABS PROXY CONFIGURATION ===============
  const oxyLabsUsers = [
    { user: 'ujjwal_mzCYS', password: 'ujjwalP922_2' },
    { user: 'anmol_Ef7H3', password: 'ujjwalP922_2' }, 
    { user: 'hitest_i8G5X', password: 'ujjwalP922_2' }, 
    { user: 'manoj_nN8Rk', password: 'ujjwalP922_2' },
    { user: 'aditya_Tzbm7', password: 'ujjwalP922_2' },
  ];

  const countries = [ 'AU', 'NZ', 'GB'];
  const endpoint = 'dc.oxylabs.io:8000';

  // Generate all proxy combinations
  const oxyLabsProxies = [];
  oxyLabsUsers.forEach(userObj => {
    countries.forEach(country => {
      oxyLabsProxies.push({
        username: `user-${userObj.user}-country-${country}`,
        password: userObj.password,
        endpoint: endpoint,
        country: country,
        user: userObj.user
      });
    });
  });

  console.log(`Generated ${oxyLabsProxies.length} proxy combinations from ${oxyLabsUsers.length} users`);

  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  ];

  const getRandomOxyProxy = () => 
    oxyLabsProxies[Math.floor(Math.random() * oxyLabsProxies.length)];
  
  const getRandomUserAgent = () =>
    userAgents[Math.floor(Math.random() * userAgents.length)];

  // Function to get appropriate proxy based on target site
  const getProxyForSite = (siteName) => {
    let countryProxies = [];
    
    // Use AU/NZ proxies for Australian/NZ sites
    if (siteName.includes('au') || siteName.includes('australia')) {
      countryProxies = oxyLabsProxies.filter(p => p.country === 'AU');
    } else if (siteName.includes('nz') || siteName.includes('newzealand')) {
      countryProxies = oxyLabsProxies.filter(p => p.country === 'NZ');
    }
    
    // If we have country-specific proxies, use them, otherwise use random
    if (countryProxies.length > 0) {
      return countryProxies[Math.floor(Math.random() * countryProxies.length)];
    }
    
    return getRandomOxyProxy();
  };

  // Function to get proxy by user (for load balancing)
  const getProxyByUser = (userIndex, country = null) => {
    const targetUser = oxyLabsUsers[userIndex % oxyLabsUsers.length].user;
    let userProxies = oxyLabsProxies.filter(p => p.user === targetUser);
    
    if (country) {
      userProxies = userProxies.filter(p => p.country === country);
    }
    
    return userProxies[Math.floor(Math.random() * userProxies.length)];
  };

  const createBrowserWithOxyProxy = async (proxy) => {
    const proxyServer = `http://${proxy.username}:${proxy.password}@${proxy.endpoint}`;
    
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        `--proxy-server=${proxyServer}`,
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--ignore-certificate-errors',
        '--ignore-ssl-errors',
        '--ignore-certificate-errors-spki-list',
      ],
    });

    return browser;
  };

  const setupPage = async (page) => {
    // Set random user agent
    await page.setUserAgent(getRandomUserAgent());

    // Set viewport
    await page.setViewport({
      width: 1366 + Math.floor(Math.random() * 100),
      height: 768 + Math.floor(Math.random() * 100),
    });

    // Set extra headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    });

    // Add stealth measures
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    // Override permissions API
    await page.evaluateOnNewDocument(() => {
      const originalQuery = window.navigator.permissions.query;
      return (window.navigator.permissions.query = (parameters) =>
        parameters.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters));
    });

    // Add random delays to mimic human behavior
    await page.evaluateOnNewDocument(() => {
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        return new Promise(resolve => {
          setTimeout(() => resolve(originalFetch.apply(this, args)), Math.random() * 100);
        });
      };
    });
  };

  // Test proxy connection
  const testProxyConnection = async (proxy) => {
    try {
      const browser = await createBrowserWithOxyProxy(proxy);
      const page = await browser.newPage();
      await setupPage(page);
      
      console.log(`Testing proxy: ${proxy.country}`);
      
      // Test connection by visiting a simple page
      await page.goto('https://httpbin.org/ip', { waitUntil: 'networkidle2', timeout: 30000 });
      const content = await page.content();
      console.log(`Proxy ${proxy.country} working:`, content.includes('origin'));
      
      await browser.close();
      return true;
    } catch (error) {
      console.log(`Proxy ${proxy.country} failed:`, error.message);
      return false;
    }
  };

  // Test all proxies before starting
  console.log('Testing Oxylabs proxies...');
//   for (const proxy of oxyLabsProxies) {
//     await testProxyConnection(proxy);
//     await waitForXTime(2000); // 2 second delay between tests
//   }

  // Main scraping loop with user-based load balancing
  let userIndex = 0;
  while (
    !doneAuckland ||
    !doneAdelaide ||
    !doneQueensland ||
    !doneSydney ||
    !doneGoldcoast ||
    !doneMelbourne ||
    !doneBrisbane ||
    !doneChristchurch ||
    !doneCairns ||
    !doneWhiskyAndMore ||
    !doneNzLiquor ||
    !doneBigBarrel ||
    !doneSephora ||
    !doneBeautyBliss ||
    !doneMecca ||
    !doneFarmers ||
    !doneChemistWarehouse ||
    !doneTheIconic ||
    !doneAuMecca ||
    !doneAuSephora ||
    !doneAuChemistWarehouse ||
    !doneAuThemall ||
    !doneDanMurphy
  ) {
    
    // Example: Scrape Dan Murphy with AU proxy from rotating user
    if (!doneDanMurphy) {
      try {
        const proxy = getProxyByUser(userIndex, 'AU');
        const browser = await createBrowserWithOxyProxy(proxy);
        console.log(`Scraping Dan Murphy with ${proxy.country} proxy (User: ${proxy.user})`);
        
        doneDanMurphy = await scrapeDanMurphy(
          start_page,
          end_page,
          internalStates,
          browser
        );
        
        await browser.close();
        userIndex++;
      } catch (err) {
        console.log('There was an error while scraping from dan murphy');
        logError(err);
      }
    }

    // Example: Scrape AU sites with AU proxy from next user
    if (!doneAuMecca) {
      try {
        const proxy = getProxyByUser(userIndex, 'AU');
        const browser = await createBrowserWithOxyProxy(proxy);
        console.log(`Scraping AU Mecca with ${proxy.country} proxy (User: ${proxy.user})`);
        
        doneAuMecca = await scrapeAuMecca(
          start_page,
          end_page,
          internalStates,
          browser
        );
        
        await browser.close();
        userIndex++;
      } catch (err) {
        console.log('There was an error while scraping from australia mecca');
        logError(err);
      }
    }

    // Example: Scrape NZ sites with NZ proxy from next user
    if (!doneAuckland) {
      try {
        const proxy = getProxyByUser(userIndex, 'NZ');
        const browser = await createBrowserWithOxyProxy(proxy);
        console.log(`Scraping Auckland with ${proxy.country} proxy (User: ${proxy.user})`);
        
        doneAuckland = await scrapeAelia(
          start_page,
          end_page,
          internalStates,
          browser
        );
        
        await browser.close();
        userIndex++;
      } catch (err) {
        console.log('There was an error while scraping from aelia auckland');
        logError(err);
      }
    }

    // Add similar blocks for other scrapers...
    // Each with rotating user selection

    end_page += 1;
    start_page += 1;

    // Random delay between requests (increased for residential proxies)
    await waitForXTime(20000 + Math.random() * 15000); // 20-35 seconds
  }

  await redisClient.flushAll();
  console.log('Cache cleared');
  await extract_unit_and_quantity();
  await updateProductPriceRank();
  await updateDailyPriceStats('aelia_auckland');
  await precomputeDailyData('aelia_auckland', true);
  await precomputeDailyDataFNB();
};

module.exports = ujjwalScrapingService;