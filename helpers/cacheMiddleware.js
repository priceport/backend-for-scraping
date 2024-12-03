const redisClient = require("../configs/redis.config");

const cacheMiddleware = async (req, res, next) => {
  const cacheKey = req.originalUrl; // Use the request URL as the cache key

  try {
    // Check if the response is cached
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log('Cache hit');
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log('Cache miss');
    // Override the `res.send` method to cache the response
    const originalSend = res.send.bind(res);

    res.send = (body) => {
      // Only cache successful responses (status code 200)
      if (res.statusCode === 200) {
        redisClient.setEx(cacheKey, 86400, body); // Set a 24-hour expiry
      }
      originalSend(body);
    };

    next();
  } catch (err) {
    console.error('Redis error:', err);
    next(); // Continue without caching if Redis fails
  }
};

module.exports = cacheMiddleware;
