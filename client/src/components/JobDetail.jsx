import React from 'react';
import { X, MapPin, Briefcase, DollarSign, Calendar, ExternalLink, Building } from 'lucide-react';
import { formatDate, formatSalary, getLocationText } from '../utils/formatters';
import './JobDetail.css';

const JobDetail = ({ job, onClose }) => {
  const location = getLocationText(job);
  const salary = formatSalary(job.salary_raw);
  const postedDate = formatDate(job.date_posted);

  return (
    <div className="job-detail">
      <div className="job-detail__header">
        <button 
          className="job-detail__close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="job-detail__content">
        {job.organization_logo && (
          <img 
            src={job.organization_logo} 
            alt={job.organization}
            className="job-detail__logo"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}

        <h2 className="job-detail__title">{job.title}</h2>
        <p className="job-detail__company">{job.organization}</p>

        <div className="job-detail__meta">
          <div className="job-detail__meta-item">
            <MapPin size={18} />
            <span>{location}</span>
          </div>

          {job.employment_type && job.employment_type[0] && (
            <div className="job-detail__meta-item">
              <Briefcase size={18} />
              <span>{job.employment_type[0].replace('_', ' ')}</span>
            </div>
          )}

          {salary && (
            <div className="job-detail__meta-item">
              <DollarSign size={18} />
              <span>{salary}</span>
            </div>
          )}

          <div className="job-detail__meta-item">
            <Calendar size={18} />
            <span>Posted {postedDate}</span>
          </div>

          {job.organization_url && (
            <div className="job-detail__meta-item">
              <Building size={18} />
              <a 
                href={job.organization_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="job-detail__link"
              >
                Company website
              </a>
            </div>
          )}
        </div>

        {job.remote_derived && (
          <div className="job-detail__badges">
            <span className="job-detail__badge job-detail__badge--remote">
              Remote
            </span>
          </div>
        )}

        <div className="job-detail__description">
          <h3 className="job-detail__section-title">Job Description</h3>
          <p className="job-detail__text">
            {job.description_text || 'No description available.'}
          </p>
        </div>

        <a 
          href={job.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="job-detail__apply-button"
        >
          Apply Now
          <ExternalLink size={18} />
        </a>
      </div>
    </div>
  );
};

export default JobDetail;

