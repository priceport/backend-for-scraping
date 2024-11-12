const { DateTime } = require('luxon');

function checkMaintenance(req, res, next) {
  // Get the current time in Auckland (New Zealand timezone)
  const currentTime = DateTime.now().setZone('Pacific/Auckland');

  // Get the current hour in Auckland time
  const currentHour = currentTime.hour;

  // Check if the current time is between 12 AM and 7 AM
  if (currentHour >= 0 && currentHour < 7) {
    return res.status(503).json({ message: 'Temporary closed for maintenance' });
  }

  // If not, proceed with the next middleware
  next();
}

module.exports = checkMaintenance;
