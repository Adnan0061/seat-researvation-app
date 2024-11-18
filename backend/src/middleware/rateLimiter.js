const rateLimit = require("express-rate-limit");

const createLimiter = (options) => {
  return rateLimit({
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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later",
});

const searchLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 search requests per minute
  message: "Too many search requests, please try again later",
});

module.exports = {
  apiLimiter,
  searchLimiter,
};
