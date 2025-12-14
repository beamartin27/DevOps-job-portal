const Job = require('../models/Job');
const axios = require('axios');
const config = require('../config/api');

/**
 * Service for managing jobs in the database
 */
class JobService {
  /**
   * Save or update a job in the database
   */
  static async saveJob(jobData) {
    try {
      const job = await Job.findOneAndUpdate(
        { id: jobData.id || jobData.job_id },
        {
          $set: {
            id: jobData.id || jobData.job_id,
            title: jobData.title,
            company: jobData.company || jobData.organization,
            organization: jobData.organization || jobData.company,
            location: jobData.location,
            description: jobData.description,
            salary: jobData.salary,
            salary_min: jobData.salary_min,
            salary_max: jobData.salary_max,
            currency: jobData.currency,
            remote: jobData.remote || jobData.location?.toLowerCase().includes('remote'),
            job_type: jobData.job_type,
            posted_date: jobData.posted_date ? new Date(jobData.posted_date) : new Date(),
            application_url: jobData.application_url || jobData.url,
            source: jobData.source || 'rapidapi',
            raw_data: jobData
          }
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );
      return job;
    } catch (error) {
      console.error('Error saving job:', error.message);
      throw error;
    }
  }

  /**
   * Save multiple jobs to database
   */
  static async saveJobs(jobsArray) {
    try {
      const operations = jobsArray.map(jobData => ({
        updateOne: {
          filter: { id: jobData.id || jobData.job_id },
          update: {
            $set: {
              id: jobData.id || jobData.job_id,
              title: jobData.title,
              company: jobData.company || jobData.organization,
              organization: jobData.organization || jobData.company,
              location: jobData.location,
              description: jobData.description,
              salary: jobData.salary,
              salary_min: jobData.salary_min,
              salary_max: jobData.salary_max,
              currency: jobData.currency,
              remote: jobData.remote || jobData.location?.toLowerCase().includes('remote'),
              job_type: jobData.job_type,
              posted_date: jobData.posted_date ? new Date(jobData.posted_date) : new Date(),
              application_url: jobData.application_url || jobData.url,
              source: jobData.source || 'rapidapi',
              raw_data: jobData
            }
          },
          upsert: true
        }
      }));

      if (operations.length > 0) {
        await Job.bulkWrite(operations, { ordered: false });
        console.log(`✅ Saved ${operations.length} jobs to database`);
      }
    } catch (error) {
      console.error('Error saving jobs:', error.message);
      throw error;
    }
  }

  /**
   * Fetch jobs from database with filters and pagination
   */
  static async getJobsFromDatabase(filters = {}) {
    const {
      search,
      location_filter,
      page = 1,
      limit = 10
    } = filters;

    const pageNum = parseInt(page);
    let limitNum = parseInt(limit);
    
    // Ensure limit is between 10 and 100
    if (limitNum < 10) limitNum = 10;
    if (limitNum > 100) limitNum = 100;
    
    const offset = (pageNum - 1) * limitNum;

    // Build query
    const query = {};

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } }
      ];
    }

    // Location filter
    if (location_filter) {
      query.location = { $regex: location_filter, $options: 'i' };
    }

    try {
      const [jobs, total] = await Promise.all([
        Job.find(query)
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limitNum)
          .lean(),
        Job.countDocuments(query)
      ]);

      return {
        jobs: jobs.map(job => ({
          ...job.raw_data,
          id: job.id,
          title: job.title,
          company: job.company || job.organization,
          organization: job.organization || job.company,
          location: job.location
        })),
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      };
    } catch (error) {
      console.error('Error fetching jobs from database:', error.message);
      throw error;
    }
  }

  /**
   * Get a single job by ID from database
   */
  static async getJobByIdFromDatabase(id) {
    try {
      const job = await Job.findOne({ id: id }).lean();
      
      if (!job) {
        return null;
      }

      return {
        ...job.raw_data,
        id: job.id,
        title: job.title,
        company: job.company || job.organization,
        organization: job.organization || job.company,
        location: job.location
      };
    } catch (error) {
      console.error('Error fetching job from database:', error.message);
      throw error;
    }
  }

  /**
   * Sync jobs from RapidAPI to database
   */
  static async syncJobsFromRapidAPI(filters = {}) {
    if (!config.rapidApi.key) {
      console.warn('⚠️  RapidAPI key not configured. Cannot sync jobs.');
      return [];
    }

    try {
      const apiHost = config.rapidApi.host || 'active-jobs-db.p.rapidapi.com';
      const params = {
        limit: '100',
        offset: '0',
        description_type: 'text'
      };

      if (filters.search) {
        params.title_filter = `"${filters.search}"`;
      }

      if (filters.location_filter) {
        params.location_filter = filters.location_filter;
      }

      const response = await axios.get('https://active-jobs-db.p.rapidapi.com/active-ats-7d', {
        params,
        headers: {
          'x-rapidapi-key': config.rapidApi.key,
          'x-rapidapi-host': apiHost
        }
      });

      const jobs = Array.isArray(response.data) ? response.data : [];
      
      if (jobs.length > 0) {
        await this.saveJobs(jobs);
      }

      return jobs;
    } catch (error) {
      console.error('Error syncing jobs from RapidAPI:', error.message);
      throw error;
    }
  }
}

module.exports = JobService;
