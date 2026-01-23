const Redis = require('ioredis')

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

// Cache wrapper with TTL
class Cache {
  async get(key) {
    try {
      const data = await redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  async set(key, value, ttl = 300) { // Default 5 minutes
    try {
      await redis.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  async del(key) {
    try {
      await redis.del(key)
    } catch (error) {
      console.error('Cache del error:', error)
    }
  }

  async clearPattern(pattern) {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(keys)
      }
    } catch (error) {
      console.error('Cache clear pattern error:', error)
    }
  }
}

const cache = new Cache()

module.exports = cache