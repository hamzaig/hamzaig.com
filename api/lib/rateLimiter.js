// Simple in-memory rate limiter for bot prevention
// In production, consider using Redis for distributed rate limiting

const rateLimitStore = new Map();

/**
 * Rate limiter middleware
 * @param {Object} options - Rate limiting options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 minutes)
 * @param {number} options.maxRequests - Maximum requests per window (default: 3)
 * @returns {Function} Express middleware function
 */
function createRateLimiter(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    maxRequests = 3, // Max 3 submissions per 15 minutes
  } = options;

  return (req, res, next) => {
    // Get identifier (IP address or email)
    const identifier = req.body?.email 
      ? `email:${req.body.email.toLowerCase()}` 
      : `ip:${req.ip || req.connection.remoteAddress || 'unknown'}`;

    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    // Clean up old entries periodically (every 1000 requests)
    if (rateLimitStore.size > 1000) {
      cleanupRateLimitStore(now, windowMs);
    }

    if (!record) {
      // First request from this identifier
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    // Check if window has expired
    if (now > record.resetTime) {
      // Reset the counter
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    // Check if limit exceeded
    if (record.count >= maxRequests) {
      const remainingTime = Math.ceil((record.resetTime - now) / 1000 / 60);
      return res.status(429).json({
        ok: false,
        error: `Too many requests. Please try again in ${remainingTime} minute(s).`,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    // Increment counter
    record.count++;
    rateLimitStore.set(identifier, record);
    next();
  };
}

/**
 * Clean up expired rate limit entries
 */
function cleanupRateLimitStore(now, windowMs) {
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check if a request is likely from a bot
 * @param {Object} req - Express request object
 * @param {Object} body - Request body
 * @returns {Object} { isBot: boolean, reason: string }
 */
function detectBot(req, body) {
  const reasons = [];

  // 1. Honeypot field check (if filled, it's a bot)
  if (body.website && body.website.trim() !== '') {
    reasons.push('Honeypot field was filled');
  }

  // 2. Time-based check (if submitted too quickly, likely a bot)
  const minTimeSpent = 3; // Minimum 3 seconds
  if (body.timeSpent && parseFloat(body.timeSpent) < minTimeSpent) {
    reasons.push(`Form submitted too quickly (${parseFloat(body.timeSpent).toFixed(1)}s < ${minTimeSpent}s)`);
  }

  // 3. Suspicious user agent check
  const userAgent = req.headers['user-agent'] || '';
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /^$/i, // Empty user agent
  ];
  
  const isSuspiciousUA = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  // Only flag if it's clearly a bot (not just contains "bot" which might be in legitimate browsers)
  if (isSuspiciousUA && !userAgent.match(/chrome|firefox|safari|edge|opera/i)) {
    reasons.push('Suspicious user agent detected');
  }

  // 4. Missing or suspicious referrer (optional - can be disabled for API-only usage)
  // This might be too strict if forms are embedded in other sites
  // const referer = req.headers.referer || req.headers.referrer || '';
  // if (!referer) {
  //   reasons.push('Missing referer header');
  // }

  // 5. Check for common bot patterns in email
  if (body.email) {
    const email = String(body.email).toLowerCase();
    const botEmailPatterns = [
      /^test@/i,
      /^spam@/i,
      /@example\./i,
      /@test\./i,
      /^[a-z0-9]{10,}@[a-z0-9]{5,}\.[a-z]{2,}$/i, // Random-looking emails
    ];
    
    // Only flag if multiple patterns match (to avoid false positives)
    const matchingPatterns = botEmailPatterns.filter(pattern => pattern.test(email));
    if (matchingPatterns.length >= 2) {
      reasons.push('Suspicious email pattern detected');
    }
  }

  return {
    isBot: reasons.length > 0,
    reasons: reasons,
  };
}

module.exports = {
  createRateLimiter,
  detectBot,
  cleanupRateLimitStore,
};

