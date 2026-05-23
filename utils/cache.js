// utils/cache.js
const NodeCache = require('node-cache');

// Cache expires in 60 seconds
const cache = new NodeCache({ stdTTL: 60 });

module.exports = cache;