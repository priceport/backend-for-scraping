/**
 * Calculate price_per_unit based on product price, quantity, and unit.
 * @param {number} price - The price of the product.
 * @param {number} qty - The quantity of the product.
 * @param {string} unit - The unit of the product (e.g., 'g', 'ml', 'l').
 * @returns {number|null} - The calculated price per unit or null if invalid.
 */
function calculatePricePerUnit(price, qty, unit) {
    if (!price || !qty || !unit) {
      return null; // Invalid input, return null
    }
  
    const unitLower = unit.toLowerCase();
    let pricePerUnit = null;
  
    if (['g', 'gm'].includes(unitLower)) {
      pricePerUnit = price / qty; // Price per gram
    } else if (unitLower === 'ml') {
      pricePerUnit = price / qty; // Price per milliliter
    } else if (unitLower === 'l') {
      pricePerUnit = price / (qty * 1000); // Convert liters to milliliters
    }
  
    return pricePerUnit || null; // Return null if division by zero occurred
  }
  
  module.exports = calculatePricePerUnit;
  