const skin_care = require("../scripts/scraping_scripts/domestic/ishopchangi/skin_care");
const makeup = require("../scripts/scraping_scripts/domestic/ishopchangi/makeup");
const hair_care = require("../scripts/scraping_scripts/domestic/ishopchangi/hair_care");
const fragrance = require("../scripts/scraping_scripts/domestic/ishopchangi/fragrance");
const bath_and_beauty = require("../scripts/scraping_scripts/domestic/ishopchangi/bath_and_beauty");
const computers_and_peripherals = require("../scripts/scraping_scripts/domestic/ishopchangi/computers_and_peripherals");
const mobile_and_smart_devices = require("../scripts/scraping_scripts/domestic/ishopchangi/mobile_and_smart_devices");
const audio_devices = require("../scripts/scraping_scripts/domestic/ishopchangi/audio_devices");
const cameras_and_drones = require("../scripts/scraping_scripts/domestic/ishopchangi/cameras_and_drones");
const snacks_and_sweets = require("../scripts/scraping_scripts/domestic/ishopchangi/snacks_and_sweets");
const coffee_and_tea = require("../scripts/scraping_scripts/domestic/ishopchangi/coffee_and_tea");
const health_food = require("../scripts/scraping_scripts/domestic/ishopchangi/health_food");
const souvenir_food = require("../scripts/scraping_scripts/domestic/ishopchangi/souvenir_food");
const food_staples = require("../scripts/scraping_scripts/domestic/ishopchangi/food_staples");
const family_planning = require("../scripts/scraping_scripts/domestic/ishopchangi/family_planning");
const personal_care = require("../scripts/scraping_scripts/domestic/ishopchangi/personal_care");
const wellness_accessories = require("../scripts/scraping_scripts/domestic/ishopchangi/wellness_accessories");
const health_supplements = require("../scripts/scraping_scripts/domestic/ishopchangi/health_supplements");
const medical_supplies = require("../scripts/scraping_scripts/domestic/ishopchangi/medical_supplies");
const medication = require("../scripts/scraping_scripts/domestic/ishopchangi/medication");
const food_care = require("../scripts/scraping_scripts/domestic/ishopchangi/food_care");
const womens_fashion_bags = require("../scripts/scraping_scripts/domestic/ishopchangi/womens_fashion_bags");
const womens_small_leather_goods = require("../scripts/scraping_scripts/domestic/ishopchangi/womens_small_leather_goods");
const womens_fashion_watches = require("../scripts/scraping_scripts/domestic/ishopchangi/womens_fashion_watches");
const womens_fashion_jewellery = require("../scripts/scraping_scripts/domestic/ishopchangi/womens_fashion_jewellery");
const womens_fashion_accessories = require("../scripts/scraping_scripts/domestic/ishopchangi/womens_fashion_accessories");
const womens_fashion_shoes = require("../scripts/scraping_scripts/domestic/ishopchangi/womens_fashion_shoes");
const womens_apparels = require("../scripts/scraping_scripts/domestic/ishopchangi/womens_apparels");
const mens_fashion_bags = require("../scripts/scraping_scripts/domestic/ishopchangi/mens_fashion_bags");
const mens_small_leather_goods = require("../scripts/scraping_scripts/domestic/ishopchangi/mens_small_leather_goods");
const mens_fashion_watches = require("../scripts/scraping_scripts/domestic/ishopchangi/mens_fashion_watches");
const mens_fashion_jewellery = require("../scripts/scraping_scripts/domestic/ishopchangi/mens_fashion_jewellery");
const mens_fashion_accessories = require("../scripts/scraping_scripts/domestic/ishopchangi/mens_fashion_accessories");
const mens_fashion_shoes = require("../scripts/scraping_scripts/domestic/ishopchangi/mens_fashion_shoes");
const mens_apparels = require("../scripts/scraping_scripts/domestic/ishopchangi/mens_apparels");
const kitchen_and_dining = require("../scripts/scraping_scripts/domestic/ishopchangi/kitchen_and_dining");
const personal_care_home_and_living = require("../scripts/scraping_scripts/domestic/ishopchangi/personal_care_home_and_living");
const beauty_tools = require("../scripts/scraping_scripts/domestic/ishopchangi/beauty_tools");
const wellness_and_health_devices = require("../scripts/scraping_scripts/domestic/ishopchangi/wellness_and_health_devices");
const household_essentials = require("../scripts/scraping_scripts/domestic/ishopchangi/household_essentials");
const babies_and_kids_fashion = require("../scripts/scraping_scripts/domestic/ishopchangi/babies_and_kids_fashion");
const baby_gears = require("../scripts/scraping_scripts/domestic/ishopchangi/baby_gears");
const bath = require("../scripts/scraping_scripts/domestic/ishopchangi/bath");
const feeding_and_nursing = require("../scripts/scraping_scripts/domestic/ishopchangi/feeding_and_nursing");
const nursery = require("../scripts/scraping_scripts/domestic/ishopchangi/nursery");
const toys_and_games = require("../scripts/scraping_scripts/domestic/ishopchangi/toys_and_games");
const logError = require("./logError");
const processDataForBeauty = require("./data_processing/ishopchangi/beauty");
const updateDBEntry = require("./update_db_entry/ishopchangi/beauty");

const scrapeIshopChangi = async (start,end,state,browser) =>{
    console.log("scraping started for ishop changi at:"+Date.now());

    let allData = [], skinCareData = [], makeupData = [], hairCareData = [], fragranceData = [], bathAndBeautyData = [], computersData = [], mobileDevicesData = [], audioDevicesData = [], camerasData = [], snacksData = [], coffeeTeaData = [], healthFoodData = [], souvenirFoodData = [], foodStaplesData = [], familyPlanningData = [], personalCareData = [], wellnessAccessoriesData = [], healthSupplementsData = [], medicalSuppliesData = [], medicationData = [], foodCareData = [], womensFashionBagsData = [], womensSmallLeatherGoodsData = [], womensFashionWatchesData = [], womensFashionJewelleryData = [], womensFashionAccessoriesData = [], womensFashionShoesData = [], womensApparelsData = [], mensFashionBagsData = [], mensSmallLeatherGoodsData = [], mensFashionWatchesData = [], mensFashionJewelleryData = [], mensFashionAccessoriesData = [], mensFashionShoesData = [], mensApparelsData = [], kitchenAndDiningData = [], personalCareHomeAndLivingData = [], beautyToolsData = [], wellnessAndHealthDevicesData = [], householdEssentialsData = [], babiesAndKidsFashionData = [], babyGearsData = [], bathData = [], feedingAndNursingData = [], nurseryData = [], toysAndGamesData = [];

    // Beauty categories
    if(!state.ishopchangi.skin_care)
        try{
            skinCareData = await skin_care(start,end,browser);
            console.log(`${skinCareData?.length} data items scraped for skin care`);
        }
        catch(err){
            console.log("There was an error while scraping skin care");
            logError(err);
        }

    if(!state.ishopchangi.skin_care && skinCareData?.length==0)
        try{
            skinCareData = await skin_care(start,end,browser);
            console.log(`${skinCareData?.length} data items scraped for skin care`);
            if(skinCareData?.length==0){
                state.ishopchangi.skin_care = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping skin care");
            logError(err);
        }

    if(!state.ishopchangi.makeup)
        try{
            makeupData = await makeup(start,end,browser);
            console.log(`${makeupData?.length} data items scraped for makeup`);
        }
        catch(err){
            console.log("There was an error while scraping makeup");
            logError(err);
        }

    if(!state.ishopchangi.makeup&&makeupData?.length==0)
        try{
            makeupData = await makeup(start,end,browser);
            console.log(`${makeupData?.length} data items scraped for makeup`);
         
            if(makeupData?.length==0) {
                state.ishopchangi.makeup=true;
            }
        }
        catch(err){
            console.log("There was an error while scraping makeup");
            logError(err);
        }

    if(!state.ishopchangi.hair_care)
        try{
            hairCareData = await hair_care(start,end,browser);
            console.log(`${hairCareData?.length} data items scraped for hair care`);
        }
        catch(err){
            console.log("There was an error while scraping hair care");
            logError(err);
        }

    if(!state.ishopchangi.hair_care && hairCareData?.length==0)
        try{
            hairCareData = await hair_care(start,end,browser);
            console.log(`${hairCareData?.length} data items scraped for hair care`);
            if(hairCareData?.length==0){
                state.ishopchangi.hair_care = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping hair care");
            logError(err);
        }

    if(!state.ishopchangi.fragrance)
        try{
            fragranceData = await fragrance(start,end,browser);
            console.log(`${fragranceData?.length} data items scraped for fragrance`);
        }
        catch(err){
            console.log("There was an error while scraping fragrance");
            logError(err);
        }

    if(!state.ishopchangi.fragrance && fragranceData?.length==0)
        try{
            fragranceData = await fragrance(start,end,browser);
            console.log(`${fragranceData?.length} data items scraped for fragrance`);
            if(fragranceData?.length==0){
                state.ishopchangi.fragrance = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping fragrance");
            logError(err);
        }
    
    if(!state.ishopchangi.bath_and_beauty)
        try{
            bathAndBeautyData = await bath_and_beauty(start,end,browser);
            console.log(`${bathAndBeautyData?.length} data items scraped for bath and beauty`);
        }
        catch(err){
            console.log("There was an error while scraping bath and beauty");
            logError(err);
        }

    if(!state.ishopchangi.bath_and_beauty && bathAndBeautyData?.length==0)
        try{
            bathAndBeautyData = await bath_and_beauty(start,end,browser);
            console.log(`${bathAndBeautyData?.length} data items scraped for bath and beauty`);
            if(bathAndBeautyData?.length==0){
                state.ishopchangi.bath_and_beauty = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping bath and beauty");
            logError(err);
        }

    // Electronics categories
    if(!state.ishopchangi.computers_and_peripherals)
        try{
            computersData = await computers_and_peripherals(start,end,browser);
            console.log(`${computersData?.length} data items scraped for computers and peripherals`);
        }
        catch(err){
            console.log("There was an error while scraping computers and peripherals");
            logError(err);
        }

    if(!state.ishopchangi.computers_and_peripherals && computersData?.length==0)
        try{
            computersData = await computers_and_peripherals(start,end,browser);
            console.log(`${computersData?.length} data items scraped for computers and peripherals`);
            if(computersData?.length==0){
                state.ishopchangi.computers_and_peripherals = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping computers and peripherals");
            logError(err);
        }

    if(!state.ishopchangi.mobile_and_smart_devices)
        try{
            mobileDevicesData = await mobile_and_smart_devices(start,end,browser);
            console.log(`${mobileDevicesData?.length} data items scraped for mobile and smart devices`);
        }
        catch(err){
            console.log("There was an error while scraping mobile and smart devices");
            logError(err);
        }

    if(!state.ishopchangi.mobile_and_smart_devices && mobileDevicesData?.length==0)
        try{
            mobileDevicesData = await mobile_and_smart_devices(start,end,browser);
            console.log(`${mobileDevicesData?.length} data items scraped for mobile and smart devices`);
            if(mobileDevicesData?.length==0){
                state.ishopchangi.mobile_and_smart_devices = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping mobile and smart devices");
            logError(err);
        }

    if(!state.ishopchangi.audio_devices)
        try{
            audioDevicesData = await audio_devices(start,end,browser);
            console.log(`${audioDevicesData?.length} data items scraped for audio devices`);
        }
        catch(err){
            console.log("There was an error while scraping audio devices");
            logError(err);
        }

    if(!state.ishopchangi.audio_devices && audioDevicesData?.length==0)
        try{
            audioDevicesData = await audio_devices(start,end,browser);
            console.log(`${audioDevicesData?.length} data items scraped for audio devices`);
            if(audioDevicesData?.length==0){
                state.ishopchangi.audio_devices = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping audio devices");
            logError(err);
        }

    if(!state.ishopchangi.cameras_and_drones)
        try{
            camerasData = await cameras_and_drones(start,end,browser);
            console.log(`${camerasData?.length} data items scraped for cameras and drones`);
        }
        catch(err){
            console.log("There was an error while scraping cameras and drones");
            logError(err);
        }

    if(!state.ishopchangi.cameras_and_drones && camerasData?.length==0)
        try{
            camerasData = await cameras_and_drones(start,end,browser);
            console.log(`${camerasData?.length} data items scraped for cameras and drones`);
            if(camerasData?.length==0){
                state.ishopchangi.cameras_and_drones = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping cameras and drones");
            logError(err);
        }

    // Food and Beverages categories
    if(!state.ishopchangi.snacks_and_sweets)
        try{
            snacksData = await snacks_and_sweets(start,end,browser);
            console.log(`${snacksData?.length} data items scraped for snacks and sweets`);
        }
        catch(err){
            console.log("There was an error while scraping snacks and sweets");
            logError(err);
        }

    if(!state.ishopchangi.snacks_and_sweets && snacksData?.length==0)
        try{
            snacksData = await snacks_and_sweets(start,end,browser);
            console.log(`${snacksData?.length} data items scraped for snacks and sweets`);
            if(snacksData?.length==0){
                state.ishopchangi.snacks_and_sweets = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping snacks and sweets");
            logError(err);
        }

    if(!state.ishopchangi.coffee_and_tea)
        try{
            coffeeTeaData = await coffee_and_tea(start,end,browser);
            console.log(`${coffeeTeaData?.length} data items scraped for coffee and tea`);
        }
        catch(err){
            console.log("There was an error while scraping coffee and tea");
            logError(err);
        }

    if(!state.ishopchangi.coffee_and_tea && coffeeTeaData?.length==0)
        try{
            coffeeTeaData = await coffee_and_tea(start,end,browser);
            console.log(`${coffeeTeaData?.length} data items scraped for coffee and tea`);
            if(coffeeTeaData?.length==0){
                state.ishopchangi.coffee_and_tea = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping coffee and tea");
            logError(err);
        }

    if(!state.ishopchangi.health_food)
        try{
            healthFoodData = await health_food(start,end,browser);
            console.log(`${healthFoodData?.length} data items scraped for health food`);
        }
        catch(err){
            console.log("There was an error while scraping health food");
            logError(err);
        }

    if(!state.ishopchangi.health_food && healthFoodData?.length==0)
        try{
            healthFoodData = await health_food(start,end,browser);
            console.log(`${healthFoodData?.length} data items scraped for health food`);
            if(healthFoodData?.length==0){
                state.ishopchangi.health_food = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping health food");
            logError(err);
        }

    if(!state.ishopchangi.souvenir_food)
        try{
            souvenirFoodData = await souvenir_food(start,end,browser);
            console.log(`${souvenirFoodData?.length} data items scraped for souvenir food`);
        }
        catch(err){
            console.log("There was an error while scraping souvenir food");
            logError(err);
        }

    if(!state.ishopchangi.souvenir_food && souvenirFoodData?.length==0)
        try{
            souvenirFoodData = await souvenir_food(start,end,browser);
            console.log(`${souvenirFoodData?.length} data items scraped for souvenir food`);
            if(souvenirFoodData?.length==0){
                state.ishopchangi.souvenir_food = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping souvenir food");
            logError(err);
        }

    if(!state.ishopchangi.food_staples)
        try{
            foodStaplesData = await food_staples(start,end,browser);
            console.log(`${foodStaplesData?.length} data items scraped for food staples`);
        }
        catch(err){
            console.log("There was an error while scraping food staples");
            logError(err);
        }

    if(!state.ishopchangi.food_staples && foodStaplesData?.length==0)
        try{
            foodStaplesData = await food_staples(start,end,browser);
            console.log(`${foodStaplesData?.length} data items scraped for food staples`);
            if(foodStaplesData?.length==0){
                state.ishopchangi.food_staples = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping food staples");
            logError(err);
        }

    // Health and Wellness categories
    if(!state.ishopchangi.family_planning)
        try{
            familyPlanningData = await family_planning(start,end,browser);
            console.log(`${familyPlanningData?.length} data items scraped for family planning`);
        }
        catch(err){
            console.log("There was an error while scraping family planning");
            logError(err);
        }

    if(!state.ishopchangi.family_planning && familyPlanningData?.length==0)
        try{
            familyPlanningData = await family_planning(start,end,browser);
            console.log(`${familyPlanningData?.length} data items scraped for family planning`);
            if(familyPlanningData?.length==0){
                state.ishopchangi.family_planning = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping family planning");
            logError(err);
        }

    if(!state.ishopchangi.personal_care)
        try{
            personalCareData = await personal_care(start,end,browser);
            console.log(`${personalCareData?.length} data items scraped for personal care`);
        }
        catch(err){
            console.log("There was an error while scraping personal care");
            logError(err);
        }

    if(!state.ishopchangi.personal_care && personalCareData?.length==0)
        try{
            personalCareData = await personal_care(start,end,browser);
            console.log(`${personalCareData?.length} data items scraped for personal care`);
            if(personalCareData?.length==0){
                state.ishopchangi.personal_care = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping personal care");
            logError(err);
        }

    if(!state.ishopchangi.wellness_accessories)
        try{
            wellnessAccessoriesData = await wellness_accessories(start,end,browser);
            console.log(`${wellnessAccessoriesData?.length} data items scraped for wellness accessories`);
        }
        catch(err){
            console.log("There was an error while scraping wellness accessories");
            logError(err);
        }

    if(!state.ishopchangi.wellness_accessories && wellnessAccessoriesData?.length==0)
        try{
            wellnessAccessoriesData = await wellness_accessories(start,end,browser);
            console.log(`${wellnessAccessoriesData?.length} data items scraped for wellness accessories`);
            if(wellnessAccessoriesData?.length==0){
                state.ishopchangi.wellness_accessories = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping wellness accessories");
            logError(err);
        }

    if(!state.ishopchangi.health_supplements)
        try{
            healthSupplementsData = await health_supplements(start,end,browser);
            console.log(`${healthSupplementsData?.length} data items scraped for health supplements`);
        }
        catch(err){
            console.log("There was an error while scraping health supplements");
            logError(err);
        }

    if(!state.ishopchangi.health_supplements && healthSupplementsData?.length==0)
        try{
            healthSupplementsData = await health_supplements(start,end,browser);
            console.log(`${healthSupplementsData?.length} data items scraped for health supplements`);
            if(healthSupplementsData?.length==0){
                state.ishopchangi.health_supplements = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping health supplements");
            logError(err);
        }

    if(!state.ishopchangi.medical_supplies)
        try{
            medicalSuppliesData = await medical_supplies(start,end,browser);
            console.log(`${medicalSuppliesData?.length} data items scraped for medical supplies`);
        }
        catch(err){
            console.log("There was an error while scraping medical supplies");
            logError(err);
        }

    if(!state.ishopchangi.medical_supplies && medicalSuppliesData?.length==0)
        try{
            medicalSuppliesData = await medical_supplies(start,end,browser);
            console.log(`${medicalSuppliesData?.length} data items scraped for medical supplies`);
            if(medicalSuppliesData?.length==0){
                state.ishopchangi.medical_supplies = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping medical supplies");
            logError(err);
        }

    if(!state.ishopchangi.medication)
        try{
            medicationData = await medication(start,end,browser);
            console.log(`${medicationData?.length} data items scraped for medication`);
        }
        catch(err){
            console.log("There was an error while scraping medication");
            logError(err);
        }

    if(!state.ishopchangi.medication && medicationData?.length==0)
        try{
            medicationData = await medication(start,end,browser);
            console.log(`${medicationData?.length} data items scraped for medication`);
            if(medicationData?.length==0){
                state.ishopchangi.medication = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping medication");
            logError(err);
        }

    if(!state.ishopchangi.foodcare)
        try{
            foodCareData = await food_care(start,end,browser);
            console.log(`${foodCareData?.length} data items scraped for food care`);
        }
        catch(err){
            console.log("There was an error while scraping food care");
            logError(err);
        }

    if(!state.ishopchangi.foodcare && foodCareData?.length==0)
        try{
            foodCareData = await food_care(start,end,browser);
            console.log(`${foodCareData?.length} data items scraped for food care`);
            if(foodCareData?.length==0){
                state.ishopchangi.foodcare = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping food care");
            logError(err);
        }

    // Women's Fashion categories
    if(!state.ishopchangi.womens_fashion_bags)
        try{
            womensFashionBagsData = await womens_fashion_bags(start,end,browser);
            console.log(`${womensFashionBagsData?.length} data items scraped for women's fashion bags`);
        }
        catch(err){
            console.log("There was an error while scraping women's fashion bags");
            logError(err);
        }

    if(!state.ishopchangi.womens_fashion_bags && womensFashionBagsData?.length==0)
        try{
            womensFashionBagsData = await womens_fashion_bags(start,end,browser);
            console.log(`${womensFashionBagsData?.length} data items scraped for women's fashion bags`);
            if(womensFashionBagsData?.length==0){
                state.ishopchangi.womens_fashion_bags = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping women's fashion bags");
            logError(err);
        }

    if(!state.ishopchangi.womens_small_leather_goods)
        try{
            womensSmallLeatherGoodsData = await womens_small_leather_goods(start,end,browser);
            console.log(`${womensSmallLeatherGoodsData?.length} data items scraped for women's small leather goods`);
        }
        catch(err){
            console.log("There was an error while scraping women's small leather goods");
            logError(err);
        }

    if(!state.ishopchangi.womens_small_leather_goods && womensSmallLeatherGoodsData?.length==0)
        try{
            womensSmallLeatherGoodsData = await womens_small_leather_goods(start,end,browser);
            console.log(`${womensSmallLeatherGoodsData?.length} data items scraped for women's small leather goods`);
            if(womensSmallLeatherGoodsData?.length==0){
                state.ishopchangi.womens_small_leather_goods = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping women's small leather goods");
            logError(err);
        }

    if(!state.ishopchangi.womens_fashion_watches)
        try{
            womensFashionWatchesData = await womens_fashion_watches(start,end,browser);
            console.log(`${womensFashionWatchesData?.length} data items scraped for women's fashion watches`);
        }
        catch(err){
            console.log("There was an error while scraping women's fashion watches");
            logError(err);
        }

    if(!state.ishopchangi.womens_fashion_watches && womensFashionWatchesData?.length==0)
        try{
            womensFashionWatchesData = await womens_fashion_watches(start,end,browser);
            console.log(`${womensFashionWatchesData?.length} data items scraped for women's fashion watches`);
            if(womensFashionWatchesData?.length==0){
                state.ishopchangi.womens_fashion_watches = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping women's fashion watches");
            logError(err);
        }

    if(!state.ishopchangi.womens_fashion_jewellery)
        try{
            womensFashionJewelleryData = await womens_fashion_jewellery(start,end,browser);
            console.log(`${womensFashionJewelleryData?.length} data items scraped for women's fashion jewellery`);
        }
        catch(err){
            console.log("There was an error while scraping women's fashion jewellery");
            logError(err);
        }

    if(!state.ishopchangi.womens_fashion_jewellery && womensFashionJewelleryData?.length==0)
        try{
            womensFashionJewelleryData = await womens_fashion_jewellery(start,end,browser);
            console.log(`${womensFashionJewelleryData?.length} data items scraped for women's fashion jewellery`);
            if(womensFashionJewelleryData?.length==0){
                state.ishopchangi.womens_fashion_jewellery = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping women's fashion jewellery");
            logError(err);
        }

    if(!state.ishopchangi.womens_fashion_accessories)
        try{
            womensFashionAccessoriesData = await womens_fashion_accessories(start,end,browser);
            console.log(`${womensFashionAccessoriesData?.length} data items scraped for women's fashion accessories`);
        }
        catch(err){
            console.log("There was an error while scraping women's fashion accessories");
            logError(err);
        }

    if(!state.ishopchangi.womens_fashion_accessories && womensFashionAccessoriesData?.length==0)
        try{
            womensFashionAccessoriesData = await womens_fashion_accessories(start,end,browser);
            console.log(`${womensFashionAccessoriesData?.length} data items scraped for women's fashion accessories`);
            if(womensFashionAccessoriesData?.length==0){
                state.ishopchangi.womens_fashion_accessories = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping women's fashion accessories");
            logError(err);
        }

    if(!state.ishopchangi.womens_fashion_shoes)
        try{
            womensFashionShoesData = await womens_fashion_shoes(start,end,browser);
            console.log(`${womensFashionShoesData?.length} data items scraped for women's fashion shoes`);
        }
        catch(err){
            console.log("There was an error while scraping women's fashion shoes");
            logError(err);
        }

    if(!state.ishopchangi.womens_fashion_shoes && womensFashionShoesData?.length==0)
        try{
            womensFashionShoesData = await womens_fashion_shoes(start,end,browser);
            console.log(`${womensFashionShoesData?.length} data items scraped for women's fashion shoes`);
            if(womensFashionShoesData?.length==0){
                state.ishopchangi.womens_fashion_shoes = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping women's fashion shoes");
            logError(err);
        }

    if(!state.ishopchangi.womens_apparels)
        try{
            womensApparelsData = await womens_apparels(start,end,browser);
            console.log(`${womensApparelsData?.length} data items scraped for women's apparels`);
        }
        catch(err){
            console.log("There was an error while scraping women's apparels");
            logError(err);
        }

    if(!state.ishopchangi.womens_apparels && womensApparelsData?.length==0)
        try{
            womensApparelsData = await womens_apparels(start,end,browser);
            console.log(`${womensApparelsData?.length} data items scraped for women's apparels`);
            if(womensApparelsData?.length==0){
                state.ishopchangi.womens_apparels = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping women's apparels");
            logError(err);
        }

    // Men's Fashion categories
    if(!state.ishopchangi.mens_fashion_bags)
        try{
            mensFashionBagsData = await mens_fashion_bags(start,end,browser);
            console.log(`${mensFashionBagsData?.length} data items scraped for men's fashion bags`);
        }
        catch(err){
            console.log("There was an error while scraping men's fashion bags");
            logError(err);
        }

    if(!state.ishopchangi.mens_fashion_bags && mensFashionBagsData?.length==0)
        try{
            mensFashionBagsData = await mens_fashion_bags(start,end,browser);
            console.log(`${mensFashionBagsData?.length} data items scraped for men's fashion bags`);
            if(mensFashionBagsData?.length==0){
                state.ishopchangi.mens_fashion_bags = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping men's fashion bags");
            logError(err);
        }

    if(!state.ishopchangi.mens_small_leather_goods)
        try{
            mensSmallLeatherGoodsData = await mens_small_leather_goods(start,end,browser);
            console.log(`${mensSmallLeatherGoodsData?.length} data items scraped for men's small leather goods`);
        }
        catch(err){
            console.log("There was an error while scraping men's small leather goods");
            logError(err);
        }

    if(!state.ishopchangi.mens_small_leather_goods && mensSmallLeatherGoodsData?.length==0)
        try{
            mensSmallLeatherGoodsData = await mens_small_leather_goods(start,end,browser);
            console.log(`${mensSmallLeatherGoodsData?.length} data items scraped for men's small leather goods`);
            if(mensSmallLeatherGoodsData?.length==0){
                state.ishopchangi.mens_small_leather_goods = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping men's small leather goods");
            logError(err);
        }

    if(!state.ishopchangi.mens_fashion_watches)
        try{
            mensFashionWatchesData = await mens_fashion_watches(start,end,browser);
            console.log(`${mensFashionWatchesData?.length} data items scraped for men's fashion watches`);
        }
        catch(err){
            console.log("There was an error while scraping men's fashion watches");
            logError(err);
        }

    if(!state.ishopchangi.mens_fashion_watches && mensFashionWatchesData?.length==0)
        try{
            mensFashionWatchesData = await mens_fashion_watches(start,end,browser);
            console.log(`${mensFashionWatchesData?.length} data items scraped for men's fashion watches`);
            if(mensFashionWatchesData?.length==0){
                state.ishopchangi.mens_fashion_watches = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping men's fashion watches");
            logError(err);
        }

    if(!state.ishopchangi.mens_fashion_jewellery)
        try{
            mensFashionJewelleryData = await mens_fashion_jewellery(start,end,browser);
            console.log(`${mensFashionJewelleryData?.length} data items scraped for men's fashion jewellery`);
        }
        catch(err){
            console.log("There was an error while scraping men's fashion jewellery");
            logError(err);
        }

    if(!state.ishopchangi.mens_fashion_jewellery && mensFashionJewelleryData?.length==0)
        try{
            mensFashionJewelleryData = await mens_fashion_jewellery(start,end,browser);
            console.log(`${mensFashionJewelleryData?.length} data items scraped for men's fashion jewellery`);
            if(mensFashionJewelleryData?.length==0){
                state.ishopchangi.mens_fashion_jewellery = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping men's fashion jewellery");
            logError(err);
        }

    if(!state.ishopchangi.mens_fashion_accessories)
        try{
            mensFashionAccessoriesData = await mens_fashion_accessories(start,end,browser);
            console.log(`${mensFashionAccessoriesData?.length} data items scraped for men's fashion accessories`);
        }
        catch(err){
            console.log("There was an error while scraping men's fashion accessories");
            logError(err);
        }

    if(!state.ishopchangi.mens_fashion_accessories && mensFashionAccessoriesData?.length==0)
        try{
            mensFashionAccessoriesData = await mens_fashion_accessories(start,end,browser);
            console.log(`${mensFashionAccessoriesData?.length} data items scraped for men's fashion accessories`);
            if(mensFashionAccessoriesData?.length==0){
                state.ishopchangi.mens_fashion_accessories = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping men's fashion accessories");
            logError(err);
        }

    if(!state.ishopchangi.mens_fashion_shoes)
        try{
            mensFashionShoesData = await mens_fashion_shoes(start,end,browser);
            console.log(`${mensFashionShoesData?.length} data items scraped for men's fashion shoes`);
        }
        catch(err){
            console.log("There was an error while scraping men's fashion shoes");
            logError(err);
        }

    if(!state.ishopchangi.mens_fashion_shoes && mensFashionShoesData?.length==0)
        try{
            mensFashionShoesData = await mens_fashion_shoes(start,end,browser);
            console.log(`${mensFashionShoesData?.length} data items scraped for men's fashion shoes`);
            if(mensFashionShoesData?.length==0){
                state.ishopchangi.mens_fashion_shoes = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping men's fashion shoes");
            logError(err);
        }

    if(!state.ishopchangi.mens_apparels)
        try{
            mensApparelsData = await mens_apparels(start,end,browser);
            console.log(`${mensApparelsData?.length} data items scraped for men's apparels`);
        }
        catch(err){
            console.log("There was an error while scraping men's apparels");
            logError(err);
        }

    if(!state.ishopchangi.mens_apparels && mensApparelsData?.length==0)
        try{
            mensApparelsData = await mens_apparels(start,end,browser);
            console.log(`${mensApparelsData?.length} data items scraped for men's apparels`);
            if(mensApparelsData?.length==0){
                state.ishopchangi.mens_apparels = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping men's apparels");
            logError(err);
        }

    // Home and Living categories
    if(!state.ishopchangi.kitchen_and_dining)
        try{
            kitchenAndDiningData = await kitchen_and_dining(start,end,browser);
            console.log(`${kitchenAndDiningData?.length} data items scraped for kitchen and dining`);
        }
        catch(err){
            console.log("There was an error while scraping kitchen and dining");
            logError(err);
        }

    if(!state.ishopchangi.kitchen_and_dining && kitchenAndDiningData?.length==0)
        try{
            kitchenAndDiningData = await kitchen_and_dining(start,end,browser);
            console.log(`${kitchenAndDiningData?.length} data items scraped for kitchen and dining`);
            if(kitchenAndDiningData?.length==0){
                state.ishopchangi.kitchen_and_dining = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping kitchen and dining");
            logError(err);
        }

    if(!state.ishopchangi.personal_care_home_and_living)
        try{
            personalCareHomeAndLivingData = await personal_care_home_and_living(start,end,browser);
            console.log(`${personalCareHomeAndLivingData?.length} data items scraped for personal care home and living`);
        }
        catch(err){
            console.log("There was an error while scraping personal care home and living");
            logError(err);
        }

    if(!state.ishopchangi.personal_care_home_and_living && personalCareHomeAndLivingData?.length==0)
        try{
            personalCareHomeAndLivingData = await personal_care_home_and_living(start,end,browser);
            console.log(`${personalCareHomeAndLivingData?.length} data items scraped for personal care home and living`);
            if(personalCareHomeAndLivingData?.length==0){
                state.ishopchangi.personal_care_home_and_living = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping personal care home and living");
            logError(err);
        }

    if(!state.ishopchangi.beauty_tools)
        try{
            beautyToolsData = await beauty_tools(start,end,browser);
            console.log(`${beautyToolsData?.length} data items scraped for beauty tools`);
        }
        catch(err){
            console.log("There was an error while scraping beauty tools");
            logError(err);
        }

    if(!state.ishopchangi.beauty_tools && beautyToolsData?.length==0)
        try{
            beautyToolsData = await beauty_tools(start,end,browser);
            console.log(`${beautyToolsData?.length} data items scraped for beauty tools`);
            if(beautyToolsData?.length==0){
                state.ishopchangi.beauty_tools = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping beauty tools");
            logError(err);
        }

    if(!state.ishopchangi.wellness_and_health_devices)
        try{
            wellnessAndHealthDevicesData = await wellness_and_health_devices(start,end,browser);
            console.log(`${wellnessAndHealthDevicesData?.length} data items scraped for wellness and health devices`);
        }
        catch(err){
            console.log("There was an error while scraping wellness and health devices");
            logError(err);
        }

    if(!state.ishopchangi.wellness_and_health_devices && wellnessAndHealthDevicesData?.length==0)
        try{
            wellnessAndHealthDevicesData = await wellness_and_health_devices(start,end,browser);
            console.log(`${wellnessAndHealthDevicesData?.length} data items scraped for wellness and health devices`);
            if(wellnessAndHealthDevicesData?.length==0){
                state.ishopchangi.wellness_and_health_devices = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping wellness and health devices");
            logError(err);
        }

    if(!state.ishopchangi.household_essentials)
        try{
            householdEssentialsData = await household_essentials(start,end,browser);
            console.log(`${householdEssentialsData?.length} data items scraped for household essentials`);
        }
        catch(err){
            console.log("There was an error while scraping household essentials");
            logError(err);
        }

    if(!state.ishopchangi.household_essentials && householdEssentialsData?.length==0)
        try{
            householdEssentialsData = await household_essentials(start,end,browser);
            console.log(`${householdEssentialsData?.length} data items scraped for household essentials`);
            if(householdEssentialsData?.length==0){
                state.ishopchangi.household_essentials = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping household essentials");
            logError(err);
        }

    // Babies and Kids categories
    if(!state.ishopchangi.babies_and_kids_fashion)
        try{
            babiesAndKidsFashionData = await babies_and_kids_fashion(start,end,browser);
            console.log(`${babiesAndKidsFashionData?.length} data items scraped for babies and kids fashion`);
        }
        catch(err){
            console.log("There was an error while scraping babies and kids fashion");
            logError(err);
        }

    if(!state.ishopchangi.babies_and_kids_fashion && babiesAndKidsFashionData?.length==0)
        try{
            babiesAndKidsFashionData = await babies_and_kids_fashion(start,end,browser);
            console.log(`${babiesAndKidsFashionData?.length} data items scraped for babies and kids fashion`);
            if(babiesAndKidsFashionData?.length==0){
                state.ishopchangi.babies_and_kids_fashion = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping babies and kids fashion");
            logError(err);
        }

    if(!state.ishopchangi.baby_gears)
        try{
            babyGearsData = await baby_gears(start,end,browser);
            console.log(`${babyGearsData?.length} data items scraped for baby gears`);
        }
        catch(err){
            console.log("There was an error while scraping baby gears");
            logError(err);
        }

    if(!state.ishopchangi.baby_gears && babyGearsData?.length==0)
        try{
            babyGearsData = await baby_gears(start,end,browser);
            console.log(`${babyGearsData?.length} data items scraped for baby gears`);
            if(babyGearsData?.length==0){
                state.ishopchangi.baby_gears = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping baby gears");
            logError(err);
        }

    if(!state.ishopchangi.bath)
        try{
            bathData = await bath(start,end,browser);
            console.log(`${bathData?.length} data items scraped for bath`);
        }
        catch(err){
            console.log("There was an error while scraping bath");
            logError(err);
        }

    if(!state.ishopchangi.bath && bathData?.length==0)
        try{
            bathData = await bath(start,end,browser);
            console.log(`${bathData?.length} data items scraped for bath`);
            if(bathData?.length==0){
                state.ishopchangi.bath = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping bath");
            logError(err);
        }

    if(!state.ishopchangi.feeding_and_nursing)
        try{
            feedingAndNursingData = await feeding_and_nursing(start,end,browser);
            console.log(`${feedingAndNursingData?.length} data items scraped for feeding and nursing`);
        }
        catch(err){
            console.log("There was an error while scraping feeding and nursing");
            logError(err);
        }

    if(!state.ishopchangi.feeding_and_nursing && feedingAndNursingData?.length==0)
        try{
            feedingAndNursingData = await feeding_and_nursing(start,end,browser);
            console.log(`${feedingAndNursingData?.length} data items scraped for feeding and nursing`);
            if(feedingAndNursingData?.length==0){
                state.ishopchangi.feeding_and_nursing = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping feeding and nursing");
            logError(err);
        }

    if(!state.ishopchangi.nursery)
        try{
            nurseryData = await nursery(start,end,browser);
            console.log(`${nurseryData?.length} data items scraped for nursery`);
        }
        catch(err){
            console.log("There was an error while scraping nursery");
            logError(err);
        }

    if(!state.ishopchangi.nursery && nurseryData?.length==0)
        try{
            nurseryData = await nursery(start,end,browser);
            console.log(`${nurseryData?.length} data items scraped for nursery`);
            if(nurseryData?.length==0){
                state.ishopchangi.nursery = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping nursery");
            logError(err);
        }

    if(!state.ishopchangi.toys_and_games)
        try{
            toysAndGamesData = await toys_and_games(start,end,browser);
            console.log(`${toysAndGamesData?.length} data items scraped for toys and games`);
        }
        catch(err){
            console.log("There was an error while scraping toys and games");
            logError(err);
        }

    if(!state.ishopchangi.toys_and_games && toysAndGamesData?.length==0)
        try{
            toysAndGamesData = await toys_and_games(start,end,browser);
            console.log(`${toysAndGamesData?.length} data items scraped for toys and games`);
            if(toysAndGamesData?.length==0){
                state.ishopchangi.toys_and_games = true;
            }
        }
        catch(err){
            console.log("There was an error while scraping toys and games");
            logError(err);
        }

    //merge all data (beauty + electronics + food and beverages + health and wellness + fashion + home and living + babies and kids)
    allData = [...skinCareData, ...makeupData, ...hairCareData, ...fragranceData, ...bathAndBeautyData, ...computersData, ...mobileDevicesData, ...audioDevicesData, ...camerasData, ...snacksData, ...coffeeTeaData, ...healthFoodData, ...souvenirFoodData, ...foodStaplesData, ...familyPlanningData, ...personalCareData, ...wellnessAccessoriesData, ...healthSupplementsData, ...medicalSuppliesData, ...medicationData, ...foodCareData, ...womensFashionBagsData, ...womensSmallLeatherGoodsData, ...womensFashionWatchesData, ...womensFashionJewelleryData, ...womensFashionAccessoriesData, ...womensFashionShoesData, ...womensApparelsData, ...mensFashionBagsData, ...mensSmallLeatherGoodsData, ...mensFashionWatchesData, ...mensFashionJewelleryData, ...mensFashionAccessoriesData, ...mensFashionShoesData, ...mensApparelsData, ...kitchenAndDiningData, ...personalCareHomeAndLivingData, ...beautyToolsData, ...wellnessAndHealthDevicesData, ...householdEssentialsData, ...babiesAndKidsFashionData, ...babyGearsData, ...bathData, ...feedingAndNursingData, ...nurseryData, ...toysAndGamesData];

    //process data
    try{
        allData = await processDataForBeauty(allData);
        console.log(`${allData.length} data items processed`);
    }catch(err){
        console.log("There was an error while processing data");
        logError(err);
    }
    
    //update db
    try{
        await updateDBEntry(allData);
        console.log(`data items updated`);
    }catch(err){
        console.log("There was an error while updating data");
        logError(err);
    }
    
    console.log("entries updated for ishop changi");
    return allData?.length==0;
}

module.exports = scrapeIshopChangi;