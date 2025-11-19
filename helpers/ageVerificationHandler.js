// Age verification handler for liquor websites
// Handles "Are you over 18?" popups by clicking "yes" button

const waitForXTime = require('./waitForXTime');

const handleAgeVerification = async (page) => {
  try {
    console.log('Checking for age verification popup...');
    
    // Wait for modal to appear
    await waitForXTime(3000);
    
    // Check if page is loaded
    try {
      await page.waitForSelector('body', { timeout: 5000 });
    } catch (e) {
      console.log('Page still loading, waiting more...');
      await waitForXTime(5000);
    }
    
    // Check if age verification modal exists
    const modalExists = await page.$('.modal-content');
    if (!modalExists) {
      console.log('✅ No age verification modal found - page is ready');
      return true;
    }
    
    console.log('🔞 Age verification modal detected');
    
    // Find and click "yes" button
    console.log('Looking for age verification buttons...');
    const allButtons = await page.$$('.modal-content button, .modal-content .btn, .modal-content a');
    console.log(`Found ${allButtons.length} buttons in modal`);
    
    for (let i = 0; i < allButtons.length; i++) {
      try {
        const button = allButtons[i];
        const text = await button.evaluate(el => el.innerText?.toLowerCase().trim());
        console.log(`Button ${i + 1} text: "${text}"`);
        
        if (text && text.includes('yes')) {
          console.log('✅ Found "yes" button, clicking...');
          await button.click();
          await waitForXTime(3000);
          console.log('✅ Age verification completed via button click');
          return true;
        }
      } catch (e) {
        console.log(`⚠️ Error with button ${i + 1}:`, e.message);
      }
    }
    
    // Fallback: Remove modal from DOM if no "yes" button found
    console.log('⚠️ No "yes" button found, removing modal from DOM...');
    const removed = await page.evaluate(() => {
      let removed = false;
      
      // Remove modal content
      const modal = document.querySelector('.modal-content');
      if (modal) {
        modal.remove();
        removed = true;
      }
      
      // Remove modal backdrop
      const backdrop = document.querySelector('.modal-backdrop, .modal-overlay, .modal, .modal-dialog');
      if (backdrop) {
        backdrop.remove();
        removed = true;
      }
      
      // Clear body styles
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      
      return removed;
    });
    
    if (removed) {
      console.log('✅ Age verification modal removed from DOM');
      await waitForXTime(1000);
      return true;
    }
    
    console.log('❌ Could not handle age verification automatically');
    return false;
    
  } catch (error) {
    console.log('❌ Error handling age verification:', error.message);
    return false;
  }
};

module.exports = handleAgeVerification;
