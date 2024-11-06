const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL);

const createLimiter = (options) => {
  return rateLimit({
    store: new RedisStore({
      client: redis,
      prefix: options.prefix || "rl:",
    }),
    windowMs: options.windowMs,
    max: options.max,
    message: options.message,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        message: options.message,
        retryAfter: Math.ceil(options.windowMs / 1000),
      });
    },
  });
};

const apiLimiter = createLimiter({
  prefix: "api:",
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

const searchLimiter = createLimiter({
  prefix: "search:",
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30,
  message: "Search rate limit exceeded, please try again later",
});

module.exports = { apiLimiter, searchLimiter };
