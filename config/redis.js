const redis = require('redis');

let redisClient;

// Redis connection function
async function connectToRedis() {
    const client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    client.on('error', (err) => {
        console.error('Redis connection error:', err);
    });

    try {
        await client.connect();
        console.log('Connected to Redis successfully');
        redisClient = client;
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }

    return client;
}

// Helper Function
async function getCachedData(key, fetchDataCallback, ttl = 3600) {
    if (!redisClient) {
        console.error('Redis client is not connected');
        throw new Error('Redis client is not connected');
    }

    const cachedData = await redisClient.get(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const data = await fetchDataCallback();
    await redisClient.set(key, ttl, JSON.stringify(data));
    return data;
}

module.exports = { connectToRedis, getCachedData, getRedisClient: () => redisClient }


// const user = await getCachedData(`user:${userId}`, async () => {
//     return await User.findById(userId).select('-password');
// });