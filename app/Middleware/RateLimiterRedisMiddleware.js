const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const httpStatus = require('http-status-codes');

class RateLimiterRedisMiddleware {
  constructor() {
    this.redisClient = redis.createClient({
      host: 'localhost',
      port: 6379,
      enable_offline_queue: false,
    });

    this.rateLimiter = new RateLimiterRedis({
      redis: this.redisClient,
      keyPrefix: 'middleware',
      points: 10, // 10 requests
      duration: 1, // per 1 second by IP
    });
  }

  async check(request, response, next) {
    try {
      await this.rateLimiter.consume(request.ip);
      return next();
    } catch (err) {
      return response.status(httpStatus.TOO_MANY_REQUESTS).json({
        message: 'Demasiadas peticiones',
        data: null,
      });
    }
  }
}

module.exports = RateLimiterRedisMiddleware;
