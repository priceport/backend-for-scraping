const redis = require('redis');

(async () => {
    const redisClient = redis.createClient({
        socket: {
            host: '127.0.0.1',
            port: 6379,
        },
    });

    redisClient.on('error', (err) => {
        console.error('Redis error:', err.message);
    });

    try {
        await redisClient.connect();
        console.log('Redis connected successfully.');
        await redisClient.set('test_key', 'test_value');
        const value = await redisClient.get('test_key');
        console.log('Retrieved value:', value);
        await redisClient.quit();
    } catch (err) {
        console.error('Error during Redis operations:', err.message);
    }
})();
