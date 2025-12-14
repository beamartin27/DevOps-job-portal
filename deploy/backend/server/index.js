const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config/api');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React app (if deployed together)
// This allows the backend to serve the frontend build files
const publicPath = path.join(__dirname, '../public');
const buildPath = path.join(__dirname, '../client/build');
const staticPath = path.join(__dirname, '../build');

// Try to serve from different possible build locations
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
} else if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
} else if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check configuration
app.get('/api/debug', (req, res) => {
  res.json({
    hasApiKey: !!config.rapidApi.key,
    apiKeyPrefix: config.rapidApi.key ? config.rapidApi.key.substring(0, 10) + '...' : 'NOT SET',
    apiHost: config.rapidApi.host,
    port: config.server.port
  });
});

// Get jobs with pagination and search
app.get('/api/jobs', async (req, res) => {
  try {
    const { search, page = 1, limit = 10, location_filter } = req.query;
    const pageNum = parseInt(page);
    let limitNum = parseInt(limit);
    
    // Ensure limit is between 10 and 100
    if (limitNum < 10) limitNum = 10;
    if (limitNum > 100) limitNum = 100;
    
    // Calculate offset for pagination
    const offset = (pageNum - 1) * limitNum;

    // If RapidAPI is configured, fetch from there
    if (config.rapidApi.key) {
      const apiHost = config.rapidApi.host || 'active-jobs-db.p.rapidapi.com';
      
      const params = {
        limit: limitNum.toString(),
        offset: offset.toString(),
        description_type: 'text'
      };
      
      // Add title_filter if search is provided
      if (search) {
        params.title_filter = `"${search}"`;
      }
      
      // Add location_filter if provided
      if (location_filter) {
        params.location_filter = location_filter;
      }

      const response = await axios.get('https://active-jobs-db.p.rapidapi.com/active-ats-7d', {
        params,
        headers: {
          'x-rapidapi-key': config.rapidApi.key,
          'x-rapidapi-host': apiHost
        }
      });

      // The API response structure may vary, adjust based on actual response
      const jobs = response.data || [];
      const total = jobs.length; // API might not provide total, using current batch length

      return res.json({
        success: true,
        data: jobs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          offset,
          total, // Note: API may not provide total count
          totalPages: Math.ceil(total / limitNum)
        }
      });
    }

    // Fallback: return mock data if API key is not configured
    const mockJobs = [
      {
        id: '1903980996',
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'Remote',
        description: 'We are looking for a skilled software engineer...'
      }
    ];

    let filteredJobs = mockJobs;
    if (search) {
      filteredJobs = mockJobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: filteredJobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredJobs.length,
        totalPages: Math.ceil(filteredJobs.length / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message,
      details: error.response?.data || null
    });
  }
});

// Get single job by ID
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // If RapidAPI is configured, fetch from there
    // Note: This API may not support direct job lookup by ID
    // We'll search for jobs and filter by ID
    if (config.rapidApi.key) {
      const apiHost = config.rapidApi.host || 'active-jobs-db.p.rapidapi.com';
      
      // Try to fetch a batch and find the job by ID
      const response = await axios.get('https://active-jobs-db.p.rapidapi.com/active-ats-7d', {
        params: {
          limit: '100',
          offset: '0',
          description_type: 'text'
        },
        headers: {
          'x-rapidapi-key': config.rapidApi.key,
          'x-rapidapi-host': apiHost
        }
      });

      const jobs = Array.isArray(response.data) ? response.data : [];
      const job = jobs.find(j => j.id === id || j.job_id === id || String(j.id) === String(id));

      if (job) {
        return res.json({
          success: true,
          data: job
        });
      }
    }

    // Fallback: check mock data
    const mockJob = {
      id: '1903980996',
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
      description: 'We are looking for a skilled software engineer...'
    };

    if (mockJob.id === id) {
      return res.json({
        success: true,
        data: mockJob
      });
    }

    res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }
});

// Serve React app for all non-API routes (SPA routing)
// This must be after all API routes
app.get('*', (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api')) {
    const indexPath = path.join(__dirname, '../client/build/index.html');
    const altIndexPath = path.join(__dirname, '../build/index.html');
    const publicIndexPath = path.join(__dirname, '../public/index.html');
    
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else if (fs.existsSync(altIndexPath)) {
      res.sendFile(altIndexPath);
    } else if (fs.existsSync(publicIndexPath)) {
      res.sendFile(publicIndexPath);
    } else {
      res.status(404).json({ message: 'Frontend not found. Please build the frontend first.' });
    }
  } else {
    res.status(404).json({ message: 'API endpoint not found' });
  }
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Key configured: ${config.rapidApi.key ? 'YES (' + config.rapidApi.key.substring(0, 10) + '...)' : 'NO'}`);
  console.log(`API Host: ${config.rapidApi.host}`);
});

// Export app for testing
module.exports = app;
