const path = require('path');

// Load .env from job-portal root directory
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Also try loading from server directory if not found
if (!process.env.RAPIDAPI_KEY) {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

module.exports = {
  rapidApi: {
    key: process.env.RAPIDAPI_KEY,
    host: process.env.RAPIDAPI_HOST || 'active-jobs-db.p.rapidapi.com',
    baseUrl: 'https://rapidapi.com'
  },
  server: {
    port: process.env.PORT || 5000
  }
};

