const waitForXTime = require('./waitForXTime');

const PRODUCT_SELECTOR = '#productListCards > .card';

const isCloudflareChallenge = async (page) => {
  try {
    const title = await page.title();
    return title.toLowerCase().includes('just a moment');
  } catch {
    return true;
  }
};

const hasCfClearance = async (page) => {
  const cookies = await page.cookies();
  return cookies.some((c) => c.name === 'cf_clearance');
};

/**
 * Wait until Cloudflare interstitial clears (title / cf_clearance), then wait for product cards.
 */
const waitForBeautyBlissProducts = async (page, { cfTimeoutMs = 60000, productTimeoutMs = 90000 } = {}) => {
  const deadline = Date.now() + cfTimeoutMs;

  while (Date.now() < deadline) {
    const onChallenge = await isCloudflareChallenge(page);
    if (!onChallenge) break;

    const cleared = await hasCfClearance(page);
    if (cleared) {
      // Cookie may exist before title updates after Turnstile reload
      await waitForXTime(2000);
      if (!(await isCloudflareChallenge(page))) break;
    }

    await waitForXTime(1500);
  }

  if (await isCloudflareChallenge(page)) {
    throw new Error('Cloudflare challenge still present after waiting for clearance');
  }

  await page.waitForSelector(PRODUCT_SELECTOR, { visible: true, timeout: productTimeoutMs });
};

module.exports = {
  PRODUCT_SELECTOR,
  isCloudflareChallenge,
  hasCfClearance,
  waitForBeautyBlissProducts,
};
