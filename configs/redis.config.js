const redis = require('redis');

// Create a Redis client
const redisClient = redis.createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379,
  },
});

// Connect to Redis
redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch(err => {
  console.error('Error connecting to Redis:', err);
});

module.exports = redisClient;