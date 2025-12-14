const mongoose = require('mongoose');

/**
 * Job Schema for MongoDB
 * Stores job listings with all relevant information
 */
const jobSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  company: String,
  organization: String,
  location: String,
  description: String,
  salary: String,
  salary_min: Number,
  salary_max: Number,
  currency: String,
  remote: {
    type: Boolean,
    default: false
  },
  job_type: String,
  posted_date: Date,
  application_url: String,
  source: {
    type: String,
    default: 'rapidapi'
  },
  // Store full job data as JSON for flexibility
  raw_data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  collection: 'jobs'
});

// Compound index for search performance
jobSchema.index({ title: 'text', company: 'text', location: 'text' });

// Ensure unique job IDs
jobSchema.index({ id: 1 }, { unique: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
