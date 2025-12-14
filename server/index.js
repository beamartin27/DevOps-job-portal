const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config/api');
const axios = require('axios');
const { connectDatabase } = require('./config/database');
const JobService = require('./services/jobService');

const app = express();

// Connect to database on startup
let dbConnected = false;
connectDatabase()
  .then(connection => {
    if (connection) {
      dbConnected = true;
    }
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });

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
    port: config.server.port,
    hasDatabase: dbConnected,
    dbConnectionString: process.env.DB_CONNECTION_STRING ? 'SET' : 'NOT SET'
  });
});

// Handler for getting jobs with pagination and search
const getJobsHandler = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, location_filter } = req.query;
    
    // Priority 1: Try database if connected
    if (dbConnected) {
      try {
        const result = await JobService.getJobsFromDatabase({
          search,
          location_filter,
          page,
          limit
        });

        // If we have jobs in database, return them
        if (result.jobs.length > 0) {
          return res.json({
            success: true,
            data: result.jobs,
            pagination: {
              page: result.page,
              limit: result.limit,
              total: result.total,
              totalPages: result.totalPages
            },
            source: 'database'
          });
        }

        // If database is empty and RapidAPI is available, sync and return
        if (config.rapidApi.key && result.jobs.length === 0) {
          console.log('📥 Database empty, syncing from RapidAPI...');
          const syncedJobs = await JobService.syncJobsFromRapidAPI({
            search,
            location_filter
          });

          if (syncedJobs.length > 0) {
            // Fetch again from database after sync
            const dbResult = await JobService.getJobsFromDatabase({
              search,
              location_filter,
              page,
              limit
            });

            return res.json({
              success: true,
              data: dbResult.jobs,
              pagination: {
                page: dbResult.page,
                limit: dbResult.limit,
                total: dbResult.total,
                totalPages: dbResult.totalPages
              },
              source: 'database_synced'
            });
          }
        }
      } catch (dbError) {
        console.error('Database error, falling back to API:', dbError.message);
        // Fall through to API/mock data
      }
    }

    // Priority 2: Use RapidAPI if configured
    if (config.rapidApi.key) {
      const apiHost = config.rapidApi.host || 'active-jobs-db.p.rapidapi.com';
      const pageNum = parseInt(page);
      let limitNum = parseInt(limit);
      
      if (limitNum < 10) limitNum = 10;
      if (limitNum > 100) limitNum = 100;
      
      const params = {
        limit: limitNum.toString(),
        offset: ((pageNum - 1) * limitNum).toString(),
        description_type: 'text'
      };
      
      if (search) {
        params.title_filter = `"${search}"`;
      }
      
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

      const jobs = response.data || [];
      const total = jobs.length;

      // Save to database if connected (async, don't wait)
      if (dbConnected && jobs.length > 0) {
        JobService.saveJobs(jobs).catch(err => {
          console.error('Error saving jobs to database:', err.message);
        });
      }

      return res.json({
        success: true,
        data: jobs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        },
        source: 'rapidapi'
      });
    }

    // Priority 3: Fallback to mock data
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
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredJobs.length,
        totalPages: Math.ceil(filteredJobs.length / parseInt(limit))
      },
      source: 'mock'
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
};

// Handler for getting single job by ID
const getJobByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Priority 1: Try database if connected
    if (dbConnected) {
      try {
        const job = await JobService.getJobByIdFromDatabase(id);
        if (job) {
          return res.json({
            success: true,
            data: job,
            source: 'database'
          });
        }
      } catch (dbError) {
        console.error('Database error, falling back to API:', dbError.message);
      }
    }

    // Priority 2: Try RapidAPI if configured
    if (config.rapidApi.key) {
      const apiHost = config.rapidApi.host || 'active-jobs-db.p.rapidapi.com';
      
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
        // Save to database if connected (async, don't wait)
        if (dbConnected) {
          JobService.saveJob(job).catch(err => {
            console.error('Error saving job to database:', err.message);
          });
        }

        return res.json({
          success: true,
          data: job,
          source: 'rapidapi'
        });
      }
    }

    // Priority 3: Fallback to mock data
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
        data: mockJob,
        source: 'mock'
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
};

// Get jobs with pagination and search - support both /api/jobs and /jobs
app.get('/api/jobs', getJobsHandler);
app.get('/jobs', getJobsHandler);

// Get single job by ID - support both /api/jobs/:id and /jobs/:id
app.get('/api/jobs/:id', getJobByIdHandler);
app.get('/jobs/:id', getJobByIdHandler);

// Serve React app for all non-API routes (SPA routing)
// This must be after all API routes
app.get('*', (req, res) => {
  // Only serve index.html for non-API routes (exclude /api and /jobs)
  if (!req.path.startsWith('/api') && !req.path.startsWith('/jobs')) {
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
  console.log(`Database: ${dbConnected ? 'CONNECTED' : 'NOT CONNECTED'}`);
  if (process.env.DB_CONNECTION_STRING) {
    console.log(`DB Connection String: ${process.env.DB_CONNECTION_STRING.substring(0, 30)}...`);
  }
});

// Export app for testing
module.exports = app;
